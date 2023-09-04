import { Request, Response } from 'express';
import Search from '../models/search';
import ProcurementCall from '../models/procurementCall';

// Create a Search for a Given Subprofile
export const createSearchForSubProfile = async (req: Request, res: Response) => {
    const subProfileID = req.params.subProfileID;
    const searchData = req.body;

    try {
        // Modify the loop to map docids to ObjectIds
        const procurementCalls = [];

        for (let dataItem of searchData) {
            const procurement = await ProcurementCall.findOne({ docid: dataItem.docid });

            if (!procurement) {
                throw new Error(`Procurement not found for docid: ${dataItem.docid}`);
            }

            procurementCalls.push({
                procurementCall: procurement._id,
                suitabilityScore: dataItem.suitabilityScore
            });
        }

        const newSearch = new Search({
            procurementCalls: procurementCalls,
            subProfile: subProfileID
        });

        await newSearch.save();

        res.status(201).json({ message: 'Search created successfully', newSearch });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create search' });
    }
};


// Delete a Search for a Given Subprofile
export const deleteSearchForSubProfile = async (req: Request, res: Response) => {
    const searchID = req.params.searchID;

    try {
        await Search.findByIdAndDelete(searchID);
        res.status(200).json({ message: 'Search deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete search' });
    }
};

// Fetch All Searches for a Given Subprofile
export const fetchSearchesForSubProfile = async (req: Request, res: Response) => {
    const subProfileID = req.params.subProfileID;

    try {
        const searches = await Search.find({ subProfile: subProfileID }).select('-procurementCalls');
        res.status(200).json(searches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch searches' });
    }
};


export const fetchProcurementCallsForSearch = async (req: Request, res: Response) => {
    const searchID = req.params.searchID;

    try {

        const search = await Search.findById(searchID).populate('procurementCalls.procurementCall');

        if (!search) {
            return res.status(404).json({ error: 'Search not found' });
        }


        const transformedProcurementCalls = search.procurementCalls.map(item => ({
            docid: ((item.procurementCall as any) as any).docid,
            title: (item.procurementCall as any).title,
            cpvCode: (item.procurementCall as any).cpvCodes,
            suitabilityScore: item.suitabilityScore,
            deadline: (item.procurementCall as any).dateForSubmission,
            value: (item.procurementCall as any).valuesList,
            location: (item.procurementCall as any).isoCountry,
            language: (item.procurementCall as any).lgOrig,
            description: (item.procurementCall as any).relevantText.join(" "),
            countryCode: (item.procurementCall as any).isoCountry,
            documentType: (item.procurementCall as any).documentType,
            uriDocText: (item.procurementCall as any).uriDocText,
            iaUrlEtendering: (item.procurementCall as any).iaUrlEtendering,
            datePublished: (item.procurementCall as any).datePublished,
        }));

        res.status(200).json(transformedProcurementCalls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch procurement calls for search' });
    }
};
