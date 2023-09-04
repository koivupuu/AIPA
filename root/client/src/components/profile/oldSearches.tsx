import React, { useState, useEffect, FC } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

import { FaTrashAlt } from 'react-icons/fa';

interface OldSearchesProps {
  subProfile: {
    _id: string;
    [key: string]: any;
  };
  setView: (view: string) => void;
  setSearchID: (id: string) => void;
  updateSubProfile: (profile: any) => void;
}

interface DataItem {
  _id: string;
  docid?: string;  // Assuming your items may have a docid property
  time: string;
  [key: string]: any;
}

const OldSearches: FC<OldSearchesProps> = ({ subProfile, setView, setSearchID, updateSubProfile }) => {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>();
    const { getAccessTokenSilently } = useAuth0();
    

    useEffect(() => {
        if (subProfile._id === "-1") return;
        const fetchData = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/search/fetch/${subProfile._id}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                setData(response.data);
                setLoading(false);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.message);
                } else {
                    // handle other unknown errors if needed or set a generic error message
                    setError("An unexpected error occurred.");
                }
                setLoading(false);
            }
                  
        };

        fetchData();

    }, [subProfile._id]);

    const handleDelete = async (itemId: string) => {
        try {
            const token = await getAccessTokenSilently();
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/search/delete/${itemId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
            setData(prevData => prevData.filter(item => item._id !== itemId)); // Assuming your items have a docid property
        } catch (err) {
            console.error(`Error deleting item with id ${itemId}:`, err);
        }
    }

    function formatTimestamp(timestamp: string): string {
        // Parse the timestamp into a Date object
        const date = new Date(timestamp);
        
        // Define options for the format
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long', // e.g., "Thursday"
          year: 'numeric', // e.g., "2023"
          month: 'long',   // e.g., "August"
          day: 'numeric',  // e.g., "24"
          hour: '2-digit',  // e.g., "06"
          minute: '2-digit', // e.g., "33"
          second: '2-digit', // e.g., "33"
          timeZoneName: 'short' // e.g., "UTC"
        };
        
        // Use the user's locale or fallback to 'en-US' for formatting
        const formattedDate = new Intl.DateTimeFormat(navigator.language || 'en-US', options).format(date);
      
        return `${formattedDate}`;
      }

    if (loading) return <p>Loading your search history... {";-)"}</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className="w-full my-6 font-bold text-2xl">Search History</div>
            <ul>
                {(data && data.length > 0)
                    ? (data.map((item, index) => (
                        <li
                            onClick={() => {
                                setSearchID(item._id);
                                updateSubProfile(subProfile);
                                setView('search');
                            }}
                            key={index}
                            className={`p-4 my-2 border-2 border-primary-500 rounded-3xl lg:hover:bg-primary-100 lg:hover:rounded-lg transition-all duration-300 cursor-pointer flex justify-between items-center`}
                        >
                            <p className={`font-bold text-xl text-primary-500`}>{formatTimestamp(item.time)}</p>
                            <button onClick={(e) => {
                                e.stopPropagation();  // This will prevent the li's onClick from being triggered when you click the button
                                handleDelete(item._id);
                            }}>
                                <FaTrashAlt className="h-6 w-6 text-red-500 lg:hover:text-red-900" />
                            </button>
                        </li>

                    )))
                    : <div className={`p-4 mx-4 my-2 border-2 border-primary-500 rounded-3xl lg:hover:bg-primary-100 lg:hover:rounded-lg transition-all duration-300 cursor-pointer `}>
                        <p className={`font-bold text-xl text-primary-500 inline-block`}>No history. Let's make a search!</p>
                    </div>}
            </ul>
        </div>
    );
}

export default OldSearches;
