/**
 * 
 * SuitabilityColors
 * 
 * This component handles the result colors in the searchResultView. 
 * Relevant information is passed in and based on them appropriate color is selected 
 * and returned to the asking component. 
 * 
 */

type ColorMap = {
  [key: number]: string;
};

export const getSuitabilityColor = (
suitabilityScore: number, 
isTailwindClasses: boolean = false, 
isBackground: boolean = false
): string => {

const COLORS: ColorMap = {
    95: isTailwindClasses ? (isBackground ? 'bg-green-500' : 'text-green-500') : '#10B981',
    87: isTailwindClasses ? (isBackground ? 'bg-green-400' : 'text-green-400') : '#22C55E',
    85: isTailwindClasses ? (isBackground ? 'bg-yellow-400' : 'text-yellow-400') : '#FBBF24',
    80: isTailwindClasses ? (isBackground ? 'bg-yellow-500' : 'text-yellow-500') : '#F59E0B',
    70: isTailwindClasses ? (isBackground ? 'bg-orange-400' : 'text-orange-400') : '#FB923C',
    60: isTailwindClasses ? (isBackground ? 'bg-orange-500' : 'text-orange-500') : '#F97316',
    0: isTailwindClasses ? (isBackground ? 'bg-red-900' : 'text-red-900') : '#991B1B',
};

const scoreBuckets: number[] = Object.keys(COLORS).map(Number).sort((a, b) => b - a);
for (let i = 0; i < scoreBuckets.length; i++) {
  if (suitabilityScore >= scoreBuckets[i]) {
    return COLORS[scoreBuckets[i]];
  }
}

return isTailwindClasses ? (isBackground ? 'bg-red-900' : 'text-red-900') : '#991B1B';  // Default color if none of the conditions are met
};
