/**
 * 
 * Sidebar
 * 
 * This component is responsible for the navigation betweeen profile's subprofiles.
 * Subprofiles are displayed as a list and there is a mechanism for creating and deleting the subprofiles. 
 * 
 */
import * as React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

type SidebarProps = {
  open: boolean;
  setOpen: (state: boolean) => void;
  setUseCase: (state: number) => void;
  subProfiles: Array<ProfileType>;
  setSubProfile: (profile: ProfileType) => void;
  profileID: string;
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

const Sidebar: React.FC<SidebarProps> = ({ setUseCase, open, setOpen, subProfiles, setSubProfile, profileID }) => {
  const [Profiles, setProfiles] = useState<Array<ProfileType>>([{
    _id: "-1",
    subProfileName: "init",
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
  }
  ]);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const set = (items: Array<ProfileType>) => {
      setProfiles(items);
    }
    if (subProfiles.length > 0) {
      set(subProfiles);
    }
  }, [subProfiles]);

  const [newTeamName, setNewTeamName] = useState<string>('');

  const addNewTeam = async () => {
    const teamData = {
      profileID: profileID,
      teamName: newTeamName,
    };
    const token = await getAccessTokenSilently();
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/profile/subprofile/create`, { teamData }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setProfiles([...Profiles, response.data.subProfile]);
        setNewTeamName('');
      })
      .catch(error => {
        console.error('There was an error adding the team:', error);
      });

    setNewTeamName('');
  }

  const deleteTeam = async (id: string) => {
    const token = await getAccessTokenSilently();
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/profile/subprofile/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setProfiles(Profiles.filter(profile => profile._id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the team:', error);
      });
  }


  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-hidden" onClose={setOpen}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in-out duration-500"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="absolute inset-0 flex">
              <Dialog.Panel className="w-screen max-w-md">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  {/* Move the button's container to the right */}
                  <div className="absolute sm:left-96 left-80 top-4 -mr-8 flex pr-2 pt-4 sm:-mr-10 sm:pr-4">
                    <button
                      type="button"
                      className="rounded-md text-gray-300 custom-md:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                      <p className="text-2xl mb-8 font-bold text-primary-500">My Teams</p>
                    </Dialog.Title>
                  </div>
                  <div>
                    {Profiles.every(item => item._id) ?
                      Profiles.map((item) => (
                        <div key={item._id}>
                          <div onClick={() => { setSubProfile(item); setOpen(false); }} className={`p-4 mx-4 my-2 border-2 border-primary-500 rounded-3xl lg:hover:bg-primary-100 lg:hover:rounded-lg transition-all duration-300 cursor-pointer `}>
                            <h3 className={`font-bold text-xl text-primary-500 inline-block`}>{item.subProfileName}</h3>
                            {item._id && item.subProfileName && item.subProfileName !== 'default' && (
                              <button className="inline-block float-right" onClick={async () => await deleteTeam(item._id)}>
                                <FaTrashAlt className="h-6 w-6 text-red-500 hover:text-red-900" />
                              </button>
                            )}

                          </div>
                        </div>
                      ))
                      :
                      <div>No subProfiles found!</div>}
                  </div>
                  <div className="flex-grow px-4 sm:px-6 mt-4">
                    <input
                      type="text"
                      placeholder="New team name"
                      className="border-2 rounded-lg p-2 w-full"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                    />
                    <button
                      onClick={async () => await addNewTeam()}
                      className="bg-primary-500 hover:bg-primary-700 text-white px-4 py-2 rounded-lg mt-2 w-full"
                    >
                      Add new team
                    </button>
                  </div>
                  <div className="use-case-container flex flex-col justify-end items-center h-full">
                      <p className="text-2xl my-4 font-bold text-primary-500">Use Case</p>
                      <div className="flex">
                        <button
                          onClick={() => setUseCase(1)}
                          className="m-2 p-2 text-lg bg-white text-blue-500 rounded-lg shadow-md border-2 border-blue-500 lg:hover:bg-primary-200">
                          for VENDORS
                        </button>
                        <button
                          onClick={() => setUseCase(2)}
                          className="m-2 p-2 text-lg bg-white text-blue-500 rounded-lg shadow-md border-2 border-blue-500 lg:hover:bg-primary-200">
                          for BUYERS
                        </button>
                      </div>
                    </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Sidebar;
