/**
 * 
 * Assistant
 * 
 * This is the beef of the platform. 
 * Here we navigate between LogInView, UserProfileView, and SearchResultView
 * 
 */
import React, { useEffect, useState } from 'react';
import UserProfileView from '../components/profile/UserProfileView';
import SearchResultView from '../components/search/SearchResultView';
import LogInView from '../components/login/logInView';  // Note: I fixed the case from 'logInView' to 'LogInView' for consistency
import TenderIdeaView from '../components/profile/TenderIdeaView';
import { useAuth0 } from '@auth0/auth0-react';
import HomePage from './home/HomePage';


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


const Assistant: React.FC = () => {

  const { isAuthenticated, loginWithRedirect, logout, user, error } = useAuth0();

  const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;

  const [view, setView] = useState<string>('home');
  const [companyName, setCompanyName] = useState<string>("");
  const [subProfile, setSubProfile] = useState<ProfileType>({
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
  });
  const [useCase, setUseCase] = useState<number>(1);
  const [searchID, setSearchID] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && view === 'home') {
      setView('login');
    }
  }, [isAuthenticated]);

  if (error) {
    console.error("Authentication error:", error);
    return <div>Oops... {error.message}</div>;
  }

  return (
    <main className="mx-auto px-4 min-h-screen-78">
      {!isAuthenticated && view === 'home' && (
        <div className="login-container flex flex-col items-center justify-center h-screen-78">
          <HomePage onLoginClick={loginWithRedirect} />
          <button className="absolute right-4 top-4 bg-primary-500 md:hover:bg-stop text-white font-bold py-2 px-4 rounded" onClick={async () => {
            loginWithRedirect();
          }}>Login</button>
        </div>
      )
      }

      {
        isAuthenticated && AUTH0_CLIENT_ID && (
          <>
            {view === 'login' && <LogInView setView={setView} setCompanyName={setCompanyName} setUseCase={setUseCase} />}
            {view === 'profile' && useCase === 1 && companyName !== null && <UserProfileView handleLogout={logout} setUseCase={setUseCase} setView={setView} cname={companyName} setSearchID={setSearchID} updateSubProfile={setSubProfile} initialSubProfile={subProfile} />}
            {view === 'profile' && useCase === 2 && companyName !== null && <TenderIdeaView handleLogout={logout} setUseCase={setUseCase} setView={setView} cname={companyName} setSearchID={setSearchID} updateSubProfile={setSubProfile} initialSubProfile={subProfile} />}
            {view === 'search' && <SearchResultView useCase={useCase} setView={setView} setSubProfile={setSubProfile} subProfile={subProfile} searchID={searchID} />}
          </>
        )
      }
    </main >
  );
};

export default Assistant;
