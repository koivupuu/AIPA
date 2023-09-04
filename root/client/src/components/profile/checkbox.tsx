/**
 * 
 * DropdownCheckbox
 * 
 * This component is used to create a checkbox multiple choise menu of languages. 
 * The main component gives the relevat information and onBack mechanishms. 
 * Selected values are displayed in the box. 
 * The component excpects the countries list to have two fields. 
 * Key that is the actual country name "ie. Finland"
 * Value that is the ISO code for the country "ie. FI"
 * 
 */
import React, { useState, FC, useEffect, useRef } from 'react';

interface DropdownCheckboxProps {
  countriesList: { [key: string]: string };
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
}

const DropdownCheckbox: FC<DropdownCheckboxProps> = ({ countriesList, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup on unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedValue: string) => {
    const code = countriesList[selectedValue];
    if (value.includes(code)) {
      onChange(value.filter((v) => v !== code));
    } else {
      onChange([...value, code]);
    }
  };

  const checkedOptions = options.filter(option => value.includes(countriesList[option]));
  const uncheckedOptions = options.filter(option => !value.includes(countriesList[option]));

  checkedOptions.sort();
  uncheckedOptions.sort();

  const sortedOptions = [...checkedOptions, ...uncheckedOptions];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="py-2 px-4 rounded border border-gray-300 bg-white text-gray-700 shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        Selected: {value.length > 0 ? value.join(', ') : 'Select...'}
      </button>
      {isOpen && (
        <div
          className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow"
          style={{ maxHeight: '200px', overflowY: 'auto' }}
        >
          {sortedOptions.map((option, i) => (
            <label key={i} className="flex items-center py-2 px-4">
              <input
                type="checkbox"
                className="mr-2 leading-tight"
                checked={value.includes(countriesList[option])}
                onChange={() => handleSelect(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckbox;

