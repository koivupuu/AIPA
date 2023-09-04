/**
 * 
 * ScrapeHeaders
 * 
 * This component is used to fetch information of the company based on user-given links.
 * Url is validated and passed to the fetching engine. After that the result is passed back to the userProfileView to handle.
 * 
 */
import React, { useState } from 'react';
import axios from 'axios';
import LoadingView from './LoadingView';
import { useAuth0 } from '@auth0/auth0-react';

interface ScrapeHeadersProps {
  onFetched: (data: string) => void;
}

const ScrapeHeaders: React.FC<ScrapeHeadersProps> = ({ onFetched }) => {
  const [url, setUrl] = useState<string>('');
  const [headings, setHeadings] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();
  const isValidHttpsUrl = (string: string): boolean => {
    let url;
  
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "https:";
  };

  const fetchHeadings = async (): Promise<void> => {
    if (!isValidHttpsUrl(url)) {
      alert("Please enter a valid HTTPS URL.");
      return;
    }

    try {
      setLoading(true);
      console.log(url);
      const token = await getAccessTokenSilently();
      const response = await axios.post<{ text: string }>(`${process.env.REACT_APP_BACKEND_URL}/profile/scrape/`, { url: url }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const combinedData = response.data.text;
      setHeadings(combinedData);
      onFetched(combinedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div>
      {loading && <LoadingView />}
      <div className="flex w-full">
        {/*<div className="w-full shadow-md border-2 border-primary-100 rounded-lg p-2 text-black cursor-pointer">Link Reading Temporarily Disabled! {" :( "} Our amazing engineering team is working on it!</div>*/}
        <input className="w-full shadow-md border-2 border-primary-100 rounded-lg p-2 text-black cursor-pointer" type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter URL" />
        <button className="bg-primary-500 m-2 lg:hover:bg-primary-700 text-white py-2 px-4 font-bold p-1 rounded focus:outline-primary-800 focus:shadow-outline" onClick={fetchHeadings}>Fetch</button>
      </div>
      {headings && (
        <div>
          <textarea
            readOnly
            value={headings}
            className="bg-transparent shadow-md border-2 border-primary-100 rounded-lg w-full p-2 my-2"
          />
        </div>
      )}
    </div>
  );
}

export default ScrapeHeaders;
