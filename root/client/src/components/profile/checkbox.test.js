import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DropdownCheckbox from './checkbox';

describe('DropdownCheckbox', () => {
  const mockCountriesList = {
    'Finland': 'FI',
    'Sweden': 'SE'
  };
  const mockOptions = ['Finland', 'Sweden'];
  const mockValue = [];
  const mockOnChange = jest.fn();

  it('renders without crashing', () => {
    render(<DropdownCheckbox countriesList={mockCountriesList} options={mockOptions} value={mockValue} onChange={mockOnChange} />);
  });

  it('displays the default select message when no countries are selected', () => {
    const { getByText } = render(<DropdownCheckbox countriesList={mockCountriesList} options={mockOptions} value={mockValue} onChange={mockOnChange} />);
    expect(getByText('Selected: Select...')).toBeInTheDocument();
  });

  it('opens dropdown and displays options when button is clicked', () => {
    const { getByText, queryByText } = render(<DropdownCheckbox countriesList={mockCountriesList} options={mockOptions} value={mockValue} onChange={mockOnChange} />);
    fireEvent.click(getByText('Selected: Select...'));
    expect(queryByText('Finland')).toBeInTheDocument();
    expect(queryByText('Sweden')).toBeInTheDocument();
  });

  it('displays selected countries in the button label', () => {
    const selectedCountries = ['FI'];
    const { getByText } = render(<DropdownCheckbox countriesList={mockCountriesList} options={mockOptions} value={selectedCountries} onChange={mockOnChange} />);
    expect(getByText('Selected: FI')).toBeInTheDocument();
  });
});

