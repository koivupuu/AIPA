export const AwardNoticeQuery = (partialCpvNumber: string[], company: any): any => {
    let mongoQuery: any = {};

    // Translate should with prefix
    if (partialCpvNumber && partialCpvNumber.length > 0) {
        mongoQuery.cpvCodes = {
            $in: partialCpvNumber.map(code => new RegExp(`^${code}`))
        };
    }

    // Translate filter with terms for documentType
    mongoQuery.documentType = 'Contract award notice';
    mongoQuery.awardNoticeRef = { $exists: true };

    // Translate filter with terms for isoCountry
    if (company.languages && company.languages.length > 0) {
        mongoQuery.isoCountry = {
            $in: company.languages
        };
    }

    return mongoQuery;
};
