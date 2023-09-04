## Table of Contents
1. [Introduction](#introduction)
2. [Project Setup](#project-setup)
3. [Folder Structure](#folder-structure)
4. [Components](#components)
5. [Services/APIs](#servicesapis)
6. [Styles and Themes](#styles-and-themes)
7. [Testing](#testing)
8. [Deployment](#deployment)


# 1. Introduction
Welcome to the client-side documentation for our specialized search engine, designed with precision to cater to the niche requirements of procurement call discoveries. Our application stands at the intersection of innovation and necessity, paving the way for bidding teams to identify pertinent tenders with unprecedented ease.

### 1.1 Overview

The landscape of procurement call search engines, although populated with solutions like TED EU and HILMA, often demands a manual and intensive approach. Our project aims to bridge this gap, ensuring a seamless, efficient, and cost-effective experience. Through this platform, users are ushered through a systematic process: from account creation and profile setup, driven by simple web scraping techniques and LLM text processing, to the prioritized display of search results based on recency and suitability scores.

Our vision transcends just finding the right tender. We have integrated features to usher users effortlessly from discovering a relevant notice to transitioning to the e-tendering portal. Each step is meticulously crafted to reduce friction, enhancing the user's search experience manifold.

Dive into this documentation to understand the architectural decisions, component structures, and nuances of our application. Together, we aim to revolutionize the way bidding teams interact with procurement call opportunities.

# 2. Project Setup

### Introduction
Our application is hosted on a dedicated domain at [www.appaipa.eu](http://www.appaipa.eu). For comprehensive details about server-side dependencies and hardware prerequisites, refer to the server-side documentation `.md` file. This section will guide you through the setup of the client side.

### 2.1. Prerequisites
- **Software Dependencies:** Ensure you have Node.js and npm installed on your machine. These are vital for running and building the client side.

### 2.2. Installation
- Begin by installing the required dependencies for the client side using the command:

### 2.3. Running the Client
- To run the client in a minimal functionality mode (without a connection to the database and backend), use the command:

> Note: This mode restricts the application's capabilities as it lacks backend integration.

### 2.4. Configuration
- Detailed instructions regarding the expected environment variables and additional configuration settings can be found in the main `.md` file at root directory.



# 3. Folder Structure

The client side of our application utilizes a well-defined directory structure, which is based on standard React practices, but tailored for our specific needs.

### 3.1. Root Folders

- **build**: Contains the production-ready, compiled files of the project.
- **public**: Hosts static files that can be accessed publicly.
- **src**: The main source code folder.

### 3.2. Source (`src`) Folder

Within the `src` folder, you'll find:

- **components**: This is the heart of our React application. It holds individual component folders and files which make up the majority of the UI and functionality.
  - **login**: Houses `logInView.js` responsible for user login functionality.
  - **profile**: Contains `checkbox.js` for selecting countries during profile creation, `UserProfileView.js` for profile and subprofile management, and `suitabilityColors.js` for rendering colors based on suitability scores.
  - **search**: Inside, you'll find `Chart.js` for graphical representations and `MainSearchResultView.js` which deals with rendering search results.
  - **sidebar**: This only contains `sidebar.js` for switching between different search profiles and managing subprofiles.
  - **utils**: A collection of utility files and components such as `Clock.js`, `Countries.js`, `CPVChecker.js`, and more, providing various functionalities to the app.
  
- **images**: A directory for storing all the images used in the client side.

- **Configuration Files**: Various `.js` and `.css` files crucial for the application's operation and styling. Notably, `tailwind.config.js` houses the theme configuration (detailed in [Section 7. Styles and Themes](#6-styles-and-themes)).

### 3.3. Notable Files in `components`

- `Header.js`: Structurally separates the main content from the header.
- `Assistant.js`: Acts as the navigator between `LogInView.js`, `UserProfileView.js`, and `SearchResultView.js`.
- `Footer.js`: Holds the footer-related components, distinct from the main content.

### 3.4. Additional Notes

- **Utils Folder Breakdown**: This folder houses utility components and files crucial to our app's versatility. Some key components are:
  - `Clock.js`: Displays elapsed time during loading states.
  - `GPTAPISearch.js`: Facilitates profile creation using the GPT-3.5-turbo-16k API.
  - `Languages.js`: Handles the representation of languages, similar to `Countries.js`.
  - `LoadingView.js`: Represents transitional states during loading.
  - `ToolTip.js`: A reusable component for providing user tooltips.

- **Transition Between Views**: The transition and navigation between different views like login, profile creation, and search results are facilitated mainly by the `Assistant.js` file.

# 4. Components

### 4.1. login

#### 4.1.1. logInView.js

The `logInView.js` component is the main part of the user onboarding experience, responsible for logging in the users and transitioning them through the initial stages of the application. Here's a breakdown of its core functionality and features:

- **State Management**: The component leverages the `useState` hook from React to manage:
  - `username`: A simple state to hold the username input by the user.
  - `viewStage`: A state that toggles the view between 'login', 'useCase', and 'profile'.

- **Login Flow**:
  - **Input**: The user is presented with an input field to enter their username.
  - **Validation**: If the username is left empty or contains only spaces, an alert is triggered to remind the user to input a valid username.
  - **Login Logic**: Post-validation, the application proceeds with the given login logic. For instance, after successful authentication, the `viewStage` switches to 'useCase' to allow the user to select their use case.

- **Use Case Selection**:
  - Once the user logs in, they are presented with different use case options. 
  - These use case options can be easily extended or modified as needed.
  - Upon selecting a use case, the `setView` function is triggered to transition the user to the 'profile' view.

- **Styling & Responsiveness**: The component employs utility-first CSS classes (presumably from Tailwind CSS) for its design. It's crafted to provide a responsive and user-friendly experience with appropriate hover effects, shadows, and design coherence.

This component is a clear demonstration of modular and stateful design in React, ensuring a seamless and intuitive user journey from logging in to navigating through initial options.

### 4.2. profile

#### 4.2.1. UserProfileView.js

**Overview**

The `UserProfileView` component is the primary interface of our platform. It's a crucial bridge where users who have successfully logged in begin to interact with the main functionalities. This component is responsible for fetching, presenting, and manipulating company sub-profiles.

**Flow**

1. A user is redirected to `UserProfileView` from the `loginView`.
2. The component fetches and displays the company's sub-profiles.
3. The user provides information about their company. This information can be in the form of links or documents.
4. Based on the given data, relevant search parameters are created.
5. The user is required to verify the data.
6. The verified sub-profile is updated in the database and passed down to the search component.

**Component Structure**

`UserProfileView` uses the following imports:

- React's useState and useEffect.
- Utility and component modules such as `GPTAPISearch`, `ToolTip`, `DropdownCheckbox`, and others.
- Axios for making HTTP requests.
- React Icons (`FaDownload` and `ImMenu`).
- JSZip and XLSX for file operations.
- A utility for countries list named `Countries`.

**Main Functionalities**

1. **Fetching the SuperProfile:** The component attempts to retrieve a super profile based on the `cname` prop.
2. **Local Storage Interactions:** The component stores specific data in the local storage.
3. **Profile Updating:** Users can save modifications to a sub-profile, which sends an update request to the server.
4. **File Handling:** The component can handle files with extensions such as `.xlsx`, `.docx`, and `.txt`.
5. **Data Scraping:** The component can scrape data and update the sub-profile based on it.
6. **XML Parsing:** XML data can be parsed into a usable format for the profile.
7. **Validating CPV Codes:** There's functionality for validating CPV codes with the server.
8. **Managing Read-only Fields:** Users have the flexibility to set specific fields as read-only.
9. **Sidebar and UI Management:** Users can toggle a sidebar, select files, and show/hide additional fields.
10. **Handling Awards:** There is a state variable, `useAwardNotices`, that seems to dictate if award notices should be considered.

**Notes**

- The initial structure of a profile is specified in the `initialProfile` constant.
- Various state variables (`useState`) manage the component's state, such as `subProfile`, `fileContents`, and `readOnlyFields`.
- Multiple `useEffect` hooks are used to control side effects in the component, such as data fetching and local storage operations.

#### 4.2.2. checkbox.js

**Overview**

The `DropdownCheckbox` component is utilized to create a multi-choice checkbox menu for languages. It facilitates user selection from a list, with chosen values being displayed within the dropdown box.

**Prop Details**

- **countriesList**: An object where each key is the name of a country and its corresponding value is the ISO code for that country.
  - *Example*: `{ Finland: 'FI', ... }`
  
- **options**: An array of country names that will be displayed as options.
  - *Example*: `['Finland', 'Sweden', ... ]`
  
- **value**: An array of currently selected ISO codes. 
  - *Example*: `['FI', 'SE']`
  
- **onChange**: A callback function that updates the `value` prop based on user selection.

**Expected Data Structure for countriesList**

The `countriesList` prop expects a specific data structure:
- **Key**: The actual country name, e.g., `"Finland"`.
- **Value**: The ISO code for the country, e.g., `"FI"`.

**Component Behavior**

1. The dropdown displays the selected ISO codes. If no codes are selected, it displays `"Select..."`.
2. On clicking the dropdown, a list of country names is displayed with a checkbox next to each name.
3. Selecting a country will either add its ISO code to the `value` array (if it wasn't selected) or remove it (if it was previously selected).
4. The updated `value` array is then passed to the `onChange` callback to allow parent components to handle the change.

**Example Usage**

```jsx
<DropdownCheckbox 
  countriesList={{ Finland: 'FI', Sweden: 'SE' }} 
  options={['Finland', 'Sweden']} 
  value={['FI']} 
  onChange={updatedValue => console.log(updatedValue)} 
/>
```

### 4.3. search

#### 4.3.1. Chart.js

#### Overview
The `Chart` component is a subcomponent of `SearchResultView`. It's primarily responsible for displaying graph data passed through props. The colors for the graph are determined from a separate component, depending on the information contained within `graphData`.

#### Prop Details

- **graphData**: An array of data points where each data point represents a tender. Each data point should have at least a `date` and a `suitabilityScore`.
- **isSelected**: A flag used for reactivity, especially during window resizing.

#### Key Features

1. **Responsive Sizing**: The width of the chart adjusts dynamically based on the size of its container, ensuring optimal viewing across different devices.
2. **Custom Tooltip**: Provides additional information about data points when hovered upon.
3. **Color Mapping**: Uses the `getSuitabilityColor` function from `SuitabilityColors` to determine the color of each bar based on its `suitabilityScore`.
4. **Data Visualization**: Utilizes components from `recharts` like `BarChart`, `Bar`, `XAxis`, and others to render a visual representation of the `graphData`.

#### Usage

```jsx
<Chart 
  graphData={[
    { date: '2023-08-15', suitabilityScore: 85, ... },
    ...
  ]}
  isSelected={true}
/>
```

#### 4.3.2 SearchResultView.js

The `SearchResultView.js` component displays the search results after a user performs a search for tenders.

#### Overview

- A loading view is displayed while fetching the tenders.
- Once the data is fetched, a message is displayed to indicate if the search was successful or if there were no matches.
- If there are matches, users can navigate between the results using the "Previous" and "Next" buttons.
- Tips for improving search results are displayed if no results are found.
- Tenders for the current day and other top matching tenders are listed.
- Clicking on a tender displays detailed information about the selected tender.

#### UI Elements

1. **Loading View**: Displays a loading animation when fetching data.
2. **Search Complete Message**: Notifies the user of successful search results.
3. **Navigation Buttons**: Allow the user to move between search results.
4. **Tips Table**: Displays suggestions for obtaining better search results.
5. **Tender List**: Lists the tenders based on their publish date and match suitability.
6. **Tender Details View**: Displays comprehensive details about a selected tender.

#### Functions

- **RenderTextWithLineBreaks**: Renders text with breaks.
- **RenderCPVCodes**: Displays the main and supplementary CPV codes.
- **FormatDeadline**: Formats the deadline string into a readable date format.
- **reverseMapping**: Converts values to their corresponding keys in an object.

#### External Dependencies

1. **ToolTip**: A component to provide tooltips for various elements.
2. **Chart**: A component to display graphical data.

#### Export

The component is exported as `SearchResultView` for use in other parts of the application.

#### 4.3.3. SuitabilityColors.js

#### Overview
The `SuitabilityColors` component is responsible for determining the appropriate color based on a given `suitabilityScore`. It returns either Tailwind CSS classes or HEX color codes depending on the settings provided.

#### Function: `getSuitabilityColor`

- **Purpose**:
  Returns the appropriate color (either as Tailwind CSS class or HEX color code) based on the provided suitability score.

- **Parameters**:
  - `suitabilityScore`: A number representing the suitability score for which an appropriate color needs to be determined.
  - `isTailwindClasses` (optional, default = `false`): A boolean that specifies whether the returned value should be a Tailwind CSS class.
  - `isBackground` (optional, default = `false`): A boolean that determines whether the returned color should be for background or text.

- **Returns**:
  A string representing the determined color (Tailwind CSS class or HEX color code).

#### Color Mapping:

| Suitability Score | Tailwind Class (Background) | Tailwind Class (Text) | HEX Color Code |
|-------------------|-----------------------------|-----------------------|----------------|
| >= 95             | bg-green-500                | text-green-500        | #10B981       |
| >= 87             | bg-green-400                | text-green-400        | #22C55E       |
| >= 85             | bg-yellow-400               | text-yellow-400       | #FBBF24       |
| >= 80             | bg-yellow-500               | text-yellow-500       | #F59E0B       |
| >= 70             | bg-orange-400               | text-orange-400       | #FB923C       |
| >= 60             | bg-orange-500               | text-orange-500       | #F97316       |
| < 60              | bg-red-900                  | text-red-900          | #991B1B       |

#### Note:
If none of the conditions are met, the default color is `bg-red-900` or `text-red-900` for Tailwind classes and `#991B1B` for HEX code.


### 4.4. Sidebar

#### 4.4.1. Sidebar.js

#### Overview

The `Sidebar` component facilitates navigation between profile's subprofiles. These subprofiles are showcased as a list, and the component provides mechanisms to create and delete these subprofiles.

#### Dependencies

- React: Utilized for component structure and state management.
- `@headlessui/react`: Offers UI primitives for building Tailwind CSS interfaces.
- `@heroicons/react/24/outline`: Provides icons for enhancing UI.
- `axios`: For HTTP requests.
- `react-icons/fa`: Icon library.

#### Props

- **open**: A boolean that controls the visibility of the sidebar.
- **setOpen**: A function that toggles the `open` state.
- **subProfiles**: An array that contains the list of subprofiles.
- **setSubProfile**: A function to set the active subprofile.
- **profileID**: An identifier for the main profile.

#### State

- **Profiles**: A list containing subprofiles. If something goes awry, a default value with a warning message is shown.
- **newTeamName**: State to handle the name input of a new team or subprofile.

#### Methods

#### useEffect

On component mount or when the `subProfiles` prop changes, the subprofiles data is updated to the `Profiles` state.

#### addNewTeam

This function makes an API call to create a new subprofile and then updates the `Profiles` state with the new subprofile.

#### deleteTeam

Accepting a team's ID as an argument, this function sends an API delete request for the specified team and updates the `Profiles` state by removing the deleted subprofile.

#### UI Structure

The sidebar comprises of:

1. **Close Button**: Allows users to close the sidebar.
2. **Subprofile List**: Displays all subprofiles. Clicking on a subprofile makes it the active subprofile and closes the sidebar. There's also a delete icon next to each subprofile for deletion.
3. **Input Field**: Allows users to type in a new team's name.
4. **Add New Team Button**: When clicked, adds a new team based on the name given in the input field.

#### Styling

The component is styled using Tailwind CSS classes. It uses transitions for smooth animation effects when opening or closing.

#### Important Note

This component expects that the parent component or context provider supplies the necessary props. Ensure that the required props are passed down correctly for the component to function as expected.

### 4.5. Utils

#### 4.5.1. CPVChecker.js

#### Overview

The `CPVChecker` component is a utility that assists users in verifying unknown CPV codes. Users provide an input, which undergoes validation. Once validated, a request is made to the database to retrieve a description corresponding to the given CPV code. Additionally, this component can also be employed to validate LLM-generated CPV codes in the `userProfileView` component.

#### Dependencies

- **React**: Facilitates component structure and state management.
- **axios**: Enables HTTP requests.

#### State Variables

- **cpvCode**: Maintains the CPV code inputted by the user.
- **description**: Stores the description fetched from the database corresponding to the CPV code.

#### Methods

#### fetchData

This asynchronous function validates the given CPV code to ensure it's exactly 8 digits. If the input is valid, it sends a request to the server to retrieve the description corresponding to the provided CPV code. If the input is invalid, an alert message informs the user about the format requirement.

#### UI Structure

The `CPVChecker` component consists of:

1. **Input Field**: Accepts CPV codes. The user can type in a CPV code, and the length is restricted to 8 characters.
2. **Check CPV Button**: Initiates the `fetchData` function when clicked.
3. **Description TextArea**: Displays the description fetched from the database corresponding to the provided CPV code.

#### Styling

The component employs Tailwind CSS classes for styling. It presents a rounded card-like interface, with a primary background color for visibility. Input and text area elements have borders and padding for improved user experience. The 'Check CPV' button showcases a hover effect for enhanced interactivity.

#### Important Note

This component's functionality hinges on the accuracy of the CPV codes and the reliability of the external database it queries. Ensure the database endpoint `/cpv/:cpvCode` is appropriately set up and operational.


#### 4.5.2. Clock.js

#### Overview

The `Clock` component provides an interface to track the elapsed time, predominantly employed within the `loadingView` component to display the duration spent in a loading state.

#### Dependencies

- **React**: Utilized for the component's structure, state management, and lifecycle methods.

#### State Variables

- **startTime**: Retains the initial time when the `Clock` component is rendered, captured in milliseconds since the Unix epoch.
- **time**: Keeps the elapsed time in milliseconds since the component's render.

#### Lifecycle Effects

A timer is initialized via `setInterval` once the component mounts, updating the `time` state every second to reflect the elapsed duration since `startTime`. This timer is cleaned up and cleared out when the component is unmounted to prevent memory leaks.

#### Methods

##### formatTime(milliseconds)

This function takes in the elapsed time in milliseconds and converts it into a readable `HH:MM:SS` format. It computes hours, minutes, and seconds separately and returns the concatenated string.

#### UI Structure

The `Clock` component is designed to be simple and informative:

1. **Clock Container**: A styled container that encapsulates the clock.
2. **Time Display**: Displays the elapsed time in `HH:MM:SS` format.

#### Styling

The component uses a combination of CSS classes for styling. It presents the time in a larger font size (`text-2xl`) with a bold weight (`font-bold`) and white text color (`text-white`) to ensure visibility and clarity.

#### Use Case

The primary use case for this component is within the `loadingView` to give users an indication of how long they've been in a loading state. It can be beneficial in scenarios where long loading times are expected, allowing users to be aware of the duration.

#### Important Note

Always ensure that the `Clock` component is unmounted appropriately, especially when its parent component is removed from the DOM. This practice will ensure that the interval set within the `Clock` component is cleared, preventing potential memory leaks.

#### 4.5.3. Countries.js

#### Overview

The `countriesList` module contains a definitive list of countries found in the database. It plays an essential role in ensuring consistent and accurate references to countries throughout the application.

#### Purpose

This list of countries needs regular updating, especially if new countries are added to the database. Proper maintenance ensures the application's reliability when referencing countries.

#### Dependencies

There are no direct dependencies for this module.

#### Usage

The `countriesList` is referenced in multiple components throughout the application:

- **checkBoxComponent**: This component utilizes the list to provide checkbox options for countries.
  
- **selectedTender Subcomponent**: Within the `searchResultView` component, the `selectedTender` subcomponent employs this list to display or process country-specific data.

#### Structure

The `countriesList` is an object where:

- **Key**: Represents the full name of the country.
  
- **Value**: Represents the ISO Alpha-2 country code.

For example:

- "Belgium": "BE"

#### Countries Included

The following countries are available in the current version of the `countriesList`:

- Belgium, Norway, Malta, North Macedonia, Bulgaria, Croatia, Czech Republic, Denmark, Netherlands, United Kingdom, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, and Sweden.

#### Update Note

Consistent updates are crucial. When adding or updating countries in the database, ensure that this list is updated to reflect those changes. This synchronization guarantees accurate referencing and reduces potential errors or discrepancies in the application.

#### 4.5.4. GPTAPISearch.js

#### Overview

The `GPTAPISearch` component is designed to provide an enhanced user experience during the profile creation process by aggregating and processing relevant company information. It integrates with the LLM system to process the gathered data and returns the results to the `userProfileView` component, which subsequently updates the user's subprofile.

#### Purpose

The primary aim of this component is to assist users in their profile creation process. By consolidating significant company information—such as strategy documents, financial statements, and past work experiences—it simplifies and accelerates user data input and enhances data consistency and accuracy.

#### Dependencies

- **axios**: Utilized for making API requests.
- **LoadingView Component**: Displayed to the user during the loading state to enhance user experience.

#### Props

- **onResult**: A callback function that processes and returns the search results from the LLM system.
- **strategyContent**: Content from the company's strategy document.
- **financialDocumentsContent**: Content from the company's financial statements.
- **pastWorks**: Descriptions or content that references the company's past projects or experiences.

#### Main Functions

##### `scrollToDiv`

Allows for smooth scrolling to the designated 'targetSearch' div.

##### `onSubmit`

This asynchronous function is triggered upon form submission. Its primary responsibilities include:

- Validating the input data.
- Constructing the search prompt from `strategyContent`, `financialDocumentsContent`, and `pastWorks`.
- Making an API request to the "/api/generate" endpoint with the combined prompt to fetch potential search parameters.
- Handling possible errors during the process.
- Returning the results by invoking the `onResult` function.

#### Component Structure

When invoked, this component initially checks the `loading` state. If the component is in a loading state, the `LoadingView` component is displayed to the user, indicating that processing is ongoing.

Subsequently, a form is presented to the user with a "Fill search parameters" button. Once clicked, the `onSubmit` function is triggered, prompting the API request and subsequent operations.

#### Styling

The styling of this component is achieved primarily using utility classes provided by the application's CSS framework, ensuring consistency and adherence to the overall design system.

#### Note on Implementation

To ensure optimal performance and user experience, it's essential to regularly maintain and update this component, especially when there are significant changes in the related APIs or the data structure of the company's information.

#### 4.5.5. GPTSIMWords.js

#### Overview

The `GPTSIMWords` component is meticulously designed to enhance the user's profile-building process by suggesting similar keywords that are relevant to their profile. By integrating with the LLM system, it extends the initial list of user-specified keywords and subsequently returns the enriched list to the `userProfileView`.

#### Purpose

- **Keyword Expansion**: The core functionality of this component is to assist users in enhancing their profile through keyword expansion. It uses the initial keyword list provided by the user to generate a more comprehensive list of similar words.
  
- **User Experience Enhancement**: Through its seamless integration with the LLM system and intuitive UI, the component provides a straightforward method for users to refine their profiles with relevant keywords.

#### Dependencies

- **axios**: Deployed for executing API requests.
- **LoadingView Component**: Exhibited to the user during the loading state, ensuring an optimal user experience.

#### Props

- **onResult**: A callback function designed to handle and return the enriched list of keywords from the LLM system.
- **wordslist**: A list of initial keywords specified by the user.
- **fieldname**: A descriptor for the specific field in which the keywords will be used.

#### Core Functions

##### `parseXML`

A utility function that extracts the list of similar keywords from the XML response received from the LLM system. The function identifies the `<similar>` XML tags, retrieves the enclosed keyword list, and returns it in a structured format.

##### `onSubmit`

An asynchronous function activated upon form submission, with the following key responsibilities:

- Validate the input (ensuring the `wordslist` is not empty).
- Construct the search prompt from the `wordslist`.
- Initiate an API request to the "/api/similar" endpoint using the assembled prompt.
- Parse the XML response to extract the list of similar words.
- Invoke the `onResult` function with the parsed result and the `fieldname`.

#### Component Structure

On initialization, the component inspects the `loading` state. If active, the `LoadingView` component becomes visible, signaling ongoing processing to the user.

Following this, a form is showcased that features a "Fill With Similar Words" button. When pressed, the `onSubmit` function is triggered, initiating the API request and subsequent procedures.

#### Styling

Utilizing the application's CSS framework, the component employs utility classes to achieve its styling, guaranteeing visual consistency and alignment with the overall design principles.

#### Recommendations for Maintenance

Ensuring the efficient operation of this component requires periodic maintenance, especially when changes arise in the API or the XML structure of the response. Regular updates will guarantee that the component continues to provide accurate keyword suggestions and remains consistent with evolving backend systems.

#### 4.5.6. LanguagesList.js

#### Overview

The `languagesList` is a well-curated constant export that enumerates various languages along with their associated country codes, according to the ISO 3166-1 alpha-2 standard. The primary utility of this list is to support language references, specifically within the `selectedTender` subcomponent of the `searchResultView`.

#### Purpose

- **Reference**: The list is a direct point of reference for languages to country mapping in the application, particularly when tender information requires language details.
  
- **Data Integrity**: By maintaining an exhaustive and accurate list, the application ensures data consistency and accuracy for functionalities that rely on language references.

#### Contents

Here are the listed languages and their corresponding country codes:

- **Dutch (Belgium)**: Dutch is one of Belgium's official languages.
- **Norwegian (Norway)**
- **Maltese (Malta)**
- **Macedonian (North Macedonia)**
- **Bulgarian (Bulgaria)**
- **Croatian (Croatia)**
- **Czech (Czech Republic)**
- **Danish (Denmark)**
- **Dutch (Netherlands)**: Distinct mention from Belgium due to regional dialect differences.
- **English (United Kingdom)**
- **Estonian (Estonia)**
- **Finnish (Finland)**
- **French (France)**
- **German (Germany)**
- **Greek (Greece)**
- **Hungarian (Hungary)**
- **Irish (Ireland)**: Irish is recognized as the national and first official language of Ireland.
- **Italian (Italy)**
- **Latvian (Latvia)**
- **Lithuanian (Lithuania)**
- **Polish (Poland)**
- **Portuguese (Portugal)**
- **Romanian (Romania)**
- **Slovak (Slovakia)**
- **Slovenian (Slovenia)**
- **Spanish (Spain)**
- **Swedish (Sweden)**
- **English (International)**: A generic entry for English without a specific regional context.

#### Maintenance Notes

For optimal utility and accuracy:

1. **Updates**: As the comment suggests, it's vital to update the list should new languages appear in the database. Ensuring the list remains comprehensive guarantees system accuracy.
2. **Duplication**: Avoid duplications. For instance, "Dutch" is listed twice for both Belgium and the Netherlands. Ensure that such entries serve distinct purposes and are commented appropriately to avoid confusion.

The `languagesList` is instrumental for the smooth functioning of modules that require language-to-country mapping, ensuring that these modules access standardized and accurate data.


#### 4.5.7. LoadingView.js

#### Overview

The `LoadingView` is a React functional component designed to indicate ongoing processes that might take some time to complete. It displays a loading indicator with an animated series of dots and a clock, ensuring that the user is informed about the current system activity.

#### Purpose

- **Indicative Nature**: Instead of representing every http request, this component's presence signifies primary system activities, typically those with extended durations, such as fetching substantial data or generating complex outputs.

- **User Experience (UX)**: By providing feedback during longer operations, the `LoadingView` component ensures that the user is aware that the system is actively working on their request. This minimizes potential confusion or impatience.

#### Contents

The component consists of:

- **Background Overlay**: A dark overlay (`bg-black opacity-50`) is spread over the entire viewport (`inset-0`) to dim the content beneath the loading message.

- **Loading Indicator**: A combination of the `Clock` component, the word "Loading", and three animated dots that ping in sequence. This trio provides a dynamic visual indication of the loading process.

- **CSS Styles and Classes**: The component utilizes several Tailwind CSS classes to style and position its elements. For instance, the `.fixed`, `.inset-0`, and `.flex` classes are used to position the loading indicator at the center of the viewport.

#### Usage

When you intend to signify that a significant process is ongoing, and you want to prevent the user from interacting with the rest of the interface while also keeping them informed, render the `LoadingView` component.

#### Dependencies

1. **Clock Component**: The `LoadingView` component imports and uses the `Clock` component. Ensure that any modifications or changes to `Clock.js` are compatible with `LoadingView`'s usage of it.

2. **Styling**: The visual representation of the component relies heavily on Tailwind CSS. Any changes to the project's Tailwind configuration or version might affect the component's appearance.

#### Maintenance Notes

For optimal usage and customization:

1. **Customization**: Depending on the application's theme or branding, you might want to adjust the color, size, or style of the loading indicator.

2. **Reusability**: Given its general-purpose nature, consider reusing this component across different parts of the application where significant loading times are expected.

The `LoadingView` component plays a vital role in improving user experience by providing real-time feedback during extended operations.

#### 4.5.8. ToolTip.js


#### Overview

The `ToolTip` is a React functional component designed to provide contextual information to users when they need it. It is a clickable element, often represented as a question mark, that when clicked, reveals a more detailed info box containing the relevant information.

#### Purpose

- **User Guidance**: The primary purpose of the `ToolTip` is to offer on-demand clarifications, explanations, or guidance without overwhelming the interface.
  
- **Dynamic Positioning**: The tooltip dynamically positions itself based on the viewport to ensure its content is always visible and doesn't get cut off.

#### Contents

The component consists of:

- **Trigger**: A small box, typically with a question mark (`?`), that the user can click to toggle the display of the tooltip content.
  
- **Tooltip Content**: Upon click, a bigger info box reveals the content. If the `tooltipText` prop has the value 'cpv', the `CPVChecker` component is displayed instead.

#### Usage

1. **tooltipText Prop**: It specifies the content to be displayed inside the tooltip. If its value is 'cpv', the `CPVChecker` component is rendered. Otherwise, the text value of `tooltipText` is shown.

2. **Visibility Control**: The `showTooltip` state controls whether the tooltip content is visible. Clicking on the trigger toggles this state.

3. **Dynamic Positioning**: The component calculates its position on the viewport and adjusts its position to ensure that it doesn't get cut off, especially during window resizes.

#### Dependencies

1. **CPVChecker Component**: The `ToolTip` component optionally utilizes the `CPVChecker` component when the `tooltipText` prop is set to 'cpv'. Any changes or modifications to the `CPVChecker` component should be compatible with its usage here.

2. **Styling**: The component uses Tailwind CSS for styling. Any updates to the project's Tailwind configuration or its version might influence the component's appearance.

#### Maintenance Notes

For optimal usage and customization:

1. **Expansion**: The current implementation checks if the `tooltipText` is 'cpv' to decide on displaying the `CPVChecker` component. If more such special cases are needed in the future, consider refactoring to a more scalable approach.
  
2. **Accessibility**: Ensure that the tooltip is accessible to all users, including those using screen readers or keyboard navigation.

3. **Reusability**: The `ToolTip` component is generic by nature. Reuse it across the application wherever there's a need to provide additional information without cluttering the interface.

The `ToolTip` component enhances user experience by offering contextual help and ensuring users understand the interface's various elements.

#### 4.5.9. ScrapeHeaders.js

#### Overview

The `ScrapeHeaders` component is designed to fetch header information of a company based on a provided URL link. It ensures that the given URL is HTTPS validated before passing it to the fetching engine. After the fetching process, the results are relayed back to the `userProfileView` for further processing.

#### Key Features

- **URL Validation**: Only accepts HTTPS URLs ensuring secure connections.
  
- **Fetching Engine Integration**: Directly communicates with a backend endpoint for scraping headers.
  
- **Error Handling**: Adequately handles any errors or exceptions during the fetching process, ensuring a smooth user experience.

#### Workflow

1. **URL Input**: The user provides a URL in the input box.
  
2. **Validation**: Before proceeding, the component checks if the URL starts with "https:" to ensure it's a secure link.

3. **Fetching**: Upon clicking the "Fetch" button, the component communicates with the backend endpoint `profile/api/scrape/` to get the headers.

4. **Displaying Result**: The fetched headers are displayed in a textarea for the user to view.

#### Components & Dependencies

- **LoadingView**: Utilized to display a loading state while the component is fetching data, enhancing UX during wait times.

- **axios**: Used for making HTTP requests to the backend. 

#### Usage

To use the `ScrapeHeaders` component:

1. **onFetched Prop**: Pass a function that will be called once the headers are fetched. This function receives the headers as its argument.

2. **User Input**: The user should provide an HTTPS URL in the input box.

3. **Fetching Headers**: Click on the "Fetch" button after providing the URL. If the URL is valid, the headers will be fetched and displayed.

#### Maintenance & Enhancement Notes

1. **Security**: Since this component directly interacts with external URLs, always ensure that the backend is well-protected against potential security threats like cross-site scripting or SQL injection.

2. **Performance**: As the component fetches data in real-time, ensure backend scraping is optimized to reduce wait times for the user.

3. **Error Messages**: Consider enhancing user feedback by providing more descriptive error messages or prompts based on different scenarios.

4. **Scalability**: If there's a need to fetch more than just headers in the future, consider extending the component's functionality or creating specialized sub-components.

5. **Styling & UI**: Uses Tailwind CSS for styling. Monitor any changes or updates to the project's Tailwind configuration or its version to maintain the component's appearance.

`ScrapeHeaders` simplifies the process of fetching headers from URLs, providing a seamless and intuitive interface for users to extract company information.

### 4.6. Other components inside the `components` foder

#### 4.6.1. Assistant.js

#### Overview

The `Assistant` component serves as the main navigation hub of the platform. It is responsible for managing and transitioning between various views, namely `LogInView`, `UserProfileView`, and `SearchResultView`, depending on the user's state and requirements.

#### Key Features

- **Dynamic View Rendering**: The component manages which view should be displayed based on user interactions and system states.
  
- **State Management**: Manages various states, including the user's view, selected company name, profile, and use-case.
  
- **Seamless Navigation**: Ensures smooth transitions between login, user profile, and search results.

#### Workflow

1. **Initialization**: On initial load, the `LogInView` is rendered, prompting the user to login.

2. **Login**: After successful login, the user can either navigate to `UserProfileView` or `TenderIdeaView` based on the chosen use case.

3. **Profile View**: In `UserProfileView`, the user can view and manage their profile. They can also transition to `SearchResultView` to initiate searches.

4. **Search View**: Depending on the use-case, either `SearchResultView` or `IdeaSearchResultView` will be shown. In these views, the user can search for various data and view the results.

#### Components & Dependencies

- **LogInView**: Where users can login to the platform.
  
- **UserProfileView**: Displays the user's profile and related functionalities.

- **SearchResultView**: Showcases the results of a user's search.

- **TenderIdeaView**: Provides functionality related to tender ideas.

- **IdeaSearchResultView**: Displays the search results for specific ideas.

#### Usage

To utilize the `Assistant` component:

1. **Render**: Import and render `Assistant` in the root or desired location of the application.

2. **Interaction**: Users can interact with various components and transition between them seamlessly.

3. **State Management**: The component internally uses React's `useState` to handle different states, like the current view or selected company.

#### Maintenance & Enhancement Notes

1. **Expandability**: If more views or features are added to the platform, consider updating the `Assistant` component to handle the new transitions.

2. **Performance**: Monitor the component for any potential performance bottlenecks, especially if the number of views or functionalities increases.

3. **Styling & UI**: Uses Tailwind CSS for styling. Keep track of changes or updates to the project's Tailwind configuration or its version.

4. **State Management**: Consider using more advanced state management solutions like Redux or Context API if the state becomes more complex or needs to be shared among numerous components.

`Assistant` is the core of the platform, managing different views and ensuring a smooth user experience.


#### 4.6.2. Footer.js

#### Overview

The `Footer` component serves as a standalone component displayed at the bottom of the platform. It houses necessary information, links, and utilities that might be of use to the platform's users. Designed with clarity and ease of access in mind, this component provides users with crucial company details, quick links, and contact information.

#### Key Features

- **Segmented Information Display**: The footer is divided into three sections, each displaying a distinct set of information.
  
- **Dynamic CPV Checker Utility**: Features the `CPVChecker` utility, enabling users to check CPV codes directly from the footer.

- **Stylized Appearance**: Designed with aesthetics in mind, utilizing Tailwind CSS for its visual presentation.

#### Content

1. **Company Details**: This section displays the company's name and copyright notice, indicating the ownership and rights related to the platform.

2. **Quick Links**: Provides users with immediate access to external links of importance. The sample includes a feedback link.

3. **Contact Details**: Here, users can find different ways to get in touch with the company, including email addresses, phone numbers, and a physical address.

#### Components & Dependencies

- **CPVChecker**: A utility component that enables users to validate CPV codes. Positioned at the footer's bottom for easy accessibility.

#### Usage

To utilize the `Footer` component:

1. **Rendering**: Import the component and include it in the desired part of the platform, typically at the end of the page layout.

2. **Customization**: Modify the hardcoded values in the component to match the platform's actual details.

#### Maintenance & Enhancement Notes

1. **Content Update**: Always ensure the content, especially contact details and links, are up to date.

2. **Styling & UI**: Monitor UI consistency. If the platform's design changes, ensure the `Footer` component's styles align with the new design for cohesion.

3. **Utility Access**: Consider adding or removing utilities like `CPVChecker` based on user feedback or changing platform requirements.

4. **Responsiveness**: Ensure that the footer remains accessible and visually appealing on all device sizes, especially if new content or features are added.

The `Footer` component effectively ties together the platform's layout, providing users with quick access to essential details and tools.

#### 4.6.3. Header.js

#### Overview

The `Header` component serves as a visual guide for platform users. It is a standalone component that predominantly displays the platform's logo, ensuring that the user's focus remains within the platform and doesn't get diverted to external components like the browser's search bar.

#### Key Features

- **Dynamic Appearance**: The header starts with displaying the full name "Artificial Intelligence Procurement Assistant", which then gradually fades out to reveal the platform's logo.
  
- **Attention Retention**: Designed to shift users' attention to the center of the platform, this header ensures users remain engaged and don't lose their way.

- **Responsive Design**: Created with flexibility in mind, ensuring it looks good across various devices and screen sizes.

#### Content

1. **Full Name Display**: Initially, the header prominently displays the full name "Artificial Intelligence Procurement Assistant".
   
2. **Dynamic Logo Reveal**: Post the fade-out of the text, the platform logo dynamically appears, ensuring users recognize and associate with the brand.

#### Components & Dependencies

- **Logo**: The logo image, sourced from `appaipalogo.png`, is a visual representation of the platform.

#### Usage

To integrate and use the `Header` component:

1. **Rendering**: Import the component and place it at the desired location, typically at the beginning of the page layout.
   
2. **Customization**: To use a different logo, replace the `appaipalogo.png` in the specified path and adjust the logo dimensions as needed.

#### Maintenance & Enhancement Notes

1. **Content Update**: While the primary content is static, ensure the logo remains up-to-date with any brand updates.

2. **Styling & UI**: Should there be changes to the overall platform design, it's crucial to revisit the `Header` component to ensure it remains consistent with the platform's visual language.

3. **Animation Timing**: The fade-in and fade-out timings can be adjusted based on user feedback or design requirements. Test various speeds to see what feels most natural to users.

4. **Responsiveness**: Keep a check on the header's appearance across various devices to ensure it remains visually appealing and functional.

The `Header` component, though simple, plays a vital role in retaining the user's attention, ensuring they focus on what's essential within the platform and providing them with a familiar brand presence through the logo.

---

# 5. Services/APIs

#### Overview

This section provides a comprehensive breakdown of the services or API calls used throughout the platform.

#### Methods

- **Profile**:
    - `POST` & `GET`: These methods are implemented within `UserProfileView.js`. 
   
- **SubProfile**:
    - `POST` & `DELETE`: Found in `sidebar.js`.
    - `GET`: This method doesn't have a standalone call; instead, when the Profile is fetched, the response is automatically populated with the subprofiles.
    - `PUT`: The update for SubProfile is executed in `UserProfileView.js` upon the press of the ready button.


# 6. Styles and Themes

### Overview

The platform utilizes TailwindCSS, a utility-first CSS framework, for styling and theme management.

### How Styling is Handled

- The primary styling method for the platform is through **TailwindCSS** utility classes.
- Instead of writing custom CSS or SCSS, TailwindCSS provides utility classes which can be added directly to the HTML or JSX elements. 
- The `tailwind.config.js` file offers a centralized configuration to define and extend default styles, colors, and themes.

### Theme Management

- The theme can be extended and customized within the `theme` key of the `tailwind.config.js` file.
- The extended theme allows for defining custom colors, heights, and animations beyond the defaults provided by TailwindCSS.

### Key Variables

- **Colors**:
  - **Primary**:
    - 100: #ebf5fa
    - 200: #d1e8f2
    - 300: #a6d3e9
    - 400: #7abde0
    - 500 (Primary Color): #3498db
    - 600: #2983c2
    - 700: #206e99
    - 800: #185870
    - 900: #104247
  - **Go**: #98db34
  - **Stop**: #db3445
  
- **Heights**:
  - Screen-78: 78vh
  
- **Min Heights**:
  - 45vh: 45vh
  
- **Animations**:
  - Spin: 1s linear infinite
  
Custom plugins can also be added to the platform through the `plugins` key, though none are currently specified.


# 7. Testing

*Tests are for now just render tests. If interested in contributing contact creators.*

# 8. Client-Side Deployment Guide

This guide offers a brief overview of deploying the client side of the application. For a detailed deployment guide, especially concerning backend configurations, please refer to the `backend.md` file.

#### Pre-requisites:
- **Node.js and npm**: These are required to compile and run the client application. Ensure you have both installed on your system.

#### Building the Client:

1. Navigate to the client directory:
```bash
cd path/to/client-directory
```
2. Install the required packages:
```
npm install
```
3. Build the React application for production:
```
npm run build
```
4. Running local deployment: 
```
npm start
```

Now your client side should be running in `localhost:3000`. 

> Note: This mode restricts the application's capabilities as it lacks backend integration.

For advanced deployment configurations and steps, including backend considerations, please refer to the comprehensive guide in the backend.md file.

