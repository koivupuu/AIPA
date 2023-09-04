/**
 * 
 * Tooltip
 * 
 * This document is rendered in multiple places inside of the program. 
 * The component is a small box with a question mark and onClick a bit bigger infobox is opened. 
 * tooltipText is the content that is displayed on click. 
 */
import React, { useState, useRef, useEffect } from 'react';
import CPVChecker from './CPVChecker';  // Import the CPVChecker component. Adjust the path as necessary.

interface ToolTipProps {
  tooltipText: string;
}

const ToolTip: React.FC<ToolTipProps> = ({ tooltipText }) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleTooltipClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  const closeTooltip = (): void => {
    setShowTooltip(false);
  };

  const getTooltipPosition = (): string => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        return 'left-0';
      }
    }
    return '-right-60';
  };

  const [position, setPosition] = useState<string>(getTooltipPosition());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        closeTooltip();
      }
    };
    setPosition(getTooltipPosition());
    window.addEventListener('resize', () => setPosition(getTooltipPosition()));
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', () => setPosition(getTooltipPosition()));
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  if (tooltipText === 'cpv') {
    return (
      <span className="relative cursor-pointer ml-2">
        <span
          className="bg-primary-500 hover:bg-primary-700 text-white px-1 rounded focus:outline-primary-800 focus:shadow-outline"
          onClick={handleTooltipClick}
        >
          {showTooltip ? 'x' : '?'}
        </span>
        {showTooltip && (<CPVChecker />)}
      </span>
    );
  }

  return (
    <span className="relative cursor-pointer ml-2">
      <span
        className="bg-primary-500 hover:bg-primary-700 text-white px-1 rounded focus:outline-primary-800 focus:shadow-outline"
        onClick={handleTooltipClick}
      >
        ?
      </span>
      {showTooltip && (
        <div ref={tooltipRef} className={`absolute z-10 w-56 p-2 mt-2 text-sm text-white bg-primary-500 rounded-lg shadow-lg ${position} -top-8`}>
          <p>{tooltipText}</p>
        </div>
      )}
    </span>
  );
};

export default ToolTip;
