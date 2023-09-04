interface Company {
  cpvCodes: string[] | null;
  lowestcost: string | null;
  highestcost: string | null;
  dislikedLocations: string[] | null;
}

interface ComparisonResult {
  score: number;
  explanation: string;
  tenderDescription?: string;
  matchedStrategies?: string[];
  tenderTitle?: string;
}

const compareCPV = (company: Company, tenderCPVCode: string): ComparisonResult => {
  let explanation = '';

  if (!company || !tenderCPVCode || !Array.isArray(company.cpvCodes)) {
    explanation = 'Invalid company, tender CPV code, or company CPV codes not an array.';
    return { score: 0, explanation };
  }

  // Define function to find longest common prefix
  const longestCommonPrefix = (str1: string, str2: string): string => {
    let i = 0;
    while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
      i++;
    }
    return str1.substring(0, i);
  }

  // Find the company's CPV code that has the longest common prefix with the tender's CPV code.
  const companyCPVCode = company.cpvCodes.reduce<{ code: string | null, length: number }>((bestMatch, code) => {
    const lcp = longestCommonPrefix(code.replace(/\D|0+$/g, ''), tenderCPVCode.replace(/0+$/, ''));
    return lcp.length > bestMatch.length ? { code, length: lcp.length } : bestMatch;
  }, { code: null, length: 0 });

  // If there is a company CPV code that matches the prefix of the tender CPV code, calculate the score
  let score = 0;
  if (companyCPVCode.code) {
    score = 100 - (tenderCPVCode.replace(/0+$/, '').length - companyCPVCode.length) / tenderCPVCode.replace(/0+$/, '').length * 100;
    explanation = `The most similar company CPV code (${companyCPVCode.code}) to the tender CPV code has a common prefix of length ${companyCPVCode.length}, yielding a score of ${score}.`;
  } else {
    explanation = 'No matching company CPV code was found for the tender CPV code.';
  }

  return { score, explanation };
};


const compareValue = (company: Company, tenderEstimatedValue: string): ComparisonResult => {
  let explanation = '';

  if (!company || !tenderEstimatedValue || !company.lowestcost || !company.highestcost) {
    explanation = 'Invalid company, tender estimated value, or company cost ranges.';
    return { score: 0, explanation };
  }

  const companyLowestCost = parseFloat(company.lowestcost.split('.')[0].replace(/\D/g, ''));
  const companyHighestCost = parseFloat(company.highestcost.split('.')[0].replace(/\D/g, ''));
  const tenderValue = parseFloat(tenderEstimatedValue.split('.')[0].replace(/\D/g, ''));
  
  if (isNaN(companyLowestCost) || isNaN(companyHighestCost) || isNaN(tenderValue)) {
    explanation = 'Invalid company target values or tender value.'
    return { score: 0, explanation };
  }

  // Calculate a linear scaling factor for values below the company's lowest cost
  const scalingFactorBelow = 0.5; // Change this to modify how quickly the score reduces below the lowest cost
  const scalingFactorAbove = 0.5; // Change this to modify how quickly the score reduces above the highest cost

  let score = 0;
  if (tenderValue >= companyLowestCost && tenderValue <= companyHighestCost) {
    score = 100;
    explanation = `The tender value is within the company's cost range, resulting in a maximum score of 100.`;
  } else if (tenderValue < companyLowestCost) {
    score = 100 - scalingFactorBelow * (companyLowestCost - tenderValue) / companyLowestCost * 100;
    explanation = `The tender value is below the company's cost range, resulting in a scaled score of ${score}.`;
  } else {
    score = 100 - scalingFactorAbove * (tenderValue - companyHighestCost) / companyHighestCost * 100;
    explanation = `The tender value is above the company's cost range, resulting in a scaled score of ${score}.`;
  }

  score = Math.max(0, Math.min(100, score)); // Clamp score to [0, 100]

  return { score, explanation };
};

const compareDescription = (keywords: string[], tenderDescription: string, dislikedWords: string[]): ComparisonResult => {
  if (!keywords || !tenderDescription) {
    return { score: 0, explanation: 'Invalid company or tender description.', tenderDescription };
  }

  // Preprocess the keywords and disliked words
  const keywordSet = new Set(keywords.map(word => word.toLowerCase()));
  const dislikedSet = new Set(dislikedWords ? dislikedWords.map(word => word.toLowerCase()) : []);

  // Remove common punctuation and lower the case
  let processedTenderDescription = tenderDescription.replace(/[.,-]/g, ' ').toLowerCase();

  // Tokenize the description
  let tokens = processedTenderDescription.split(/\s+/).filter(word => word.length > 0);

  // Match strategies and disliked words
  let matchedStrategies = tokens.filter(word => keywordSet.has(word));
  let dislikedWordsCount = tokens.filter(word => dislikedSet.has(word)).length;

  // Calculate penalty for disliked words
  let dislikedPenalty = 0;
  if (dislikedWordsCount >= 5) {
    dislikedPenalty = 100; // Set maximum penalty
  } else if (dislikedWordsCount > 0) {
    dislikedPenalty = (dislikedWordsCount / dislikedSet.size) * 100;
  }

  // Calculate the score based on matched keywords
  let score = 0;
  if (matchedStrategies.length > 0) {
    let decayRate = 0.5;
    let failedMatchRatio = 1 - (matchedStrategies.length / keywordSet.size);
    score = 100 * Math.exp(-decayRate * failedMatchRatio);
  }

  // Apply the disliked penalty
  score = Math.max(0, Math.min(100, score - dislikedPenalty));

  // Construct the explanation
  let explanation;
  if (dislikedPenalty === 100) {
    explanation = 'The tender description contains five or more disliked words, resulting in a score of 0.';
  } else if (dislikedWordsCount > 0) {
    explanation = `The tender description contains ${dislikedWordsCount} disliked words, resulting in a score of ${score}.`;
  } else if (matchedStrategies.length > 0){
    explanation = `The tender description includes some of the company's keywords, resulting in a score of ${score}.`;
  } else { 
    explanation = `Nothing relevant found in the description, score ${score}`;
  }

  return { score, explanation, tenderDescription, matchedStrategies: [...new Set(matchedStrategies)] };
};

const compareTitle = (keywords: string[], tenderTitle: string, dislikedWords: string[]): ComparisonResult => {
  if (!keywords || !tenderTitle) {
    return { score: 0, explanation: 'Invalid company or tender description.', tenderTitle };
  }

  // Preprocess the keywords and disliked words
  keywords = keywords.map(word => word.toLowerCase());
  dislikedWords = dislikedWords ? dislikedWords.map(word => word.toLowerCase()) : [];

  // Remove common punctuation and lower the case
  let processedTenderTitle = tenderTitle.replace(/[.,-]/g, ' ').toLowerCase();

  // Tokenize the description
  let tokens = processedTenderTitle.split(/\s+/).filter(word => word.length > 0);

  // Matching strategies and disliked words
  let matchedStrategies: string[] = [];
  let dislikedWordsCount = 0;

  tokens.forEach(token => {
    if (keywords.includes(token) && !matchedStrategies.includes(token)) matchedStrategies.push(token);
    if (dislikedWords.includes(token)) dislikedWordsCount++;
  });

  // If there are 5 or more disliked words, the score is 0
  if (dislikedWordsCount >= 5) {
    return { score: 0, explanation: 'The tender title contains five or more disliked words.', tenderTitle, matchedStrategies };
  }

  // Calculate the score based on matched keywords and disliked words
  let score = matchedStrategies.length * 10 - dislikedWordsCount * 5;
  if (matchedStrategies.length > 0) score += 70; // Bonus points for matching a keyword
  score = Math.max(0, score); // Ensure the score doesn't go below 0

  // Construct the explanation
  let explanation = `The tender title includes ${matchedStrategies.length} of the company's keywords and ${dislikedWordsCount} disliked words, resulting in a score of ${score}.`;

  return { score, explanation, tenderTitle, matchedStrategies };
};

const compareLocation = (company: Company, tenderAddress: string): ComparisonResult => {
  let explanation = '';

  if (!company || !tenderAddress || !Array.isArray(company.dislikedLocations)) {
    explanation = 'Invalid company, tender address, or company disliked locations not given.'
    return { score: 100, explanation };
  }

  // Create a lowercase version of the tender address for case insensitive comparison
  let lowerCaseTenderAddress = tenderAddress.toLowerCase();

  // Find out if any of the disliked locations appear in the tender address
  let dislikedLocationFound = company.dislikedLocations.some(location => lowerCaseTenderAddress.includes(location.toLowerCase()));

  let score = 100;
  if (dislikedLocationFound) {
    score = 0; // Or decrease it as much as you want
    explanation = `The tender location contains a location that the company dislikes, resulting in a score of ${score}.`;
  } else {
    explanation = `No disliked locations in the tender location, resulting in a score of ${score}.`;
  }

  return { score, explanation };
};

export {
  compareCPV,
  compareValue,
  compareDescription,
  compareLocation,
  compareTitle
};