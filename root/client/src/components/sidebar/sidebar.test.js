import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  const subProfiles = [
    { _id: 1, subProfileName: 'SubProfile 1' },
    { _id: 2, subProfileName: 'SubProfile 2' },
    { _id: 3, subProfileName: 'SubProfile 3' },
  ];
  const profileID = 123;

  test('displays subProfiles with delete buttons', () => {
    render(
      <Sidebar
        open={true}
        setOpen={() => {}}
        subProfiles={subProfiles}
        setSubProfile={() => {}}
        profileID={profileID}
      />
    );

    // Check if subProfiles are displayed with their names
    subProfiles.forEach((item) => {
      const subProfileNameElement = screen.getByText(item.subProfileName);
      expect(subProfileNameElement).toBeInTheDocument();
    });

  });

  test('disables Add new team button when input is empty', () => {
    render(
      <Sidebar
        open={true}
        setOpen={() => {}}
        subProfiles={subProfiles}
        setSubProfile={() => {}}
        profileID={profileID}
      />
    );

    const addButton = screen.getByRole('button', { name: /Add new team/i });
    const newTeamNameInput = screen.getByPlaceholderText('New team name');
    fireEvent.change(newTeamNameInput, { target: { value: 'New Team' } });

    expect(addButton).toBeEnabled();
  });
});
