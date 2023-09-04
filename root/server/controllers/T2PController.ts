import { Request, Response } from 'express';
import '../models/awardNotice'; //Needed for initializing the schema DO NOT REMOVE!! the populate method will break
import ProcurementCall, { IProcurementCall } from '../models/procurementCall';
import { AwardNoticeQuery } from '../config/awardNoticeQuery';
import { compareDescription, compareCPV, compareTitle } from '../utils/suitability';

export const getAwardNotices = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        console.log("Starting award notice retrieval...");

        const company = req.body.subProfile;

        const numbers: string[] = company.cpvCodes
            .filter((code: string) => code.trim() !== "")
            .map((code: string) => {
                const match: RegExpMatchArray | null = code.match(/\d+/);
                return match ? match[0] : null;
            })
            .filter(Boolean);

        const partialCpvNumber: string[] = numbers.map((number: string) => number.replace(/\D|0+$/g, ''));

        console.log("Partial CPV numbers", partialCpvNumber);

        const mongoQuery = await AwardNoticeQuery(partialCpvNumber, company);
        console.log("Fetching data based on parameters");

        let tenders: IProcurementCall[] = await ProcurementCall.find(mongoQuery)
            .populate({
                path: 'awardNoticeRef',
                select: 'contractDetails'
            });

        tenders = tenders.filter(tender =>
            (tender.awardNoticeRef as any).contractDetails &&
            (tender.awardNoticeRef as any).contractDetails.length > 0
        );

        let results: any[] = tenders.map((tender: IProcurementCall) => {
            const descriptionResult = compareDescription(company.description.split(" "), tender.relevantText.join(" "), []);
            const cpvResult = compareCPV(company, tender.cpvCodes[0]);
            const titleResult = compareTitle(company.description.split(" "), tender.title, []);

            return {
                docid: tender.docid,
                title: tender.title,
                cpvCode: tender.cpvCodes,
                deadline: tender.dateForSubmission,
                value: tender.valuesList,
                location: tender.isoCountry,
                language: tender.lgOrig,
                description: tender.relevantText.join("\n"),
                countryCode: tender.isoCountry,
                documentType: tender.documentType,
                uriDocText: tender.uriDocText,
                iaUrlEtendering: tender.iaUrlEtendering,
                datePublished: tender.datePublished,
                suitabilityScore: 0.7 * descriptionResult.score + 0.2 * cpvResult.score + 0.1 * titleResult.score,
                awardNotice: tender.awardNoticeRef, // This will contain the populated AwardNotice data
            };
        });

        console.log("Sending data to front");
        res.status(200).json(results);
        console.log("Completed");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch award notices' });
    }
};
