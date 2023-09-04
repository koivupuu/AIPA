// elasticsearchQuery.ts

export interface PrefixQuery {
    prefix: {
        [key: string]: any;
    };
}

export interface TermsQuery {
    terms: {
        [key: string]: any;
    };
}

export interface RangeQuery {
    range: {
        [key: string]: any;
    };
}

export interface MatchQuery {
    match: {
        [key: string]: any;
    };
}

export interface BoolQuery {
    bool: {
        should?: any[];
        minimum_should_match?: number;
        must_not?: any[];
        filter?: (TermsQuery | RangeQuery | BoolQuery)[];
    };
}

export interface ElasticsearchQuery {
    bool: {
        should: any[];
        minimum_should_match: number;
        must_not: any[];
        filter: (TermsQuery | RangeQuery | BoolQuery)[];
    };
}

export const TenderQuery = (partialCpvNumber: string[], company: any, includeAwardNotices: boolean, currentDate: string): ElasticsearchQuery => {
    const esQuery: ElasticsearchQuery = {
        bool: {
            should: partialCpvNumber.map(code => ({
                prefix: {
                    'cpvCodes.keyword': code
                }
            })),
            minimum_should_match: 1,
            must_not: [],
            filter: [
                {
                    bool: {
                        should: [
                            {
                                term: {
                                    'dateForSubmission.keyword': 'Not specified'
                                }
                            },
                            {
                                range: {
                                    dateForSubmission: {
                                        gte: currentDate
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };

    if (!includeAwardNotices) {
        esQuery.bool.must_not.push({
            match_phrase: {
                documentType: 'Contract award notice'
            }
        });
    }

    if (company.keywords && company.keywords.length > 0 && !(company.keywords[0].trim() == '')) {
        const keywordQueries = company.keywords.map((keyword: string) => ({
            match: {
                title: {
                    query: keyword,
                    fuzziness: 'AUTO'
                }
            }
        }));

        esQuery.bool.filter.push({
            bool: {
                should: keywordQueries,
                minimum_should_match: 1
            }
        });
    }

    // Conditionally add the isoCountry filter
    if (company.languages && company.languages.length > 0) {
        esQuery.bool.filter.push({
            terms: {
                'isoCountry.keyword': company.languages
            }
        });
    }

    return esQuery;
};