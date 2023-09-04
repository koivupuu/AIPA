import React, { useState, useEffect, ChangeEvent, Dispatch, SetStateAction } from "react";
import GPTAPISearch from '../utils/GPTAPISearch';
import ToolTip from "../utils/Tooltip";
import DropdownCheckbox from "./checkbox";
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import { ImMenu } from "react-icons/im";
import { countriesList } from "../utils/Countries";
import { useAuth0 } from '@auth0/auth0-react';

type IdeaType = {
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

interface ReadOnlyFields {
    description: boolean;
    type: boolean;
    lowestcost: boolean;
    highestcost: boolean;
    cpvCodes: boolean;
    country: boolean;
}

interface TenderIdeaViewProps {
    setView: (view: string) => void;
    cname: string;
    updateSubProfile: Dispatch<SetStateAction<IdeaType>>;
    initialSubProfile: IdeaType;
    setSearchID: (id: string) => void;
    handleLogout: () => void;
    setUseCase: (state: number) => void;
}


const TenderIdeaView: React.FC<TenderIdeaViewProps> = ({ setUseCase, handleLogout, setView, cname, updateSubProfile, initialSubProfile, setSearchID }) => {
    const { getAccessTokenSilently } = useAuth0();
    const initialProfile = initialSubProfile ? initialSubProfile : {
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

    const [idea, setSubProfile] = useState<IdeaType>(initialProfile);
    const [ideas, setSubProfiles] = useState<IdeaType[]>([]);
    const [profileID, setProfileID] = useState<string>("-1");
    const [readOnlyFields, setReadOnlyFields] = useState<ReadOnlyFields>({
        description: false,
        type: false,
        lowestcost: false,
        highestcost: false,
        cpvCodes: false,
        country: false
    });


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
        fetchProfile();
        setSearchID('');
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [cname]);

    const saveIdea = async () => {
        const subProfileId = idea._id;
        // Send a put request to the server
        const token = await getAccessTokenSilently();
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/profile/subprofile/update/${subProfileId}`, { subProfile: idea },
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
    

    // Modify your handleInputChange function
    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        let { name, value } = e.target;
        if (name === "cpvCodes") {
            value = value.split(',');
        }
        setSubProfile({ ...idea, [name]: value });
    };

    const areAllFieldsEmpty = () => {
        if (Array.isArray(idea['cpvCodes']) && idea['cpvCodes'].length > 0 && idea['description'].trim().length > 0) {
            return false;
        }
        return true;
    };


    type ParsedXMLResult = {
        cpvcodes?: string[],
        lowestcost?: string,
        highestcost?: string
    };

    const parseXML = (data: string): ParsedXMLResult => {
        const keys = ['cpvcodes', 'lowestcost', 'highestcost'];
        const tags = ['cpv', 'lowestcost', 'highestcost'];
        const result: ParsedXMLResult = {};

        tags.forEach((tag, index) => {
            const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, "s");
            const match = data.match(regex);

            if (match && match[1]) {
                // If tag is 'cpv', split the codes into an array
                if (tag === 'cpv') {
                    (result[keys[index] as keyof ParsedXMLResult] as string[]) = match[1].trim().split(',').map((val: string) => val.trim());
                } else {
                    (result[keys[index] as keyof ParsedXMLResult] as string) = match[1].trim(); // converting the values to numbers
                }
            }
        });

        return result;
    }



    const validateCpvCodes = async (codes: string | any[]) => {
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

    const handleResult = async (result: any) => {
        let parsedResult = parseXML(result);

        // Check if parsedResult is valid and contains cpvcodes
        if (parsedResult && parsedResult.cpvcodes) {
            try {
                parsedResult.cpvcodes = await validateCpvCodes(parsedResult.cpvcodes);

                // Constructing the new profile object
                const newProfile: Partial<IdeaType> = {};

                if (parsedResult.cpvcodes) {
                    newProfile.cpvCodes = parsedResult.cpvcodes;
                }
                if (typeof parsedResult.lowestcost === 'string') {
                    newProfile.lowestcost = parsedResult.lowestcost;
                }
                if (typeof parsedResult.highestcost === 'string') {
                    newProfile.highestcost = parsedResult.highestcost;
                }

                setSubProfile((prevProfile: IdeaType) => ({
                    ...prevProfile,
                    ...newProfile
                }));
            } catch (error) {
                console.error("Error validating CPV codes:", error);
            }
        }
    };



    const [checkAll, setCheckAll] = useState(false);

    const handleCheckAllChange = () => {
        setCheckAll(prevCheckAll => {
            const newCheckAllValue = !prevCheckAll;

            setReadOnlyFields(prevReadOnlyFields => {
                const newState: ReadOnlyFields = { ...prevReadOnlyFields };

                for (const key in newState) {
                    newState[key as keyof ReadOnlyFields] = newCheckAllValue;
                }

                return newState;
            });

            return newCheckAllValue;
        });
    };



    const handleCheckboxChange = (field: keyof ReadOnlyFields) => {
        setReadOnlyFields(prevState => {
            const updatedState = { ...prevState, [field]: !prevState[field] };
            const allChecked = Object.values(updatedState).every(value => value === true);
            setCheckAll(allChecked);
            return updatedState;
        });
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div>
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
                                updateSubProfile({
                                    _id: "-1",
                                    subProfileName: "Init",
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
                    <h1 className="text-center text-primary-500 font-bold text-4xl mb-5">{cname + " : " + idea.subProfileName || "Company Name"}</h1>
                </div>
                <div className="col-span-full grid md:grid-cols-2 grid-cols-1 gap-1">
                    <div id="targetSearch" className="col-span-full my-6 font-bold text-2xl">Search Parameters</div>
                    <div className="border-0 col-span-full border-primary-300 rounded-md p-2">
                        <label className="block text-black font-bold">Topic Text <ToolTip tooltipText="Describe your idea here." /></label>
                        <div className="flex items-center">
                            <textarea
                                className={`w-full shadow-md border-2 border-primary-100 rounded-lg p-2 text-black ${readOnlyFields.description ? 'bg-gray-300' : 'bg-white'}`}
                                name="description"
                                data-testid="descriptionarea"
                                onChange={handleInputChange}
                                value={(idea && idea.description) || []}
                                readOnly={readOnlyFields.description}></textarea>
                            <input type="checkbox" className="mx-4" checked={readOnlyFields.description} onChange={() => handleCheckboxChange('description')} />
                        </div>
                    </div>
                    <div className="col-span-full border-0 border-primary-300 rounded-md p-4">
                        {/* Here we should create an actual controller (to save tokens a.k.a Tommi's wallet) but for now we recycle the old controller*/}
                        <GPTAPISearch
                            onResult={handleResult}
                            strategyContent={idea.description}
                            financialDocumentsContent={''}
                            pastWorks={''}
                        />
                    </div>
                    <div className="border-0 border-primary-300 rounded-md p-2">
                        <label className="block text-black font-bold">Lowest Cost <ToolTip tooltipText="Enter the lowest cost for the tender." /></label>
                        <div className="flex items-center">
                            <textarea
                                className={`w-full shadow-md border-2 border-primary-100 rounded-lg p-2 text-black ${readOnlyFields.lowestcost ? 'bg-gray-300' : 'bg-white'}`}
                                name="lowestcost"
                                onChange={handleInputChange}
                                readOnly={readOnlyFields.lowestcost}
                                value={(idea && idea.lowestcost) || ''}
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
                                value={(idea && idea.highestcost) || ''}
                            />
                            <input type="checkbox" className="mx-4" checked={readOnlyFields.highestcost} onChange={() => handleCheckboxChange('highestcost')} />
                        </div>
                    </div>
                    <div className="col-span-full border-0 border-primary-300 rounded-md p-2">
                        <label className="block text-black font-bold">CPV Code List <ToolTip tooltipText="These are the main CPV codes that are relevant to your company and the most important part of the search" /></label>
                        <div className="flex items-center">
                            <textarea data-testid="cpvCodesTextarea" className={`w-full shadow-md border-2 border-primary-100 rounded-lg p-2 text-black ${readOnlyFields.cpvCodes ? 'bg-gray-300' : 'bg-white'}`} name="cpvCodes" onChange={handleInputChange} value={(idea && idea.cpvCodes) || []} readOnly={readOnlyFields.cpvCodes}></ textarea>
                            <input type="checkbox" className="mx-4" checked={readOnlyFields.cpvCodes} onChange={() => handleCheckboxChange('cpvCodes')} />
                        </div>
                    </div>
                    <div className="border-0 border-primary-300 rounded-md p-2">
                        <label className="block text-black font-bold">Countries <ToolTip tooltipText="By selecting languages your search returns results only in those languages." /></label>
                        <div className="flex items-center mt-3">
                            <div>
                                <DropdownCheckbox
                                    countriesList={countriesList}
                                    options={Object.keys(countriesList)}
                                    value={(idea && idea.languages) || []}
                                    onChange={(newValue) => setSubProfile({ ...idea, languages: newValue })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-black text-lg font-bold">Ready for search?</label>
                    <div className="flex items-center">
                        <button
                            name="checkAll"
                            data-testid="readyButton"
                            className={checkAll ? "bg-stop md:hover:bg-stop text-white font-bold py-2 px-4 rounded my-4" : "bg-primary-500 md:hover:bg-primary-700 text-white font-bold py-2 px-4 rounded my-4"}
                            onClick={() => {
                                if (areAllFieldsEmpty()) {
                                    alert('Please fill in at least CPV codes and Topic Text to enable search.');
                                } else {
                                    handleCheckAllChange();
                                    saveIdea();
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
                                data-testid="searchButton"
                                className="bg-go md:hover:bg-primary-700 text-white font-bold py-2 px-4 rounded my-4"
                                onClick={() => {
                                    if (areAllFieldsEmpty()) {
                                        alert('Please fill in at least CPV codes and Topic Text to enable search.')
                                    } else {
                                        updateSubProfile(idea);
                                        setView('search');
                                    }
                                }}
                            >
                                Search
                            </button>
                        </div>
                    }
                </div>
            </div>

            <Sidebar open={sidebarOpen} setUseCase={setUseCase} setOpen={setSidebarOpen} subProfiles={ideas} setSubProfile={setSubProfile} profileID={profileID} />
        </div >

    );
};

export default TenderIdeaView;
