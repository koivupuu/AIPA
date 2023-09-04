import { Request, Response } from 'express'; // Assuming you're using Express

// Import Elasticsearch client
import esClient from '../config/esClient';
import { TenderQuery } from '../config/elasticsearcTenderQuery';
import { IProcurementCall } from '../models/procurementCall'; // Adjust the path if needed
import SubProfile from '../models/subProfile';

// Import utility functions for comparing procurement calls
import {
    compareCPV,
    compareValue,
    compareDescription,
    compareLocation,
    compareTitle,
} from '../utils/suitability';

// Import functions from other controllers
import { translateKeywords } from './GPTTRNController';

// Function to check if two arrays are equivalent
function arraysAreEquivalent<T>(arr1: T[], arr2: T[]): boolean {
    // Check if the lengths are different, return false if they are
    if (arr1.length !== arr2.length) return false;

    // Sort both arrays
    const sortedArr1 = arr1.sort();
    const sortedArr2 = arr2.sort();

    // Compare each element of the sorted arrays
    for (let i = 0; i < arr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) return false;
    }

    // If all elements match, return true
    return true;
}

// Function to translate and append new keywords based on changes in languages or keywords
async function translateAndAppendNewKeywords(
    keywords: string[],
    lastKeywords: string[],
    languages: string[],
    lastLanguages: string[]
): Promise<string[]> {

    // Determine new keywords and languages by comparing with the previous values
    const newKeywords = keywords.filter(keyword => !lastKeywords.includes(keyword));
    const newLanguages = languages.filter(lang => !lastLanguages.includes(lang));

    let translatedKeywords: string[] = [];


    // If there are new keywords, translate them to all current languages
    if (newKeywords.length > 0) {
        translatedKeywords = translatedKeywords.concat(await translateKeywords(newKeywords, languages));
    }

    // If there are new languages, translate all keywords to those new languages
    if (newLanguages.length > 0 && keywords.length > 0) {
        translatedKeywords = translatedKeywords.concat(await translateKeywords(keywords, newLanguages));
    }

    // If there are no new translations, just return the original keywords
    if (translatedKeywords.length === 0) return keywords;

    // Return the original keywords appended with the translated new keywords
    return keywords.concat(translatedKeywords);
}

export const getTenders = async (
    req: Request,
    res: Response,
): Promise<void> => {

    try {
        console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nOk, Lets Start The MADNESS!!!\n")

        const company = req.body.subProfile;
        const includeAwardNotices = req.body.useAward.useAward;
        console.log("includeAwardNotices: ", includeAwardNotices);

        if (!arraysAreEquivalent(company.lastKeywords || [], company.keywords || [])
            || !arraysAreEquivalent(company.lastLanguages || [], company.languages || [])) {

            if (company.keywords && company.keywords.map((item: string) => item.trim()).length > 0) {
                company.keywords = await translateAndAppendNewKeywords(
                    company.keywords.map((item: string) => item.trim()),
                    company.lastKeywords,
                    company.languages,
                    company.lastLanguages
                );
            }

            if (company.exclude && company.exclude.map((item: string) => item.trim()).length > 0) {
                company.exclude = await translateAndAppendNewKeywords(
                    company.exclude.map((item: string) => item.trim()),
                    company.lastKeywords,
                    company.languages,
                    company.lastLanguages
                );
            }

            const tmpkeywords: string[] = company.keywords.map((item: string) => item.trim());
            company.lastKeywords = [...new Set(tmpkeywords)];
            const tmplanguages: string[] = company.languages || [];
            company.lastLanguages = tmplanguages;

            const subProfileId: string = company._id;

            await SubProfile.findByIdAndUpdate(subProfileId, company, { new: true });
        }

        const numbers: string[] = company.cpvCodes
            .filter((code: string) => code.trim() !== "")
            .map((code: string) => {
                const match: RegExpMatchArray | null = code.match(/\d+/);
                return match ? match[0] : null;
            })
            .filter(Boolean);

        const partialCpvNumber: string[] = numbers.map((number: string) => number.replace(/\D|0+$/g, ''));

        let date = new Date();

        let day = String(date.getDate()).padStart(2, '0'); // get the day as number and convert to string, pad start with 0 if needed
        let month = String(date.getMonth() + 1).padStart(2, '0'); // get the month as number (0-based), add 1, convert to string and pad start with 0 if needed
        let year = date.getFullYear(); // get the full year as number

        let hours = String(date.getHours()).padStart(2, '0'); // get the hours as number, convert to string and pad start with 0 if needed
        let minutes = String(date.getMinutes()).padStart(2, '0'); // get the minutes as number, convert to string and pad start with 0 if needed

        let currentDate = `${year}${month}${day} ${hours}:${minutes}`; // concatenate the parts

        const esQuery = TenderQuery(partialCpvNumber, company, includeAwardNotices, currentDate);

        console.log("\nSearch Parameters:", partialCpvNumber, company.languages, company.keywords);
        console.log("\nFetching data based on parameters");

        // Initial search request with a scroll timeout
        let response = await esClient.search({
            index: 'aipa.procurementcalls',
            scroll: '1m',  // Keep the search context alive for 1 minute
            body: {
                query: esQuery
            }
        });

        let tenders: IProcurementCall[] = [];
        tenders.push(...response.hits.hits.map(hit => hit._source as IProcurementCall));

        // While there are more documents to retrieve, keep scrolling
        while (response.hits.hits.length) {
            response = await esClient.scroll({
                scroll_id: response._scroll_id,
                scroll: '1m'
            });
            tenders.push(...response.hits.hits.map(hit => hit._source as IProcurementCall));
        }

        console.log("\nIs keywords in the right format: ", Array.isArray(company.keywords), company.keywords);
        console.log("\nIs exclude words in the right format: ", Array.isArray(company.exclude), company.exclude);
        console.log("\nIs disliked locations in the right format: ", Array.isArray(company.exclude), company.dislikedLocation);
        console.log("\nMin: ", company.lowestcost, "Max: ", company.highestcost);
        console.log("\nEvaluating tenders")
        let count = 0;
        let howmanytenders = tenders.length;
        let results: any[] = tenders.map((tender: IProcurementCall) => {
            count += 1;
            if (count % 10 === 0) console.log(count + "/" + howmanytenders);
            const cpvResult = compareCPV(company, tender.cpvCodes[0]);
            const valueResult = compareValue(company, tender.valuesList);
            const descriptionResult = compareDescription(company.keywords, tender.relevantText.join(" "), company.exclude);
            const locationResult = compareLocation(company, tender.isoCountry);
            const titleResult = compareTitle(company.keywords, tender.title, company.exclude);

            const suitabilityScore = Math.round(
                0.5 * cpvResult.score +
                0.15 * valueResult.score +
                0.15 * descriptionResult.score +
                0.15 * titleResult.score +
                0.05 * locationResult.score
            );
            let dmatchedStrategies;
            if (descriptionResult.matchedStrategies) dmatchedStrategies = descriptionResult.matchedStrategies.join(', ');

            let tmatchedStrategies;
            if (titleResult.matchedStrategies) tmatchedStrategies = titleResult.matchedStrategies.join(', ');

            // Return a promise instead of an object so you can use await Promise.all later
            return {
                docid: tender.docid,
                title: tender.title,
                cpvCode: tender.cpvCodes,
                suitabilityScore,
                deadline: tender.dateForSubmission,
                value: tender.valuesList,
                location: tender.isoCountry,
                language: tender.lgOrig,
                description: tender.relevantText.join("\n"),
                countryCode: tender.isoCountry,
                documentType: tender.documentType,
                uriDocText: tender.uriDocText,
                iaUrlEtendering: tender.iaUrlEtendering,
                cpvCodeExplanation: cpvResult.explanation,
                valueExplanation: valueResult.explanation,
                descriptionExplanation: descriptionResult.explanation + `${dmatchedStrategies && `Matched words: ${dmatchedStrategies}`}`,
                locationExplanation: locationResult.explanation,
                titleExplanation: titleResult.explanation + `${tmatchedStrategies && `Matched words: ${tmatchedStrategies}`}`,
                datePublished: tender.datePublished,
            };
        });

        //results = await Promise.all(results);
        console.log("\nReady with evaluation");
        console.log("\nCPV query returned: " + results.length + " results");
        console.log("\nSorting data");
        // Sort the results by suitability score in descending order and return top 10
        results = results.sort((a, b) => b.suitabilityScore - a.suitabilityScore)//.slice(0, 10);

        // Rest of your code here
        console.log("\nSending data to front");
        res.status(200).json(results); // Send the result as a response
        console.log("\nReady");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch tenders' });
    }
};