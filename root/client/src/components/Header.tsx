/**
 * 
 * Header
 * 
 * This component is a stand alone component and won't discuss with any other parts of the platform. 
 * This component was created to display our beautiful logo
 * and to guide the user attention to the right, to not get lost in the browser search bar. We dont want that.
 * 
 */
import React, { useState, useEffect } from 'react';
import logo from '../Images/appaipalogo.png';

const Header: React.FC = () => {
  const [opacity, setOpacity] = useState<number>(1);
  const [aipaOpacity, setAipaOpacity] = useState<number>(0);
  const [textMaxHeight, setTextMaxHeight] = useState<string>("6em");  // Starting max-height (Adjust as needed)

  useEffect(() => {
    const interval = setInterval(() => {
      if (opacity > 0) {
        setOpacity(prevOpacity => prevOpacity - 0.02);
      } else {
        clearInterval(interval);
        setTextMaxHeight("0");  // Collapse the header after the text fades out
        const aipaFadeInterval = setInterval(() => {
          if (aipaOpacity < 1) {
            setAipaOpacity(prevAipaOpacity => prevAipaOpacity + 0.02);
          } else {
            clearInterval(aipaFadeInterval);
          }
        }, 40);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [opacity, aipaOpacity]);

  return (
    <header className="bg-primary-500 py-4">
      <div className="w-full flex items-center justify-center px-4">
        <h1 className="text-white text-3xl font-bold text-center relative">
          <span className="inline-block" style={{ opacity, maxHeight: textMaxHeight, overflow: "hidden", transition: "max-height 1.5s" }}>
            Artificial Intelligence Procurement Assistant
          </span>
          <span className="inline-block absolute justify-center items-center mt-4" style={{ opacity: aipaOpacity, left: '50%', transform: 'translate(-50%, -50%)' }}>
            <img src={logo} alt="AIPA Logo" style={{ width: 'auto', height: '2em' }} />
          </span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
