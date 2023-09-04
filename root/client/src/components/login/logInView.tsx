import React, { useState, useEffect, ChangeEvent, FC } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

interface LogInViewProps {
  setView: (view: string) => void;
  setCompanyName: (name: string) => void;
  setUseCase: (useCase: number) => void;
}

const LogInView: FC<LogInViewProps> = ({ setView, setCompanyName, setUseCase }) => {
  const [username, setUsername] = useState<string>('');
  const [viewStage, setViewStage] = useState<'login' | 'signingIn' | 'useCase' | 'profile'>('signingIn');

  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  // Check for user's existence in the database on component mount
  useEffect(() => {

    const fetchProfile = async (subid: string) => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile/fetch/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.status === 200) {
          console.log(response.data)
          setViewStage('useCase'); // User exists, move to the 'useCase' stage
          setCompanyName(response.data.companyName);
          setUsername(response.data.companyName);
        } else {
          setViewStage('login');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setViewStage('login');
      }
    };

    if (isAuthenticated && user) {
      console.log(user);
      fetchProfile(user.sub as string); // should use sub maybe
      setUsername(user.name as string);
    }
  }, []);

  const handleLogin = async () => {
    if (username === '' || username.trim() === '') {
      alert('You must add a username.');
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/profile/create`, { companyName: username },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      setCompanyName(username);
      setViewStage('useCase');
    } catch (error) {
      console.error('Error adding new user:', error);
      alert(`Could not add user ${error}`);
    }
  };

  const handleUseCaseSelection = (selectedUseCase: number) => {
    setUseCase(selectedUseCase);
    setView('profile');
  }

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.trim());
  }

  if (viewStage === 'signingIn') {
    return (
      <div className="signing-in-container flex flex-col items-center justify-center h-screen-78">
        <h1 className="mb-5 text-3xl text-primary-500">Signing you in...</h1>
        {/* Optional: You can also add a loader or spinner here */}
      </div>
    );
  } else if (viewStage === 'login') {
    return (
      <div className="login-container flex flex-col items-center justify-center h-screen-78">
        <h1 className="mb-5 text-3xl text-primary-500">Welcome! What should we call you?</h1>
        <input
          type="text"
          value={username}
          onChange={onUsernameChange}
          placeholder="Enter your username"
          className="mb-5 p-3 w-64 rounded-lg text-lg bg-white border-2 border-blue-500"
        />
        <button onClick={handleLogin} className="login-button p-2 text-xl bg-white text-blue-500 rounded-lg shadow-md border-2 border-blue-500">Continue</button>
      </div>
    );
  } else if (viewStage === 'useCase') {
    return (
      <div className="use-case-container flex flex-col items-center justify-center h-screen-78">
        <h1 className="mb-5 text-3xl text-primary-500">Hello {username}! Select your use case.</h1>
        <button onClick={() => handleUseCaseSelection(1)} className="w-48 mb-3 p-4 text-xl bg-white text-blue-500 rounded-lg shadow-md border-2 border-blue-500 hover:bg-primary-200">for VENDORS</button>
        <button onClick={() => handleUseCaseSelection(2)} className="w-48 p-4 text-xl bg-white text-blue-500 rounded-lg shadow-md border-2 border-blue-500 hover:bg-primary-200">for BUYERS</button>
      </div>
    );
  }

  return null;
};

export default LogInView;
