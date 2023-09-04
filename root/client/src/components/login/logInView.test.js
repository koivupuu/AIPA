import React from 'react';
import { render } from '@testing-library/react';
import LogInView from './logInView';

describe('LogInView', () => {
  let mockSetView, mockSetCompanyName, mockSetUseCase;

  beforeEach(() => {
    mockSetView = jest.fn();
    mockSetCompanyName = jest.fn();
    mockSetUseCase = jest.fn();
  });

  it('renders without crashing', () => {
    render(<LogInView setView={mockSetView} setCompanyName={mockSetCompanyName} setUseCase={mockSetUseCase} />);
  });

  it('displays the login prompt on initial render', () => {
    const { getByText } = render(<LogInView setView={mockSetView} setCompanyName={mockSetCompanyName} setUseCase={mockSetUseCase} />);
    expect(getByText('Please Log In')).toBeInTheDocument();
  });

  it('contains the username input field', () => {
    const { getByPlaceholderText } = render(<LogInView setView={mockSetView} setCompanyName={mockSetCompanyName} setUseCase={mockSetUseCase} />);
    expect(getByPlaceholderText('Enter your username')).toBeInTheDocument();
  });

  it('contains the Log In button', () => {
    const { getByText } = render(<LogInView setView={mockSetView} setCompanyName={mockSetCompanyName} setUseCase={mockSetUseCase} />);
    expect(getByText('Log In')).toBeInTheDocument();
  });
});
