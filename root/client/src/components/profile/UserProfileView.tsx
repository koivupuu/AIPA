/**
 * 
 * UserProfileView
 * 
 * This component is the main part of the platform. 
 * We come here from the loginView and start operating on the information passed as a prop.
 * The company subprofiles are fetched here. Each subProfile is passed to the sidebar. 
 * The main logic for profile creation is the following:
 *  1. User gives information about the company (links or documents) 
 *  2. Based on that information relevant search parameters are created. 
 *  3. User verifies the data
 *  4. Subprofile is updated to database and passed down to search component
 * 
 */
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import GPTAPISearch from '../utils/GPTAPISearch';
import ToolTip from "../utils/Tooltip";
import DropdownCheckbox from "./checkbox";
import axios from 'axios';
import ExampleStrategy from "../utils/exampleStrategy";
import ExampleFinancials from "../utils/exampleFinancials";
import ExamplePastWorks from "../utils/examplePastWorks";
import Sidebar from '../sidebar/Sidebar';
import { FaDownload } from 'react-icons/fa';
import { ImMenu } from "react-icons/im";
import ScrapeHeaders from "../utils/scrape";
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { countriesList } from "../utils/Countries";
import OldSearches from './oldSearches';
import { useAuth0 } from '@auth0/auth0-react';

interface UserProfileViewProps {
  setView: (view: string) => void; // Assuming setView receives a string as its argument, you might want to adjust the type if different.
  cname: string;
  updateSubProfile: Dispatch<SetStateAction<ProfileType>>; 
  initialSubProfile: ProfileType; 
  setSearchID: (id: string) => void; 
  handleLogout: () => void;
  setUseCase: (state: number) => void; 
}


type ReadOnlyFieldsType = {
  companyName: boolean;
  strategy: boolean;
  financialDocuments: boolean;
  pastWorks: boolean;
  cpvCodes: boolean;
  industry: boolean;
  tenderSize: boolean;
  lowestcost: boolean;
  highestcost: boolean;
  description: boolean,
  exclude: boolean,
  dislikedLocations: boolean,
  languages: boolean,
  keywords: boolean;
};


type ProfileType = {
  _id: string,
  subProfileName: string,
  strategy: string,
  financialDocuments: string,
  pastWorks: string,
  cpvCodes: string[],
  industry: string,
  tenderSize: string,
  lowestcost: string,
  highestcost: string,
  description: string,
  exclude: string[],
  dislikedLocations: string[],
  languages: string[],
  lastLanguages: string[],
  keywords: string[],
  lastKeywords: string[],  
};


const UserProfileView: React.FC<UserProfileViewProps> = ({ setUseCase, handleLogout, setView, cname, updateSubProfile, initialSubProfile, setSearchID }) => {
  const { getAccessTokenSilently } = useAuth0();
  const initialProfile: ProfileType = initialSubProfile ? initialSubProfile : {
    _id: "-1",
    subProfileName: "Init",
    strategy: "",
    financialDocuments: "",
    pastWorks: "",
    cpvCodes: [],
    industry: "",
    tenderSize: "",
    lowestcost: "",
    highestcost: "",
    description: "",
    exclude: [],
    dislikedLocations: [],
    languages: [],
    lastLanguages: [],
    keywords: [],
    lastKeywords: [],
  };

  const [subProfile, setSubProfile] = useState<ProfileType>(initialProfile);
  const [subProfiles, setSubProfiles] = useState<ProfileType[]>([]);
  const [profileID, setProfileID] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('Select File');
  const [selectedFinancial, setSelectedFinancial] = useState<string>('Select File');
  const [selectedPastWorks, setSelectedPast] = useState<string>('Select File');
  const [useDocs, setUseDocs] = useState<boolean>(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState<boolean>(false);
  const [useAwardNotices, setUseAwardNotices] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile/fetch/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
        if (response.data) {
          setProfileID(response.data._id);
          if (response.data.subProfiles && response.data.subProfiles.length > 0) {
            if (initialSubProfile && initialProfile._id !== "-1") setSubProfile(initialSubProfile);
            else setSubProfile(response.data.subProfiles[0]);
            setSubProfiles(response.data.subProfiles);
          } else if (response.data.subProfile) {
            setSubProfile(response.data.subProfile);
            setSubProfiles([response.data.subProfile]);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    setSearchID('');
    fetchProfile();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cname, initialSubProfile]);

  useEffect(() => {
    localStorage.setItem('useAward', JSON.stringify({ useAward: false }));
  }, []);


  const saveSubProfile = async () => {
    const subProfileId = subProfile._id;
    // Send a put request to the server
    const token = await getAccessTokenSilently();
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/profile/subprofile/update/${subProfileId}`, { subProfile: subProfile },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setView('profile');
      })
      .catch(error => {
        console.error('Error creating profile:', error);
      });
  };

  const fieldsToSplit: Set<string> = new Set(["cpvCodes", "exclude", "dislikedLocations", "keywords"]);

  const shouldSplit = (fieldName: string): boolean => fieldsToSplit.has(fieldName);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    let tempValue: string[] = [];
    if (shouldSplit(name)) {
      tempValue = value.split(',').map(item => item.trim());
    }
    if (tempValue.length > 0) setSubProfile(prevProfile => ({ ...prevProfile, [name]: tempValue }));
    else setSubProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  // State for file contents
  const [fileContents, setFileContents] = useState({
    strategy: "",
    financialDocuments: "",
    pastWorks: ""
  });


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files || e.target.files.length === 0) return; // Early return if there's no target or files

    const file = e.target.files[0];
    const reader = new FileReader();
    const name = e.target.name;


    const allowedExtensions = ['.xlsx', '.docx', '.txt']; // add more if needed
    const fileExtension = `.${file.name.split('.').pop()}`;

    if (!allowedExtensions.includes(fileExtension)) {
      alert('Invalid file type. Please upload a valid document. Valid document file types are .xlsx, .docx, .txt.');
      return; // Stop further processing
    }

    if (name === "strategy") setSelectedStrategy(file.name);
    if (name === "financialDocuments") setSelectedFinancial(file.name);
    if (name === "pastWorks") setSelectedPast(file.name);


    reader.onload = (e) => {
      const target = e.target as FileReader;
      if (file.name.endsWith('.xlsx')) {
        const data = new Uint8Array(target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // For simplicity, this will read the first sheet; adjust as needed.
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert the worksheet to CSV format
        const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

        setSubProfile({ ...subProfile, [name]: csvOutput });
        setFileContents(prevState => ({ ...prevState, [name]: csvOutput }));
      } else if (file.name.endsWith('.docx')) {
        // For DOCX files using jszip
        const zip = new JSZip();
        zip.loadAsync(target.result as ArrayBuffer).then((zipContents) => {
          const file = zipContents.file("word/document.xml");
          if (file) {
            file.async("string").then((content) => {
              // Extracting text from content; This is a basic extraction; you may need to handle various XML tags.
              const textContent = content.replace(/<.*?>/g, '');
              setSubProfile({ ...subProfile, [name]: textContent });
              setFileContents(prevState => ({ ...prevState, [name]: textContent }));
            });
          } else {
            console.error("Could not find 'word/document.xml' in the zip contents.");
          }
        });
      } else {

        // For plain text files
        setSubProfile({ ...subProfile, [name]: target.result });
        setFileContents(prevState => ({ ...prevState, [name]: target.result }));
      }
    };

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.docx')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleScrape = (name: string, headers: string) => {
    // update the corresponding field in subProfile based on the name
    setSubProfile({ ...subProfile, [name]: headers });
    setFileContents(prevState => ({ ...prevState, [name]: headers }));
  };

  const areAllFieldsEmpty = () => {
    if (Array.isArray(subProfile['cpvCodes']) && subProfile['cpvCodes'].length > 0) {
      return false;
    }
    return true;
  };

  type ParsedXMLResult = {
    cpvcodes: string[];
    industry: string;
    tendersize: string;
    lowestcost: string;
    highestcost: string;
    description: string;
    keywords: string[];
  };

  const parseXML = (data: string): ParsedXMLResult => {
    const keys = ['cpvcodes', 'lowestcost', 'highestcost', 'industry', 'tendersize', 'description', 'keywords'];
    const tags = ['cpv', 'lowestcost', 'highestcost', 'industry', 'tendersize', 'description', 'keywords'];

    const result: ParsedXMLResult = {
      cpvcodes: [],
      industry: "",
      tendersize: "",
      lowestcost: "",
      highestcost: "",
      description: "",
      keywords: []
    };

    tags.forEach((tag, index) => {
      const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, "s");
      const match = data.match(regex);

      if (match && match[1]) {
        // If tag is 'cpv', split the codes into an array
        if (tag === 'cpv' || tag === 'keywords') {
          (result[keys[index] as keyof ParsedXMLResult] as string[]) = match[1].trim().split(',').map((val: string) => val.trim());
        } else {
          (result[keys[index] as keyof ParsedXMLResult] as string) = match[1].trim();
        }
      }
    });

    return result;
  };


  const validateCpvCodes = async (codes: string[]) => {
    const validCodes = [];
    for (let i = 0; i < codes.length; i++) {
      const codeParts = codes[i].split('-');
      const code = {
        mainCode: codeParts[0],
      };

      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cpv/${code.mainCode}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        validCodes.push(`${validCodes.length === 0 ? "" : "\n"}` + code.mainCode + " - " + response.data.englishname); // Push the original code
        console.log("Valid Code", code.mainCode);
      } catch (error) {
        console.error('Invalid CPV code:', code.mainCode);
      }
    }
    return validCodes;
  }

  const handleResult = async (result: string) => {
    let parsedResult = parseXML(result);
    parsedResult.cpvcodes = await validateCpvCodes(parsedResult.cpvcodes);
    if (Array.isArray(parsedResult.keywords)) {
      parsedResult.keywords = parsedResult.keywords.map((keyword, index) =>
        `${index === 0 ? "" : "\n"}` + keyword.trim()
      );
    } else {
      console.error("parsedResult.keywords is not an array!");
    }

    if (parsedResult) {
      setSubProfile(prevProfile => ({
        ...prevProfile,
        cpvCodes: parsedResult.cpvcodes,
        industry: parsedResult.industry,
        tenderSize: parsedResult.tendersize,
        lowestcost: parsedResult.lowestcost,
        highestcost: parsedResult.highestcost,
        description: parsedResult.description,
        keywords: parsedResult.keywords,
      }));
    }
  };

  const [readOnlyFields, setReadOnlyFields] = useState({
    companyName: true,
    strategy: false,
    financialDocuments: false,
    pastWorks: false,
    cpvCodes: false,
    industry: false,
    tenderSize: false,
    lowestcost: false, // added here
    highestcost: false, // added here
    description: false,
    exclude: false,
    dislikedLocations: false,
    languages: false,
    keywords: false // added here
  });


  const [checkAll, setCheckAll] = useState(false);

  const handleCheckAllChange = () => {
    setCheckAll(!checkAll);

    const newState = Object.keys(readOnlyFields).reduce((state, key) => {
      state[key as keyof ReadOnlyFieldsType] = !checkAll;
      return state;
    }, {} as ReadOnlyFieldsType);

    setReadOnlyFields(newState);
  };


  const handleCheckboxChange = (field: keyof ReadOnlyFieldsType) => {
    setReadOnlyFields(prevState => {
      const updatedState = { ...prevState, [field]: !prevState[field] };
      const allChecked = Object.values(updatedState).every(value => value === true);
      setCheckAll(allChecked);
      return updatedState;
    });
  };


  return (
    <div className="flex flex-col xl:mx-96 lg:mx-52 md:p-8 pt-4 bg-white rounded-xl space-y-5">
      <div className="flex flex-col w-full">
        <div>
          <button
            className="absolute left-4 top-3 rounded-lg p-2 bg-transparent justify-self-start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ImMenu size={30} color="white" />
          </button>
        </div>
        <div>
          <button
            className="absolute right-4 top-4 bg-primary-500 md:hover:bg-stop text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setSearchID("");
              updateSubProfile({
                _id: "-1",
                subProfileName: "No Network",
                strategy: "",
                financialDocuments: "",
                pastWorks: "",
                cpvCodes: [],
                industry: "",
                tenderSize: "",
                lowestcost: "", // added here
                highestcost: "", // added here
                description: "",
                exclude: [],
                dislikedLocations: [], // added here
                languages: [],
                lastLanguages: [], // added here
                keywords: [], // added here
                lastKeywords: [],
              });
              setView('home');
              handleLogout();
            }}
          >
            Log Out
          </button>
        </div>
        <h1 className="text-center text-primary-500 font-bold text-4xl mb-5">{cname + " : " + subProfile.subProfileName || "Company Name"}</h1>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
        <div className="w-full my-6 font-bold text-2xl">Company Information</div>
        <div className="col-span-full border-0 border-primary-300 rounded-md p-4">

          {useDocs ? (
            <div>
              {/* Document Inputs */}
              <label className="flex mt-4 text-black font-bold">Strategy Document <ExampleStrategy /></label>
              <div className="flex items-center">
                <label className={`w-full shadow-md border-2 border-primary-100 rounded-lg md:p-12 p-4 text-black cursor-pointer ${readOnlyFields.strategy ? 'bg-gray-300' : 'bg-white'}`}>
                  <div className="flex flex-col items-center justify-center">
                    <FaDownload className="fill-primary-500" size={50} />
                    <span className="text-lg">{selectedStrategy}</span>
                  </div>
                  <input
                    type="file"
                    name="strategy"
                    onChange={handleFileChange}
                    readOnly={readOnlyFields.strategy}
                    style={{ display: "none" }}
                  />
                </label>
                <input type="checkbox" className="mx-4" checked={readOnlyFields.strategy} onChange={() => handleCheckboxChange('strategy')} />
              </div>
              {showAdditionalFields && <div>
                <label className="flex mt-4 text-black font-bold">Financial Documents <ExampleFinancials /></label>
                <div className="flex items-center">
                  <label className={`w-full shadow-md border-2 border-primary-100 rounded-lg md:p-12 p-4  text-black cursor-pointer ${readOnlyFields.financialDocuments ? 'bg-gray-300' : 'bg-white'}`}>
                    <div className="flex flex-col items-center justify-center">
                      <FaDownload className="fill-primary-500" size={50} />
                      <span className="text-lg">{selectedFinancial}</span>
                    </div>
                    <input
                      type="file"
                      name="financialDocuments"
                      onChange={handleFileChange}
                      readOnly={readOnlyFields.financialDocuments}
                      style={{ display: "none" }}
                    />
                  </label>
                  <input type="checkbox" className="mx-4" checked={readOnlyFields.financialDocuments} onChange={() => handleCheckboxChange('financialDocuments')} />
                </div>
                <label className="flex mt-4 text-black font-bold">Past Works <ExamplePastWorks /></label>
                <div className="flex items-center">
                  <label className={`w-full shadow-md border-2 border-primary-100 rounded-lg md:p-12 p-4 text-black cursor-pointer ${readOnlyFields.pastWorks ? 'bg-gray-300' : 'bg-white'}`}>
                    <div className="flex flex-col items-center justify-center">
                      <FaDownload className="fill-primary-500" size={50} />
                      <span className="text-lg">{selectedPastWorks}</span>
                    </div>
                    <input
                      type="file"
                      name="pastWorks"
                      onChange={handleFileChange}
                      readOnly={readOnlyFields.pastWorks}
                      style={{ display: "none" }}
                    />
                  </label>
                  <input type="checkbox" className="mx-4" checked={readOnlyFields.pastWorks} onChange={() => handleCheckboxChange('pastWorks')} />
                </div>
              </div>}
            </div>
          ) : (
            <div>
              {/* Scrape Components */}
              <div>
                <label className="block text-black font-bold">Strategy <ToolTip tooltipText="URL to the page on your company's website that provides an overview of the business strategy and summarizes the company's interests and focus areas." /></label>
                <ScrapeHeaders onFetched={(headers: string) => handleScrape('strategy', headers)} />
              </div>
              {showAdditionalFields &&
                <div>
                  <div>
                    <label className="block text-black font-bold">Financials <ToolTip tooltipText="URL to the page on your company's website that details the financial information and business metrics." /></label>
                    <ScrapeHeaders onFetched={(headers: string) => handleScrape('financialDocuments', headers)} />
                  </div>
                  <div>
                    <label className="block text-black font-bold">Past Works / References <ToolTip tooltipText="URL to the page on your company's website that outlines the typical projects and services your company provides." /></label>
                    <ScrapeHeaders onFetched={(headers: string) => handleScrape('pastWorks', headers)} />
                  </div>
                </div>
              }
            </div>
          )}
          <div className="mt-4">
            <label className="my-4 text-black">
              Show Additional Fields
              <input type="checkbox" className="mx-4" onChange={(e) => setShowAdditionalFields(e.target.checked)} />
            </label>
            <label className="my-4 text-black">
              Use Documents
              <input className="mx-4" type="checkbox" checked={useDocs} onChange={() => setUseDocs(!useDocs)} />
            </label>
          </div>
          {(fileContents.strategy !== '' || fileContents.financialDocuments !== '' || fileContents.pastWorks !== '') && <div className="w-full mt-5">
            <GPTAPISearch
              onResult={handleResult}
              strategyContent={fileContents.strategy}
              financialDocumentsContent={fileContents.financialDocuments}
              pastWorks={fileContents.pastWorks}
            />
          </div>}
        </div>
        <div className="col-span-full grid md:grid-cols-2 grid-cols-1 gap-1">
          <div id="targetSearch" className="col-span-full my-6 font-bold text-2xl">Search Parameters</div>
          <div className="col-span-full border-0 border-primary-300 rounded-md p-2">
            <label className="block text-black font-bold">CPV Code List <ToolTip tooltipText="These are the main CPV codes that are relevant to your company and the most important part of the search" /></label>
            <div className="flex items-center">
              <textarea className={`w-full shadow-md border-2 border-primary-100 rounded-lg p-2 text-black ${readOnlyFields.cpvCodes ? 'bg-gray-300' : 'bg-white'}`} name="cpvCodes" onChange={handleInputChange} value={(subProfile && subProfile.cpvCodes) || []} readOnly={readOnlyFields.cpvCodes}></ textarea>
              <input type="checkbox" className="mx-4" checked={readOnlyFields.cpvCodes} onChange={() => handleCheckboxChange('cpvCodes')} />
            </div>
          </div>
          <div className="border-0 border-primary-300 rounded-md p-2">
            <label className="block text-black font-bold">Lowest Cost <ToolTip tooltipText="Enter the lowest cost for the tender." /></label>
            <div className="flex items-center">
              <textarea
                className={`w-full shadow-md border-2 border-primary-100 rounded-lg p-2 text-black ${readOnlyFields.lowestcost ? 'bg-gray-300' : 'bg-white'}`}
                name="lowestcost"
                onChange={handleInputChange}
                readOnly={readOnlyFields.lowestcost}
                value={(subProfile && subProfile.lowestcost) || ''}
              />
              <input type="checkbox" className="mx-4" checked={readOnlyFields.lowestcost} onChange={() => handleCheckboxChange('lowestcost')} />
            </div>
          </div>
          <div className="border-0 border-primary-300 rounded-md p-2">
            <label className="block text-black font-bold">Highest Cost <ToolTip tooltipText="Enter the highest cost for the tender." /></label>
            <div className="flex items-center">
              <textarea
                className={`w-full shadow-md border-2 border-primary-100 rounded-lg p-2 text-black ${readOnlyFields.highestcost ? 'bg-gray-300' : 'bg-white'}`}
                name="highestcost"
                onChange={handleInputChange}
                readOnly={readOnlyFields.highestcost}
                value={(subProfile && subProfile.highestcost) || ''}
              />
              <input type="checkbox" className="mx-4" checked={readOnlyFields.highestcost} onChange={() => handleCheckboxChange('highestcost')} />
            </div>
          </div>
          <div className="border-0 border-primary-300 rounded-md p-2">
            <label className="block text-black font-bold">Exclude words / Disliked words<ToolTip tooltipText="These words wont appear in your search results." /></label>
            <div className="flex items-center">
              <  textarea className={`w-full shadow-md border-2 border-primary-100 rounded-lg p-2 text-black ${readOnlyFields.exclude ? 'bg-gray-300' : 'bg-white'}`} name="exclude" onChange={handleInputChange} value={(subProfile && subProfile.exclude) || []} readOnly={readOnlyFields.exclude}></ textarea>
              <input type="checkbox" className="mx-4" checked={readOnlyFields.exclude} onChange={() => handleCheckboxChange('exclude')} />
            </div>
          </div>
          <div className="border-0 border-primary-300 rounded-md p-2">
            <label className="block text-black font-bold">Keywords <ToolTip tooltipText="Enter the keywords relevant to your business." /></label>
            <div className="flex items-center">
              <textarea className={`w-full shadow-md border-2 border-primary-100 rounded-lg p-2 text-black ${readOnlyFields.keywords ? 'bg-gray-300' : 'bg-white'}`} name="keywords" onChange={handleInputChange} value={(subProfile && subProfile.keywords) || []} readOnly={readOnlyFields.keywords}></ textarea>
              <input type="checkbox" className="mx-4" checked={readOnlyFields.keywords} onChange={() => handleCheckboxChange('keywords')} />
            </div>
          </div>
          <div className="border-0 border-primary-300 rounded-md p-2">
            <label className="block text-black font-bold">Countries <ToolTip tooltipText="By selecting languages your search returns results only in those languages." /></label>
            <div className="flex items-center mt-3">
              <div>
                <DropdownCheckbox
                  countriesList={countriesList}
                  options={Object.keys(countriesList)}
                  value={(subProfile && subProfile.languages) || []}
                  onChange={(newValue) => setSubProfile({ ...subProfile, languages: newValue })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-black text-lg font-bold">Ready for search?</label>
        <div className="flex items-center">
          <button
            className={checkAll ? "bg-stop md:hover:bg-stop text-white font-bold py-2 px-4 rounded my-4" : "bg-primary-500 md:hover:bg-primary-700 text-white font-bold py-2 px-4 rounded my-4"}
            onClick={async () => {
              if (areAllFieldsEmpty()) {
                alert('Please fill in at least CPV codes to enable search.');
              } else {
                handleCheckAllChange();
                await saveSubProfile();
              }
            }}
          >
            {checkAll ? "Not Ready" : "Ready"}
          </button>
        </div>


      </div>
      <div className="mb-4">
        {Object.values(readOnlyFields).every(value => value === true) &&
          <div>
            <button
              className="bg-go md:hover:bg-primary-700 text-white font-bold py-2 px-4 rounded my-4"
              onClick={() => {
                if (areAllFieldsEmpty()) {
                  alert('Please fill in at least CPV codes to enable search.')
                } else {
                  updateSubProfile(subProfile);
                  setView('search');
                }
              }}
            >
              Search
            </button>
            <div className="flex items-center">
              Include award notices to search (this increases the search time)
              <input type="checkbox" className="mx-4" checked={useAwardNotices} onChange={() => {
                localStorage.setItem('useAward', JSON.stringify({ useAward: !useAwardNotices }));
                setUseAwardNotices(!useAwardNotices);
              }} />
            </div>
          </div>
        }
      </div>
      <Sidebar open={sidebarOpen} setUseCase={setUseCase} setOpen={setSidebarOpen} subProfiles={subProfiles} setSubProfile={setSubProfile} profileID={profileID} />
      {subProfile && subProfile._id && <OldSearches subProfile={subProfile} setView={setView} setSearchID={setSearchID} updateSubProfile={updateSubProfile} />}
    </div>

  );
};

export default UserProfileView;
