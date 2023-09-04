import React, { useState, ChangeEvent, FC } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
/**
 * CPVChecker
 * 
 * This component is a tool for the user to check unknown CPV codes. 
 * User gives input that is validated and then we ask the database for a description of the code. 
 * This component is also used to validate LLM generated CPV codes in the userProfileView component. 
 */
const CPVChecker: FC = () => {
  const [cpvCode, setCpvCode] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const { getAccessTokenSilently } = useAuth0();

  const fetchData = async (): Promise<void> => {
    if (/^\d{8}$/.test(cpvCode.trim())) {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get<{ englishname: string }>(`${process.env.REACT_APP_BACKEND_URL}/cpv/${cpvCode}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setDescription(response.data.englishname);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Invalid input. The CPV code must be exactly 8 digits.');
    }
  };

  return (
    <div className="rounded-md bg-primary-200 p-4 my-4">
      <div className="flex flex-col sm:flex-row" style={{ width: '100%', boxSizing: 'border-box' }}>
        <input
          type="text"
          value={cpvCode}
          placeholder="00000000"
          className="border-2 rounded-lg p-2 mb-2 sm:mb-0 sm:mr-2"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCpvCode(e.target.value)}
          maxLength={8}
        />
        <button className="bg-white hover:bg-primary-700 hover:text-white text-primary-500 px-4 py-2 rounded-lg mt-2 sm:mt-0 w-full sm:w-auto" onClick={fetchData}>Check CPV</button>
      </div>
      <textarea placeholder="Description..." className="border-2 rounded-lg p-2 w-full mt-2" value={description}></textarea>
    </div>
  );
}

export default CPVChecker;
