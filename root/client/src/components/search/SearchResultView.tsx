/**
 * 
 * SearchResultsView
 * 
 * This is the most important component along with the profile view. 
 * Here based on the user's active subprofile a search is conducted. 
 * The search parameters are passed to the search engine and results are displayed as a list of options and an infograph. 
 * 
 */
import React, { useState, useEffect } from "react";
import axios from 'axios';
import LoadingView from '../utils/LoadingView';
import ToolTip from "../utils/Tooltip";
import Chart from "./Chart";
import { getSuitabilityColor } from './SuitabilityColors';
import { languagesList } from "../utils/Languages";
import { countriesList } from "../utils/Countries";
import { useAuth0 } from '@auth0/auth0-react';

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

type CountryCode = string;
type CountryName = string;

interface Countries {
  [key: string]: CountryCode;
}


interface TenderType {
  [key: string]: any;
  docid: string;
  title: string;
  cpvCode: string[];
  suitabilityScore: number;
  deadline: string;
  value: string;
  location: string;
  language: string;
  description: string;
  countryCode: string;
  documentType: string;
  uriDocText: string;
  iaUrlEtendering: string;
  cpvCodeExplanation: string;
  valueExplanation: string;
  descriptionExplanation: string;
  locationExplanation: string;
  titleExplanation: string;
  datePublished: string;
  awardNotice?: {
    contractDetails: ContractorDetails[];
  };
}

interface ContractorDetails {
  officialName: string;
  country: string;
  dateConclusion: string;
  totalValue: string;
}

interface GraphDataType {
  docid: string;
  title: string;
  cpvCode: string[];
  suitabilityScore: number;
  deadline: string;
  value: number;
  location: string;
  language: string;
  description: string;
  countryCode: string;
  documentType: string;
  uriDocText: string;
  iaUrlEtendering: string;
  cpvCodeExplanation: string;
  valueExplanation: string;
  descriptionExplanation: string;
  locationExplanation: string;
  titleExplanation: string;
  datePublished: string;
}


interface SearchResultViewProps {
  useCase: number;
  setView: React.Dispatch<React.SetStateAction<string>>;
  subProfile: ProfileType;
  setSubProfile: React.Dispatch<React.SetStateAction<ProfileType>>;
  searchID: string;
}

const SearchResultView: React.FC<SearchResultViewProps> = ({
  useCase,
  setView,
  subProfile,
  setSubProfile,
  searchID
}) => {
  const empyTender = {
    docid: "",
    title: "",
    cpvCode: [""],
    suitabilityScore: 0,
    deadline: "",
    value: "",
    location: "",
    language: "",
    description: "",
    countryCode: "",
    documentType: "",
    uriDocText: "",
    iaUrlEtendering: "",
    cpvCodeExplanation: "",
    valueExplanation: "",
    descriptionExplanation: "",
    locationExplanation: "",
    titleExplanation: "",
    datePublished: "",
  }

  const [selectedTender, setSelectedTender] = useState<TenderType>(empyTender);
  const [tenders, setTenders] = useState<TenderType[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0); // New state variable
  const [isLoading, setIsLoading] = useState<boolean>(true); // New state variable for loading status
  const [lastClickedTenderId, setLastClickedTenderId] = useState<string>('');
  const { getAccessTokenSilently } = useAuth0();

  // Function to close the selected tender view
  const closeTenderView = () => {
    setSelectedTender(empyTender);
    if (lastClickedTenderId && lastClickedTenderId !== '') {
      const element = document.getElementById(lastClickedTenderId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const HandleReturn = () => {
    setSubProfile(subProfile);
    setView('profile');
  }

  useEffect(() => {
    const today = () => {
      let date = new Date();
      let day = String(date.getDate()).padStart(2, '0'); // get the day as number and convert to string, pad start with 0 if needed
      let month = String(date.getMonth() + 1).padStart(2, '0'); // get the month as number (0-based), add 1, convert to string and pad start with 0 if needed
      let year = date.getFullYear(); // get the full year as number

      let currentDate = `${year}${month}${day}`; // concatenate the parts 
      setTodaysDate(currentDate);
    }
    today();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [todaysDate, setTodaysDate] = useState('00000000');

  const getOldSearches = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/search/procurement/${searchID}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await setTenders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchTenders = async () => {
    try {
      setIsLoading(true); // Set loading to true at the start of fetching
      const useAwardString = localStorage.getItem('useAward');
      const useAward = useAwardString ? JSON.parse(useAwardString) : null;
      const token = await getAccessTokenSilently();
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tenders/getTenders`, { subProfile, useAward }, {
        timeout: 600000, // 10 minutes in milliseconds
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await setTenders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false); // Set loading to false after the fetching is done, regardless of success or error
    }
  };

  const fetchAwards = async () => {
    try {
      setIsLoading(true); // Set loading to true at the start of fetching
      const token = await getAccessTokenSilently();
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tenders/getAwardNotices`, { subProfile }, {
        timeout: 600000, // 10 minutes in milliseconds
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await setTenders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false); // Set loading to false after the fetching is done, regardless of success or error
    }
  };

  useEffect(() => {
    if (searchID && searchID !== '') {
      getOldSearches();
    } else if (useCase === 1) {
      fetchTenders();
    } else {
      fetchAwards();
    }
  }, []);

  useEffect(() => {
    const saveSearch = async (data: TenderType[]) => {
      const saveData = data.map(item => {
        if (item.docid && item.suitabilityScore) {
          return (
            {
              docid: item.docid,
              suitabilityScore: item.suitabilityScore
            }
          )
        }
      });

      if (saveData.length > 0) {
        try {
          console.log("This will be saved", saveData);
          const token = await getAccessTokenSilently();
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/search/create/${subProfile._id}`, saveData, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log("saved", response);
        } catch (error) {
          console.error((error as Error).message);
        }
      }
    }
    if ((!searchID || searchID.length <= 0) && useCase === 1) saveSearch(tenders);
  }, [tenders]);

  // Sort tenders by suitability score in descending order
  const sortedTenders: TenderType[] = [...tenders].sort((a: TenderType, b: TenderType) => b.suitabilityScore - a.suitabilityScore);

  const graphData: GraphDataType[] = sortedTenders
    .slice(currentIndex, currentIndex + 5) // Only take the current five tenders
    .sort((a: TenderType, b: TenderType) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return dateA.getTime() - dateB.getTime();
    })
    .map(tender => {
      // For example, if tender.value is "USD 100.50", the value of value would be 100.50.
      const replacedValue = tender.value.replace(/^\w{3}\s/, '');
      const value = parseFloat(replacedValue);
      const finalValue = isNaN(value) ? 0 : value;
      // Apply logarithm base 10 transformation to value
      const logValue = Math.log10(finalValue || 1);  // Use 1 as fallback to avoid negative infinity
      // Return a new object with the updated value

      return { ...tender, value: logValue };
    });

  return (
    <div>
      {isLoading
        ?
        <div >
          <div className="h-screen-78" />
          <LoadingView />
        </div>
        :
        (
          <div>
            <div className="text-center">
              {tenders.length !== 0 ?
                <h1 className="text-primary-500 text-3xl font-bold py-3">Search Complete!</h1>
                : <h1 className="text-3xl font-bold py-3">Search returned 0 results</h1>}
            </div>
            <div className="flex items-center">
              <div>
                {
                  tenders.length !== 0
                    ?
                    (<button
                      className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded m-8"
                      onClick={HandleReturn}>
                      Back to profile
                    </button>)
                    :
                    (<div></div>)
                }
                {currentIndex !== 0 &&
                  <button
                    className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded m-8"
                    disabled={currentIndex === 0} // Disable the button if there are no previous items
                    onClick={() => {
                      setCurrentIndex(currentIndex - 5);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}>
                    Previous
                  </button>
                }
                {currentIndex + 5 < sortedTenders.length &&
                  <button
                    className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded m-8"
                    disabled={currentIndex + 5 >= sortedTenders.length} // Disable the button if there are no next items
                    onClick={() => {
                      setCurrentIndex(currentIndex + 5);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}>
                    Next
                  </button>
                }
              </div>
            </div>
            <div>
              {
                tenders.length !== 0
                  ?
                  (<div></div>)
                  :
                  (
                    <div className="rounded-md flex items-center min-h-45vh xl:mx-96 lg:mx-52">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="p-8">Tips for getting results:</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className=" p-2">
                              <ul className="list-disc pl-5">
                                <li>Try giving more CPV codes</li>
                              </ul>
                            </td>
                          </tr>
                          <tr>
                            <td className=" p-2">
                              <ul className="list-disc pl-5">
                                <li>Try giving less accurate CPV codes (example 72210000 --{">"} 72000000)</li>
                              </ul>
                            </td>
                          </tr>
                          <tr>
                            <td className=" p-2">
                              <ul className="list-disc pl-5">
                                <li>Try adding keywords or don't put any keywords (only tenders with matched keywords are displayed if there are any keywords, otherwise empty keyword field doesn't restrict the search at all)</li>
                              </ul>
                            </td>
                          </tr>
                          <tr>
                            <td className=" p-2">
                              <ul className="list-disc pl-5">
                                <li>If you have selected countries, try adding more (there might not be fitting tenders in your selected countries)</li>
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                  )
              }
            </div>
            <div className={` ${(selectedTender && selectedTender.docid !== "") ? 'grid md:grid-cols-2 grid-cols-1' : 'grid-cols-1'} grid-rows-[1fr] md:gap-4 transition-all duration-500 ease-in-out lg:mx-28`}>
              <div className="col-start-1 row-span-8 overflow-y-auto space-y-4">
                {/* ================= Newest here  =================*/}
                {sortedTenders.length > 0 ? <div className="font-semibold text-2xl text-primary-500">Todays Matches</div> : <div></div>}
                {
                  sortedTenders.filter(tender => tender.datePublished === todaysDate).length <= 0
                  && <div className="ml-8">No matches for today's date</div>
                }
                {/*.sort((a,b) => a.datePublished - b.datePublished)*/}
                {
                  sortedTenders.filter(tender => tender.datePublished === todaysDate).sort((a: TenderType, b: TenderType) => {
                    const dateA = new Date(a.datePublished);
                    const dateB = new Date(b.datePublished);
                    return dateA.getTime() - dateB.getTime();
                  })
                    .slice(0, 4).map((tender: TenderType) => {
                      const colorClass = getSuitabilityColor(tender.suitabilityScore, true);
                      const tenderId = `tender-${tender.docid}`;
                      return (
                        <div
                          className="border border-gray-300 rounded shadow-md p-2 mb-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => {
                            setSelectedTender(tender);
                            setLastClickedTenderId(tenderId);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <p className="font-bold pb-1">{tender.title}</p>
                          {(useCase !== 2) && <p className="pb-1">{tender.documentType}</p>}
                          {(useCase !== 2) && <p className="pb-1">{tender.documentType}</p>}
                          {(useCase === 2) && (
                            <div>
                              {tender.awardNotice && tender.awardNotice.contractDetails.map((item: ContractorDetails) =>
                                <div className="mb-2 p-2 border-2 rounded-md border-primary-500">
                                  <p>officialName: {item.officialName}</p>
                                  <p>country: {item.country}</p>
                                  <p>dateConclusion: {item.dateConclusion}</p>
                                  <p>totalValue: {item.totalValue}</p>
                                </div>
                              )}
                            </div>)}
                          <p className={`text-2xl font-bold ${colorClass}`}>{tender.suitabilityScore}% Match</p>
                        </div>
                      )
                    })
                }
                {/* ================= All matches =================*/}
                {sortedTenders.length > 0 ? <div className="text-2xl font-semibold mt-8 pt-4 text-primary-500">Best Matches</div> : <div></div>}
                {sortedTenders.slice(currentIndex, currentIndex + 5).map((tender) => {

                  const colorClass = getSuitabilityColor(tender.suitabilityScore, true);
                  const tenderId = `tender-${tender.docid}`;

                  return (
                    <div
                      id={tenderId}
                      className="border border-gray-300 rounded shadow-md p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setSelectedTender(tender);
                        setLastClickedTenderId(tenderId);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <p className="font-bold pb-1">{tender.title}</p>
                      {(useCase !== 2) && <p className="pb-1">{tender.documentType}</p>}
                      {(useCase === 2) && <div className="text-black font-semibold mt-4 mb-2">Contractors</div>}
                      {(useCase === 2) && (
                        <div>
                          {tender.awardNotice && tender.awardNotice.contractDetails.map((item: ContractorDetails) =>
                            <div className="mb-2 p-2 border-2 rounded-md border-primary-500">
                              <p>officialName: {item.officialName}</p>
                              <p>country: {item.country}</p>
                              <p>dateConclusion: {item.dateConclusion}</p>
                              <p>totalValue: {item.totalValue}</p>
                            </div>
                          )}
                        </div>)}
                      <p className={`text-2xl font-bold ${colorClass}`}>{tender.suitabilityScore}% Match</p>
                    </div>)
                })}
                <div>
                  <Chart graphData={graphData} isSelected={selectedTender && selectedTender.docid !== "" && true} />
                </div>
              </div>
              <div className={`shadow-md  col-start-2 ${(selectedTender && selectedTender.docid !== "") ? 'row-start-1 row-span-10 md:row-span-full' : 'scale-0 opacity-0'} p-5 border border-gray-300 rounded transition-all duration-500 ease-in-out overflow-hidden`}>
                <div className={`transform transition-transform duration-500 ease-in-out ${(selectedTender && selectedTender.docid !== "") ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                  {(selectedTender && selectedTender.docid !== "") && (
                    <>
                      <div className="relative">
                        <div className=" relative w-2/3 h-4 bg-gray-200 rounded">
                          <div className={`absolute top-0 left-0 h-full ${getSuitabilityColor(selectedTender.suitabilityScore, true, true)}`}
                            style={{ width: `${selectedTender.suitabilityScore}%` }}>
                          </div>
                        </div>
                        <button
                          className="absolute top-0 right-0 m-2 shadow-md hover:bg-stop hover:text-white text-primary-500 font-bold py-1 px-2 rounded"
                          onClick={closeTenderView}>
                          Close
                        </button>
                        <p className="text-sm mt-2">
                          Match: {selectedTender.suitabilityScore}%
                        </p>
                      </div>
                      <h2 className="text-2xl font-bold mt-8 mb-4">{selectedTender.title} <ToolTip tooltipText={selectedTender["titleExplanation"]} /></h2>

                      {Object.keys(selectedTender)
                        .filter(
                          (key) =>
                            (useCase === 2 &&
                              ![
                                "title",
                                "suitabilityScore",
                                "uriDocText",
                                "iaUrlEtendering",
                                "cpvCodeExplanation",
                                "valueExplanation",
                                "deadlineExplanation",
                                "descriptionExplanation",
                                "locationExplanation",
                                "AIPAassessment",
                                "titleExplanation",
                                "countryCode",
                                "awardNotice",
                                "deadline"
                              ].includes(key)
                            )

                            ||

                            (
                              useCase !== 2 &&
                              ![
                                "title",
                                "suitabilityScore",
                                "uriDocText",
                                "iaUrlEtendering",
                                "cpvCodeExplanation",
                                "valueExplanation",
                                "deadlineExplanation",
                                "descriptionExplanation",
                                "locationExplanation",
                                "AIPAassessment",
                                "titleExplanation",
                                "countryCode",
                                "awardNotice"
                              ].includes(key)
                            )
                        )
                        .map((key) => {

                          function RenderTextWithLineBreaks({ text }: { text: string }) {
                            return (
                              <textarea readOnly value={text.replace('\n', '\n\n')} className="text-gray-800 p-4 hover:shadow-lg w-full h-52 border-2 rounded-md border-primary-500" />
                            );
                          }

                          function RenderCPVCodes({ codes }: { codes: string[] }) {
                            return (
                              <div>
                                <p className="text-black ml-4">
                                  Main CPV:
                                  <span className="text-gray-800 ml-2">{codes[0]}</span>
                                </p>
                                {codes.length > 1 && (
                                  <p className="text-black ml-4">
                                    Supplementary CPV{codes.length > 2 ? 's' : ''}:
                                    <span className="text-gray-800 ml-2">{codes.slice(1).join(', ')}</span>
                                  </p>
                                )}
                              </div>
                            );
                          }

                          function FormatDeadline({ deadline }: { deadline: string }) {
                            if (deadline === 'Not specified') {
                              return (
                                <p className="text-gray-800 ml-4">Not specified</p>
                              );
                            }
                            const datePart = deadline.split(' ')[0];
                            const timePart = deadline.split(' ')[1];
                            const formattedDate = `${datePart.slice(0, 4)}-${datePart.slice(4, 6)}-${datePart.length > 6 ? datePart.slice(6, 8) : ''}`;
                            return (
                              <p className="text-gray-800 ml-4">{formattedDate} {timePart}</p>
                            );
                          }

                          function reverseMapping(countries: Countries): { [key in CountryCode]?: CountryName } {
                            return Object.keys(countries).reduce<{ [key in CountryCode]?: CountryName }>((acc, countryName) => {
                              const countryCode = countries[countryName];
                              if (countryCode) {
                                acc[countryCode] = countryName;
                              }
                              return acc;
                            }, {});
                          }


                          return (
                            <div key={key} className="mb-3">
                              <p className="text-black font-semibold">
                                {key}:
                                {["cpvCode", "value", "description", "location"].includes(key) && (
                                  <ToolTip tooltipText={selectedTender[key + "Explanation"]} />
                                )}
                              </p>
                              {key === 'location' ? (
                                <p className="text-gray-800 ml-4">{reverseMapping(countriesList)[selectedTender[key]] || selectedTender[key]}</p>
                              ) : key === 'language' ? (
                                <p className="text-gray-800 ml-4">{reverseMapping(languagesList)[selectedTender[key]] || selectedTender[key]}</p>
                              ) :
                                key !== 'description' ? (
                                  key !== 'cpvCode' ? (
                                    (key === 'deadline' || key === 'datePublished') ? <FormatDeadline deadline={selectedTender[key]} />
                                      : <p className="text-gray-800 ml-4">{selectedTender[key]}</p>
                                  ) : <RenderCPVCodes codes={selectedTender[key]} />
                                ) : (
                                  <RenderTextWithLineBreaks text={selectedTender[key]} />
                                )}
                            </div>
                          );
                        })

                      }
                      <div className="text-black font-semibold mb-2">Contractors</div>
                      {(useCase === 2) && (
                        <div>
                          {selectedTender.awardNotice && selectedTender.awardNotice.contractDetails.map(item =>
                            <div className="mb-2 p-2 border-2 rounded-md border-primary-500">
                              <p>officialName: {item.officialName}</p>
                              <p>country: {item.country}</p>
                              <p>dateConclusion: {item.dateConclusion}</p>
                              <p>totalValue: {item.totalValue}</p>
                            </div>
                          )}
                        </div>)}
                      {useCase !== 2 && <div>
                        <p className="text-black font-semibold mt-4">Link to Etendering:</p>
                        <a href={selectedTender.iaUrlEtendering} className="text-primary-500 underline ml-4">
                          {selectedTender.iaUrlEtendering}
                        </a>
                      </div>}

                      <p className="text-black font-semibold mt-4">Link to tender:</p>
                      <a href={selectedTender.uriDocText} className="text-primary-500 underline ml-4">
                        {selectedTender.uriDocText}
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded m-8"
              onClick={HandleReturn}>
              Back to profile
            </button>
            {currentIndex !== 0 && <button
              className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded m-8"
              disabled={currentIndex === 0} // Disable the button if there are no previous items
              onClick={() => {
                setCurrentIndex(currentIndex - 5);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}>
              Previous
            </button>}
            {currentIndex + 5 < sortedTenders.length && <button
              className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded m-8"
              disabled={currentIndex + 5 >= sortedTenders.length} // Disable the button if there are no next items
              onClick={() => {
                setCurrentIndex(currentIndex + 5);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}>
              Next
            </button>}
          </div>
        )}
    </div>
  );
};

export default SearchResultView;
