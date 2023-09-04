import React, { useState, useEffect } from 'react';
import Clock from './Clock';

const LoadingView: React.FC = () => {
  const tips = [
    "To get more results, Widen the cost range and give more keywords and cpv codes.",
    "Not happy with your results? Remember to give us feedback, so we can better our services.",
    "To get more relevant results try giving only a few accurate keywords and CPV codes",
    "Did you know? You can split up your searches to different Sub-Profiles in the sidebar.",
    "Using link reading? Remember to give only relevant pages. Our reader won't look around anywhere else in your website.",
    "New to CPV codes? AIPA will give you explanations in the bottom of the page.",
    "Did not get today's matches? The TED database is not updated every day.",
    "Want to see how others are doing? Try searching the award notices and results.",
    "Always remember to confirm the information in your search profile because the quality of AI given information may vary due to AI not being deterministic enough yet",
  ];

  const [currentTip, setCurrentTip] = useState(tips[Math.floor(Math.random() * tips.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50 blur" />
      <div className="relative z-10 flex flex-col justify-center items-center space-y-3 text-2xl font-bold text-white">

        <div className="flex space-x-1">
          <span>Loading</span>
          <span className="animate-ping">.</span>
          <span className="animate-ping delay-1000">.</span>
          <span className="animate-ping delay-2000">.</span>
        </div>
        <div className="lg:mx-32 md:mx-16 mx-4 mt-8">
          <span >{currentTip}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingView;
