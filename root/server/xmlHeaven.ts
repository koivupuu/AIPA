import axios from 'axios';
import * as xml2js from 'xml2js';
import ProcurementCall from './models/procurementCall';
import ProcurementCallJson from './models/procurementCallJson';
import AwardNotice from './models/awardNotice';
import './config/database';

interface DataFields {
  title: string;
  docid: string;
  dateForSubmission: string;
  datePublished: string;
  cpvCodes: string;
  awardNoticeRef?: any;
  relevantText: string[];
  lgOrig: string;
  isoCountry: string;
  iaUrlEtendering: string;
  uriDocText: string;
  documentType: string;
  valuesList: any;
}

const url: string = 'https://ted.europa.eu/api/v3.0/notices/search?fields=CONTENT&latestChange=false&pageNum=';
const todaysDate = getTodaysDate();
const query = `q=PD%3D%5B${todaysDate}%5D%20&reverseOrder=false&scope=2&sortField=ND`;
const pageSize: number = 100;

async function processPage(pageNum: number): Promise<boolean> {
  const pageUrl = `${url}${pageNum}&pageSize=${pageSize}&${query}`;

  try {
    const response = await axios.get(pageUrl);

    if (response.status !== 200) {
      console.log(`Error fetching page ${pageNum}. Status: ${response.status}`);
      return false;
    }

    // Check for the specific response
    if (response.data && response.data.total === 0 && response.data.results.length === 0) {
      console.log('No results found. Exiting...');
      process.exit(0);
    }

    if (response.data && response.data.results && response.data.results.length > 0) {
      let counter: number = 1;
      const parser = new xml2js.Parser();

      for (const result of response.data.results) {
        console.log(`Processing procurement ${counter} on page ${pageNum}`);

        const base64EncodedXml: string = result.content;
        const xmlString: string = Buffer.from(base64EncodedXml, 'base64').toString();
        const jsonObj = await parser.parseStringPromise(xmlString);

        if (!jsonObj.TED_EXPORT) {
          console.log(`Skipping procurement ${counter} on page ${pageNum} due to invalid structure`);
          counter++;
          continue;
        }

        const docId: string = jsonObj.TED_EXPORT.$.DOC_ID;

        const existingProcurement = await ProcurementCall.findOne({ docid: docId });
        if (existingProcurement) {
          console.log(`Skipping procurement ${counter} on page ${pageNum} as it already exists`);
          counter++;
          continue;
        }

        let procurementCall: InstanceType<typeof ProcurementCall> | null = null;

        let awardNoticeRef;  // This will store the reference to the AwardNotice if created
        const relevantTexts: string[] = extractP(jsonObj.TED_EXPORT.FORM_SECTION, "P");
        const dataFields: DataFields = {
          title: (relevantTexts[0]) || (relevantTexts[1]), // relevantTexts[0] could be an empty string due to recursion
          docid: docId,
          dateForSubmission: jsonObj.TED_EXPORT.CODED_DATA_SECTION[0].CODIF_DATA[0].DT_DATE_FOR_SUBMISSION?.[0] || "Not specified",
          datePublished: jsonObj.TED_EXPORT.CODED_DATA_SECTION[0].REF_OJS[0].DATE_PUB[0],
          cpvCodes: jsonObj.TED_EXPORT.CODED_DATA_SECTION[0].NOTICE_DATA[0].ORIGINAL_CPV[0].$.CODE,
          awardNoticeRef: awardNoticeRef,
          relevantText: relevantTexts,
          lgOrig: jsonObj.TED_EXPORT.CODED_DATA_SECTION[0].NOTICE_DATA[0].LG_ORIG[0],
          isoCountry: jsonObj.TED_EXPORT.CODED_DATA_SECTION[0].NOTICE_DATA[0].ISO_COUNTRY[0].$.VALUE,
          iaUrlEtendering: jsonObj.TED_EXPORT.CODED_DATA_SECTION[0].NOTICE_DATA[0].IA_URL_ETENDERING?.[0] || "Not specified",
          uriDocText: jsonObj.TED_EXPORT.CODED_DATA_SECTION[0].NOTICE_DATA[0].URI_LIST[0].URI_DOC[0]._,
          documentType: jsonObj.TED_EXPORT.CODED_DATA_SECTION[0].CODIF_DATA[0].TD_DOCUMENT_TYPE[0]._,
          valuesList: jsonObj.TED_EXPORT.CODED_DATA_SECTION[0].NOTICE_DATA[0].VALUES_LIST?.VALUES ||
            jsonObj.TED_EXPORT.CODED_DATA_SECTION[0].NOTICE_DATA[0].VALUES?.[0].VALUE?.[0]._ || "Not specified"
        };

        if (jsonObj.TED_EXPORT.CODED_DATA_SECTION[0].CODIF_DATA[0].TD_DOCUMENT_TYPE[0]._ === "Contract award notice") {

          // Extract the awardContract
          const awardContract =
            (jsonObj.TED_EXPORT.FORM_SECTION[0].F03_2014?.[0]?.AWARD_CONTRACT) ||
            (jsonObj.TED_EXPORT.FORM_SECTION[0].F06_2014?.[0]?.AWARD_CONTRACT) ||
            (jsonObj.TED_EXPORT.FORM_SECTION[0].F21_2014?.[0]?.AWARD_CONTRACT);

          if (awardContract) {
            // Extract the contract details
            const contractDetails = awardContract.map((contract: any) => {
              return {
                officialName: (contract.AWARDED_CONTRACT?.[0].CONTRACTORS?.[0]?.CONTRACTOR[0]?.ADDRESS_CONTRACTOR[0].OFFICIALNAME?.[0]) || "Not specified",
                country: (contract.AWARDED_CONTRACT?.[0].CONTRACTORS?.[0]?.CONTRACTOR[0]?.ADDRESS_CONTRACTOR[0].COUNTRY[0].$.VALUE) || "Not specified",
                dateConclusion: (contract.AWARDED_CONTRACT?.[0].DATE_CONCLUSION_CONTRACT?.[0]) || "Not specified",
                totalValue: (contract.AWARDED_CONTRACT?.[0].VALUES?.[0]?.VAL_TOTAL?.[0]._) || "Not specified"
              };
            });

            // Here, create the ProcurementCall first, so you have its _id for reference
            procurementCall = await ProcurementCall.create(dataFields);

            // Create the AwardNotice with reference to the ProcurementCall's _id
            const createdAwardNotice = await AwardNotice.create({
              contractDetails: contractDetails,
              procurementCallRef: procurementCall._id  // Using actual ObjectId of ProcurementCall for reference
            });

            awardNoticeRef = createdAwardNotice._id;  // Store the AwardNotice's id to set in the ProcurementCall

            // Update the ProcurementCall with the reference to the created AwardNotice
            await ProcurementCall.findByIdAndUpdate(procurementCall._id, { awardNoticeRef: awardNoticeRef });

          } else {
            procurementCall = await ProcurementCall.create(dataFields);
          }

        } else {
          procurementCall = await ProcurementCall.create(dataFields);
        }

        const jsonData = {
          originalId: procurementCall._id,
          data: jsonObj
        };
        const createdJson = await ProcurementCallJson.create(jsonData);

        await ProcurementCall.findByIdAndUpdate(procurementCall._id, { jsondata: createdJson._id });

        counter++;
      }
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message === "The requested page number doesn't exist.") {
      console.error('The requested page number doesn\'t exist.');
      process.exit(0);
    } else {
      console.error('Error:', error);
    }
    return false;
  }
}

async function fetchPages(pageNum: number): Promise<void> {
  try {
    while (true) {
      console.log(`Processing Page ${pageNum}`);
      const success = await processPage(pageNum);
      if (!success) {
        console.log(`Stopping loop. Last processed page: ${pageNum - 1}`);
        break;
      }
      pageNum++;
    }
  } catch (error: any) {
    if (error.message) console.log(error.message);
    pageNum += 1;
    fetchPages(pageNum);
  }
}

function getTodaysDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function extractP(obj: any, key: string): string[] {
  let arr: string[] = [];
  if (!obj) return arr;
  if (Array.isArray(obj)) {
    for (let i in obj) {
      arr.push(...extractP(obj[i], key));
    }
    return arr;
  }
  if (obj[key]) {
    if (Array.isArray(obj[key])) {
      arr.push(...obj[key].filter((item: any) => typeof item === 'string'));
    } else if (typeof obj[key] === 'string') {
      arr.push(obj[key]);
    }
  }

  if (typeof obj == "object" && obj !== null) {
    let children = Object.keys(obj);
    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        arr.push(...extractP(obj[children[i]], key));
      }
    }
  }
  return arr;
}

fetchPages(1);
