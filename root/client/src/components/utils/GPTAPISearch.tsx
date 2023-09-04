import React, { FC, FormEvent, useState } from 'react';
import axios from 'axios';
import LoadingView from './LoadingView';
import { useAuth0 } from '@auth0/auth0-react';
/**
 * 
 * GPTAPISearch
 * 
 * This component is meant to work as the helping hand to the user in creating the profile.
 * Here any relevant information of the company is gathered together and passed to the LLM to process. 
 * Results are returned to the userProfileView component that parses relevant information to the subprofile. 
 * 
 */

interface GPTAPISearchProps {
  onResult: (result: string) => void;
  strategyContent?: string;
  financialDocumentsContent?: string;
  pastWorks?: string;
}

const GPTAPISearch: FC<GPTAPISearchProps> = ({ onResult, strategyContent, financialDocumentsContent, pastWorks }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();
  const scrollToDiv = (): void => {
    const element = document.getElementById('targetSearch');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!strategyContent && !financialDocumentsContent && !pastWorks) {
        alert("At least some information must be provided for strategy, financials, or past works.");
        throw new Error("At least some information must be provided for strategy, financials, or past works.");
      }

      const combinedPrompt = `Generate potential search parameters for search. Give just the search parameters.
                              \n\nThis is the strategy document of the business:
                              \n\n<article>${strategyContent}</article>
                              \n\nThis is the financial document of the business:
                              \n\n<article>${financialDocumentsContent}</article>
                              \n\nThis is the past experience reference document of the business:
                              \n\n<article>${pastWorks}</article>`;
      const token = await getAccessTokenSilently();
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/gpt/generate`, {
        prompt: combinedPrompt
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      onResult(response.data.result);

    } catch (error) {
      console.error(error);
    } finally {
      scrollToDiv();
      setLoading(false);
    }
  }

  return (
    <div>
      {loading && <LoadingView />}
      <form onSubmit={onSubmit}>
        <div className="flex items-center justify-between my-4">
          <button
            type="submit"
            className="bg-go hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-primary-800 focus:shadow-outline"
          >
            {" Fill search parameters "}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GPTAPISearch;
