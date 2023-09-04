import React, { useState, useEffect, FC } from 'react';

/**
 * Clock
 * 
 * This component is used mainly in the loadingView component to display the time passed in loading state. 
 */
const Clock: FC = () => {
  const startTime = new Date().getTime();
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().getTime() - startTime);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [startTime]);

  const formatTime = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((milliseconds % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((milliseconds % 60000) / 1000).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="clock-container">
      <h1 className="text-2xl font-bold text-white">{formatTime(time)}</h1>
    </div>
  );
};

export default Clock;
