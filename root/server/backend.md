# Comprehensive Backend Documentation

This documentation provides an in-depth overview of the backend, detailing its configurations, integrations, models, routes, and functionalities.
NOTE TO READER: This documentation is outdated in some parts, but the core functionalities have remained the same. The out of date parts are moslty related to the docker setup and API route configuration. Also the change to typescript is not documented here.

## Table of Contents

## Table of Contents

- [Application Overview](#application-overview)
- [Configurations](#configurations)
  - [Database (MongoDB)](#database-mongodb)
  - [ElasticSearch](#elasticsearch)
- [Controllers](#controllers)
  - [GPT API Controller (GPTAPI)](#gpt-api-controller-gptapi)
  - [GPT Assessment Controller (GPTASS)](#gpt-assessment-controller-gptass)
  - [OpenAI Similar Words Controller (GPTSIM)](#openai-similar-words-controller-gptsim)
  - [OpenAI Keyword Translation Controller (GPTTRN)](#openai-keyword-translation-controller-gpttrn)
  - [Profile Controller](#profile-controller)
  - [Tender Controller](#tender-controller)
- [Models](#models)
  - [CPVCode Model](#cpvcode-model)
  - [ProcurementCall Model](#procurementcall-model)
  - [ProcurementCallJson Model](#procurementcalljson-model)
  - [Profile Model](#profile-model)
  - [Search Model](#search-model)
  - [SubProfile Model](#subprofile-model)
- [Scoring Logic Documentation (suitability.js)](#scoring-logic-documentation-suitabilityjs)
- [TED Europa API Data Fetcher (xmlHeaven.js)](#ted-europa-api-data-fetcher-xmlheavenjs)
- [Express Server Configuration (index.js)](#express-server-configuration-indexjs)
- [Dockerfile for Building and Running](#dockerfile-for-building-and-running)
- [GitLab CI/CD Configuration](#gitlab-cicd-configuration)
- [Monstache Sync Daemon](#monstache-sync-daemon)
- [Nginx Proxies](#nginx-proxies)
  - [Main App Proxy](#main-app-proxy)
  - [Elasticsearch Proxy](#elasticsearch-proxy)
  - [Kibana Proxy](#kibana-proxy)
- [Deployment Server](#deployment-server)
- [Managed Database Service](#managed-database-service)
---

## Backend Overview

The backend is structured with configurations found within the "config" folder, controllers in the "controllers" folder, and routes in the "routes" folder. Each of these components plays a crucial role in the application's functionality:

- **Configurations**: Define how the application connects to external services like databases and search engines.
- **Controllers**: Handle the business logic, processing incoming requests, and sending responses.
- **Routes**: Define the application's endpoints and determine which controller should handle each request.

---

## Configurations

### Database (MongoDB)

- **Library**: Mongoose, an elegant MongoDB object modeling for Node.js.
- **Connection URI**: Constructed using environment variables: DB_USER, DB_PASSWORD, and DB_NAME to ensure security.
- **Connection Options**:
  - **New URL parser**: Ensures that MongoDB's connection string is parsed correctly.
  - **Unified Topology**: Uses the new server discovery and monitoring engine.
  - **SSL connection**: Ensures data is encrypted during transmission.
- **Connection Feedback**: Provides real-time feedback on the database connection status.
- **Exports**: The Mongoose object, configured for the application, is exported for use in models and routes.

### ElasticSearch

- **Library**: Client from @elastic/elasticsearch package, a modern Node.js client for ElasticSearch.
- **Node URL**: Predefined ElasticSearch node URL for connecting to the ElasticSearch cluster.
- **Authentication**: Uses environment variables EL_USER and EL_PASSWORD to authenticate with the ElasticSearch cluster securely.
- **Exports**: An ElasticSearch client instance, initialized with the above configurations, is exported for querying the ElasticSearch cluster.

---

## Controllers:

### GPT API Controller (GPTAPI)

This controller is responsible for integrating with the OpenAI API to generate prompts and summarize content. It uses the OpenAI SDK to interact with the GPT-3.5 model.

#### Prerequisites

- Install the OpenAI SDK.
- Configure the OpenAI API key in the `.env` file.

### 1. **Initialization**

- Import necessary modules and configurations.
- Initialize the OpenAI API instance with the provided API key.

#### 2. `generatePrompt(req, res)`

**Purpose**:

- To generate a prompt based on the input provided.

**Parameters**:

- `req`: The request object containing the prompt.
- `res`: The response object used to send back the generated content.

**Description**:

- This function logs the received prompt, checks if the OpenAI API key is configured, and validates the prompt. It then constructs a message for the GPT-3.5 model to generate potential search parameters for European commission TED procurement search. The generated content is then sent back as a response.

**Returns**:

- A JSON object containing the generated content.

#### 3. `summarize(input, res = null)`

**Purpose**:

- To summarize the provided content.

**Parameters**:

- `input`: The input object containing the content to be summarized.
- `res`: (Optional) The response object used to send back the summarized content.

**Description**:

- This function logs the received content, checks if the OpenAI API key is configured, and validates the content. It then constructs a message for the GPT-3.5 model to summarize the provided content. The summarized content is then either sent back as a response or returned, based on whether a response object is provided.

**Returns**:

- A JSON object containing the summarized content (if a response object is provided).
- The summarized content (if no response object is provided).

#### 4. **Exports**

- The module exports the `generatePrompt` and `summarize` functions for use in other parts of the application.

### GPT Assessment Controller (GPTASS)

This controller is designed to integrate with the OpenAI API for the purpose of generating prompts and assessing the suitability of tenders or procurements for a company.

#### Prerequisites

- Install the OpenAI SDK.
- Set up the OpenAI API key in the `.env` file.

#### 1. **Initialization**

- Import necessary modules and configurations.
- Initialize the OpenAI API instance using the provided API key.

#### 2. `generatePrompt(req, res)`

**Purpose**:

- To generate a prompt based on the input provided and communicate with the OpenAI API.

**Parameters**:

- `req`: The request object containing the prompt.
- `res`: The response object used to send back the generated content.

**Description**:

- The function begins by logging the received prompt. It then checks if the OpenAI API key is configured. If not, it sends an error response.
- The function then retrieves and validates the prompt from the request. If the prompt is invalid, it sends an error response.
- It constructs a message for the GPT-3.5 model to assess why a particular tender or procurement is a good fit for a company. The model is expected to return short bullet points highlighting the positives and limitations.
- The generated content is then sent back as a response.

**Returns**:

- A JSON object containing the generated content.

#### 3. **Exports**

- The module exports the `generatePrompt` function for use in other parts of the application.

---

### OpenAI Similar Words Controller (GPTSIM) (DEPRECATED AND REMOVED)

This controller is designed to integrate with the OpenAI API for the purpose of generating semantically similar words based on the provided word or list of words.

#### Prerequisites

- Install the OpenAI SDK.
- Set up the OpenAI API key in the `.env` file.

#### 1. **Initialization**

- Import necessary modules and configurations.
- Initialize the OpenAI API instance using the provided API key.

#### 2. `similarWords(req, res)`

**Purpose**:

- To generate a list of semantically similar words based on the provided word or list of words.

**Parameters**:

- `req`: The request object containing the prompt.
- `res`: The response object used to send back the generated list of similar words.

**Description**:

- The function starts by logging the received prompt. It then checks if the OpenAI API key is configured. If not, it sends an error response.
- The function retrieves and validates the prompt from the request. If the prompt is invalid, it sends an error response.
- It constructs a message for the GPT-3.5 model to generate semantically similar words based on the provided word or list of words. The model is expected to return the similar words in a specified format.
- The generated list of similar words is then sent back as a response.

**Returns**:

- A JSON object containing the generated list of similar words.

#### 3. **Exports**

- The module exports the `similarWords` function for use in other parts of the application.

---

### OpenAI Keyword Translation Controller (GPTTRN)

This controller is designed to integrate with the OpenAI API for the purpose of translating a list of keywords into multiple languages.

#### Prerequisites

- Install the OpenAI SDK.
- Set up the OpenAI API key in the `.env` file.

#### 1. **Initialization**

- Import necessary modules and configurations.
- Initialize the OpenAI API instance using the provided API key.

#### 2. `translateKeywords(keywords, languages)`

**Purpose**:

- To translate a list of keywords into multiple languages.

**Parameters**:

- `keywords`: An array of keywords that need to be translated.
- `languages`: An array of ISO country codes representing the target languages for translation.

**Description**:

- The function starts by checking if any keywords are provided. If not, it logs a message and returns an empty array.
- If no languages are provided, the function uses a default list of languages.
- It then checks if the OpenAI API key is configured. If not, it logs an error message.
- The function initializes an array `translations` with the original keywords.
- It then iterates over each target language. For non-English languages, it constructs a message for the GPT-3.5 model to translate the keywords into the target language.
- The translated keywords are then added to the `translations` array.
- After translating the keywords into all target languages, the function returns a unique set of translated keywords.

**Returns**:

- An array of unique translated keywords.

#### 3. **Exports**

- The module exports the `translateKeywords` function for use in other parts of the application.

---

### Profile Controller

The Profile Controller is dedicated to the management and manipulation of company profiles and their associated subprofiles. It offers a suite of functionalities that allow for the creation, retrieval, updating, and deletion of profiles and subprofiles.

#### 1. `createProfile(req, res, next)`

- **Purpose**: To create a new company profile or update an existing one based on the provided company name.
- **Parameters**:
  - `req`: The request object, which should contain the company details.
  - `res`: The response object used to send back the results.
  - `next`: The next middleware function in the Express.js routing process.
- **Description**: This function first checks if a profile with the given company name already exists in the database. If it does, the existing profile is updated with the new details provided in the request. If not, a new profile is created and stored in the database.
- **Returns**: The created or updated profile object, along with a status message indicating the action performed.

#### 2. `deleteProfile(req, res, next)`

- **Purpose**: To delete a specific company profile using its unique ID.
- **Parameters**:
  - `req`: The request object, which should contain the unique profile ID.
  - `res`: The response object to send back the results.
  - `next`: The next middleware function in the Express.js routing process.
- **Description**: This function identifies the profile associated with the provided ID and deletes it from the database. It ensures that all related data, such as subprofiles, are also deleted or handled appropriately.
- **Returns**: A confirmation message indicating the successful deletion of the profile.

#### 3. `fetchProfile(req, res, next)`

- **Purpose**: To retrieve a specific company profile using the company's name.
- **Parameters**:
  - `req`: The request object, which should contain the company name.
  - `res`: The response object to send back the results.
  - `next`: The next middleware function in the Express.js routing process.
- **Description**: This function searches the database for a profile associated with the provided company name. If the profile is found, its details are returned. If not, a new profile is created, stored in the database, and then returned.
- **Returns**: The fetched profile object or the newly created profile object.

#### 4. `updateSubProfile(req, res, next)`

- **Purpose**: To update a specific subprofile using its unique ID and the provided update data.
- **Parameters**:
  - `req`: The request object, which should contain the subprofile ID and the data to update.
  - `res`: The response object to send back the results.
  - `next`: The next middleware function in the Express.js routing process.
- **Description**: This function identifies the subprofile associated with the provided ID and updates its details based on the data provided in the request.
- **Returns**: The updated subprofile object, along with a status message indicating the successful update.

#### 5. `deleteSubProfile(req, res, next)`

- **Purpose**: To delete a specific subprofile using its unique ID.
- **Parameters**:
  - `req`: The request object, which should contain the unique subprofile ID.
  - `res`: The response object to send back the results.
  - `next`: The next middleware function in the Express.js routing process.
- **Description**: This function identifies the subprofile associated with the provided ID and deletes it from the database. It ensures that all related data is handled appropriately.
- **Returns**: A confirmation message indicating the successful deletion of the subprofile.

#### 6. `createSubProfile(req, res, next)`

- **Purpose**: To create a new subprofile associated with a specific company profile.
- **Parameters**:
  - `req`: The request object, which should contain the profile ID and the details of the subprofile to be created.
  - `res`: The response object to send back the results.
  - `next`: The next middleware function in the Express.js routing process.
- **Description**: This function creates a new subprofile with the details provided in the request and associates it with the company profile identified by the provided profile ID.
- **Returns**: The newly created subprofile object, along with a status message indicating successful creation.

---

### Tender Controller

The Tender Controller is responsible for managing and manipulating procurement calls, often referred to as tenders. It provides functionalities to fetch tenders based on specific criteria, such as CPV (Common Procurement Vocabulary) codes, and evaluates their suitability based on a company's profile.

#### 1. `arraysAreEquivalent(arr1, arr2)`

**Purpose**:

- To check if two arrays are equivalent in terms of their content.

**Parameters**:

- `arr1`: The first array to compare.
- `arr2`: The second array to compare.

**Description**:

- This function first checks if the lengths of the two arrays are different. If they are, it returns false. Otherwise, it sorts both arrays and compares each element. If all elements match, it returns true; otherwise, it returns false.

**Returns**:

- A boolean value indicating whether the two arrays are equivalent.

#### 2. `translateAndAppendNewKeywords(keywords, lastKeywords, languages, lastLanguages)`

**Purpose**:

- To translate and append new keywords based on changes in languages or keywords.

**Parameters**:

- `keywords`: The current set of keywords.
- `lastKeywords`: The previous set of keywords.
- `languages`: The current set of languages.
- `lastLanguages`: The previous set of languages.

**Description**:

- This function determines new keywords and languages by comparing the current values with the previous values. It then translates the new keywords to all current languages and translates all keywords to the new languages. If no new translations are found, it returns the original keywords.

**Returns**:

- An array containing the original keywords appended with the translated new keywords.

#### 3. `spellingAndAppendNewKeywords(keywords, lastKeywords)`

**Purpose**:

- To check spelling and append new keywords based on changes in keywords.

**Parameters**:

- `keywords`: The current set of keywords.
- `lastKeywords`: The previous set of keywords.

**Description**:

- This function filters out keywords that are already present in the lastKeywords array. It then extends the new keywords and returns the original keywords appended with the new spellings.

**Returns**:

- An array containing the original keywords appended with the new spellings.

#### 4. `getTendersByCPV(req, res, next)`

**Purpose**:

- To fetch tenders based on CPV codes and evaluate their suitability for a company.

**Parameters**:

- `req`: The request object, which should contain the company's subprofile and other relevant data.
- `res`: The response object used to send back the results.
- `next`: The next middleware function in the Express.js routing process.

**Description**:

- This function performs the following steps:
  1. Retrieves the company's subprofile from the request.
  2. Checks if there are changes in the company's keywords or languages and updates them accordingly.
  3. Constructs an Elasticsearch query based on the company's CPV codes and other criteria.
  4. Fetches tenders from Elasticsearch based on the constructed query.
  5. Evaluates the suitability of each tender based on various criteria such as CPV code, value, description, location, and title.
  6. Sorts the tenders based on their suitability score.
  7. Sends the sorted tenders as a response.

**Returns**:

- A JSON object containing the sorted tenders based on their suitability for the company.

---

## Models:

### **CPVCode Model**

Represents the Common Procurement Vocabulary (CPV) codes used in public procurement to classify the subject of procurement contracts.
Used for checking if the cpv codes generated by ChatGPT are actually valid codes that can be used in a search.

**Schema**: `CPVCodeSchema`

- **cpvcode**:

  - Type: String
  - Description: The CPV code string.
  - Required: Yes

- **englishname**:

  - Type: String
  - Description: English name representation of the CPV code.
  - Required: Yes

- **finnishname**:
  - Type: String
  - Description: Finnish name representation of the CPV code.
  - Required: Yes

---

### **ProcurementCall Model**

Represents a procurement call or tender in the application. These fields are parsed from the xml returned by the ted API.
The json is then stored for later use in another collection and can be referenced from this model.

**Schema**: `ProcurementCallSchema`

- **title**:

  - Type: String
  - Description: Title of the procurement call.

- **docid**:

  - Type: String
  - Description: Unique document ID of the procurement call.
  - Required: Yes

- **dateForSubmission**:

  - Type: String
  - Description: Deadline for submission for the procurement.

- **datePublished**:

  - Type: String
  - Description: Date when the procurement was published.

- **jsondata**:

  - Type: ObjectId (Reference to `ProcurementCallJson`)
  - Description: Reference to the `ProcurementCallJson` model containing additional data about the procurement.

- **cpvCodes**:

  - Type: Array of Strings
  - Description: Array of CPV codes associated with the procurement.

- **relevantText**:

  - Type: Array of Strings
  - Description: Array of text extracted from the original json.

- **lgOrig**:

  - Type: String
  - Description: Original language of the procurement document.

- **isoCountry**:

  - Type: String
  - Description: ISO country code where the procurement is applicable.

- **documentType**:

  - Type: String
  - Description: Type of the procurement document.

- **uriDocText**:

  - Type: String
  - Description: URI to the ted portal for the original procurement.

- **iaUrlEtendering**:

  - Type: String
  - Description: URL to the e-tendering platform for the procurement.

- **valuesList**:
  - Type: String
  - Description: String representing the list of values associated with the procurement.

---

### **ProcurementCallJson Model**

Represents the JSON data associated with a procurement call.

**Schema**: `ProcurementCallJsonSchema`

- **originalId**:

  - Type: ObjectId
  - Description: Original ID of the procurement call.

- **data**:
  - Type: Mixed
  - Description: Mixed type data containing the JSON representation of the procurement call details.

---

### **Profile Model**

Represents a company's profile in the application (NEEDS TO BE UPDATED TO AN ACTUAL AUTHENTICATED PROFILE).

**Schema**: `ProfileSchema`

- **companyName**:

  - Type: String
  - Description: Name of the company.
  - Required: Yes

- **subProfiles**:
  - Type: Array of ObjectIds (Reference to `SubProfile`)
  - Description: Array of references to the `SubProfile` model associated with the company profile.

---

### **Search Model**

Represents a search instance where the procurement calls given by certain .

**Schema**: `SearchSchema`

- **time**:

  - Type: Date
  - Description: Timestamp when the search was conducted. Defaults to current date and time.

- **suitabilityScore** (probably not needed):

  - Type: Number
  - Description: Suitability score of the procurement call for the subprofile.
  - Required: Yes

- **aiAssessment**: (probably not needed)

  - Type: String
  - Description: AI's assessment of the procurement call's suitability.
  - Required: Yes

- **subProfile**:

  - Type: ObjectId (Reference to `SubProfile`)
  - Description: Reference to the `SubProfile` model for which the assessment was conducted.

- **procurementCall**:
  - Type: ObjectId (Reference to `ProcurementCall`) (needs to be changed to and array of object id:s for all matching procurements for a given search)
  - Description: Reference to the `ProcurementCall` model that was assessed.

---

### **SubProfile Model**

Represents a subprofile of a company, detailing specific criteria and preferences.

**Schema**: `SubProfileSchema`

- **strategy**:

  - Type: String
  - Description: Strategy associated with the subprofile.

- **financialDocuments**:

  - Type: String
  - Description: Financial documents related to the subprofile.

- **pastWorks**:

  - Type: String
  - Description: Past works or projects associated with the subprofile.

- **cpvCodes**:

  - Type: Array of Strings
  - Description: Array of CPV codes relevant to the subprofile.

- **industry**:

  - Type: String
  - Description: Industry sector of the subprofile.

- **tenderSize**:

  - Type: String
  - Description: Size preference of tenders for the subprofile.

- **lowestcost**:

  - Type: String
  - Description: Lowest cost preference for tenders.

- **highestcost**:

  - Type: String
  - Description: Highest cost preference for tenders.

- **description**:

  - Type: String
  - Description: Description of the subprofile.

- **exclude**:

  - Type: Array of Strings
  - Description: Array of excluded words.

- **dislikedLocations**:

  - Type: Array of Strings
  - Description: Array of locations that are not preferred.

- **languages**:

  - Type: Array of Strings
  - Description: Array of preferred languages for the subprofile.

- **lastLanguages**:

  - Type: Array of Strings
  - Description: Array of the last set of preferred languages for the subprofile.

- **keywords**:

  - Type: Array of Strings
  - Description: Array of keywords associated with the subprofile.

- **lastKeywords**:

  - Type: Array of Strings
  - Description: Array of the last set of keywords associated with the subprofile.

- **subProfileName**:

  - Type: String
  - Description: Name of the subprofile.
  - Required: Yes

- **profile**:
  - Type: ObjectId (Reference to `Profile`)
  - Description: Reference to the main `Profile` model associated with the subprofile.

---

## Scoring Logic Documentation (suitability.ts)

The provided code contains several functions that are used to compare different attributes of a company with attributes of a tender. The goal is to determine how well a tender matches a company's preferences and capabilities. Each function returns a score (ranging from 0 to 100) and an explanation for that score.

### **1. CPV Code Comparison (`compareCPV`)**

This function compares the Common Procurement Vocabulary (CPV) codes of a company and a tender.

- **Parameters**:

  - `company`: The company object which should contain an array of CPV codes (`cpvCodes`).
  - `tenderCPVCode`: The CPV code of the tender.

- **Logic**:

  1. Validates the inputs.
  2. Finds the company's CPV code that has the longest common prefix with the tender's CPV code.
  3. Calculates a score based on the length of the common prefix.

- **Output**: An object containing the score and an explanation.

### **2. Value Comparison (`compareValue`)**

Compares the estimated value of a tender with a company's preferred cost range.

- **Parameters**:

  - `company`: The company object which should contain the lowest and highest cost preferences (`lowestcost` and `highestcost`).
  - `tenderEstimatedValue`: The estimated value of the tender.

- **Logic**:

  1. Validates the inputs.
  2. Determines if the tender value is within, below, or above the company's preferred cost range.
  3. Calculates a score based on the tender value's position relative to the company's cost range.

- **Output**: An object containing the score and an explanation.

### **3. Description Comparison (`compareDescription`)**

Compares keywords and disliked words from a company's profile with a tender's description.

- **Parameters**:

  - `keywords`: Array of keywords from the company's profile.
  - `tenderDescription`: Description of the tender.
  - `dislikedWords`: Array of words the company dislikes.

- **Logic**:

  1. Tokenizes the tender description.
  2. Matches keywords and disliked words from the company's profile with the tender description tokens.
  3. Calculates a score based on the number of matched keywords and disliked words.

- **Output**: An object containing the score, an explanation, the tender description, and the matched keywords.

### **4. Title Comparison (`compareTitle`)**

Compares keywords and disliked words from a company's profile with a tender's title.

- **Parameters**:

  - `keywords`: Array of keywords from the company's profile.
  - `tenderTitle`: Title of the tender.
  - `dislikedWords`: Array of words the company dislikes.

- **Logic**:

  1. Tokenizes the tender title.
  2. Matches keywords and disliked words from the company's profile with the tender title tokens.
  3. Calculates a score based on the number of matched keywords and disliked words.

- **Output**: An object containing the score, an explanation, the tender title, and the matched keywords.

### **5. Location Comparison (`compareLocation`)**

Compares a company's disliked locations with a tender's address.

- **Parameters**:

  - `company`: The company object which should contain an array of disliked locations (`dislikedLocations`).
  - `tenderAddress`: The address of the tender.

- **Logic**:

  1. Checks if any of the company's disliked locations appear in the tender address.
  2. Calculates a score based on the presence or absence of disliked locations in the tender address.

- **Output**: An object containing the score and an explanation.

---

**Note**: The core of the scoring system is to determine how well a tender aligns with a company's preferences. The scores are calculated based on various factors such as matching CPV codes, tender value, description, title, and location. Each function uses specific logic to derive a score, ensuring that the company gets a comprehensive assessment of how well a tender matches its criteria. These scores are later weighted in tender controller to calculate the final score.

---

## TED Europa API Data Fetcher (xmlHeaven.ts)

This script fetches procurement data from the TED Europa API, processes the data, and stores it in a MongoDB database. The script uses the Axios library for HTTP requests and xml2js for XML parsing.

### **1. Configuration**

- **URL**: The base URL for the TED Europa API.
- **Page Size**: The number of results to fetch per page.

### **2. Functions**

#### **2.1 `processPage(pageNum)`**

Fetches and processes a single page of results from the TED Europa API.

- **Parameters**:

  - `pageNum`: The page number to fetch.

- **Logic**:

  1. Constructs the full URL for the page.
  2. Sends an HTTP GET request to the API.
  3. Parses the XML response and extracts relevant data.
  4. Checks if the procurement already exists in the database.
  5. If not, creates a new `ProcurementCall` and `ProcurementCallJson` record in the database.

- **Output**: A boolean indicating success (`true`) or failure (`false`).

#### **2.2 `fetchPages(pageNum)`**

Fetches multiple pages of results from the TED Europa API until no more results are found or an error occurs.

- **Parameters**:

  - `pageNum`: The starting page number.

- **Logic**:
  1. Calls `processPage` for each page.
  2. Increments the page number and repeats until `processPage` returns `false`.

#### **2.3 `extractP(obj, key)`**

Recursively extracts values associated with a specific key from a nested object.

- **Parameters**:

  - `obj`: The object to search.
  - `key`: The key to search for.

- **Logic**:

  1. If the object contains the key, its value(s) are added to the result array.
  2. If the object contains nested objects, the function is called recursively on each nested object.

- **Output**: An array of values associated with the key.

### **3. Execution**

The script starts by calling `fetchPages(1)`, which begins fetching data from the first page of the TED Europa API.

---

**Note**: This script is designed to fetch and process procurement data from the TED Europa API. It extracts specific fields from the API's XML response, processes them, and stores the results in a MongoDB database. The script is modular, with separate functions for fetching data, processing individual pages, and extracting specific data from nested objects. The extracting is done because the data in the xml is schemaless in the form section of the xml. The function is used for parsing out all paragraphs with the "P" tag. TODO: this script needs to be made to run automatically every day when the TED database is updated.

---

## Express Server Configuration (index.ts)

This script sets up and starts an Express server for a web application. The server serves both static files and provides various API routes. It uses the `dotenv` library to load environment variables and connects to a MongoDB database.

### **1. Configuration**

- **dotenv**: Loads environment variables from a `.env` file into `process.env`.
- **Port**: The server listens on the port specified in the environment variable `PORT` or defaults to `5000` if not set.

### **2. Routes**

The server provides several API routes:

#### **2.1 GPTAPIRoute (`/`)**

Handles requests related to the GPT API.

#### **2.2 tenderRoutes (`/api/tenders`)**

Handles requests related to tenders.

#### **2.3 profileRoutes (`/profile`)**

Handles requests related to profiles.

#### **2.4 cpvRoutes (`/cpv`)**

Handles requests related to CPV (Common Procurement Vocabulary) codes.

### **3. Middleware**

- **Static Middleware**: Serves static files from the `client/public` directory.
- **JSON Middleware**: Parses incoming requests with JSON payloads.

### **4. Fallback Route**

Any request that doesn't match the above routes will be directed to the main `index.html` file in the `client/public` directory. This is useful for single-page applications that handle routing on the client side.

### **5. Starting the Server**

The server starts listening on the specified port and logs a message to the console once it's running.

---

**Note**: This script is the main entry point for the server-side of the application. It sets up routes, middleware, and starts the server. The server is designed to serve both API requests and static files for a web application. The modular structure allows for easy addition of new routes and middleware.

---

## Dockerfile for Building and Running

This Dockerfile describes the steps to build a Node.js application with a client and server component. It uses a multi-stage build process to first build the client and then set up the server.

### **1. Build Stage for the Client (`build-stage`)**

#### **1.1 Base Image**

- **FROM node:lts-buster AS build-stage**: Uses the long-term support (LTS) version of Node.js on the Debian Buster OS as the base image for the build stage.

#### **1.2 Working Directory**

- **WORKDIR /app/root/client**: Sets the working directory inside the container to `/app/root/client`.

#### **1.3 Dependencies Installation**

- **COPY `./client/package*.json ./`**: Copies the `package.json` and `package-lock.json` (if it exists) from the host's `./client` directory to the current directory inside the container.
- **RUN npm cache clean --force**: Cleans the npm cache.
- **RUN npm install**: Installs the client's dependencies.

#### **1.4 Building the Client**

- **COPY ./client/ .**: Copies the rest of the client files from the host to the container.
- **RUN npm run build**: Builds the client application.

### **2. Main Stage for the Server**

#### **2.1 Base Image**

- **FROM node:lts-buster**: Uses the LTS version of Node.js on the Debian Buster OS as the base image for the main stage.

#### **2.2 Installing Puppeteer Dependencies**

A list of dependencies required for Puppeteer, a headless Chrome browser, is installed. This is necessary if the server-side code uses Puppeteer for tasks like web scraping or PDF generation.

#### **2.3 Setting Up the Server**

- **WORKDIR /app/root**: Sets the working directory inside the container to `/app/root`.
- **COPY `--from=build-stage /app/root/client/build ./client/public`**: Copies the built client files from the `build-stage` to the `./client/public` directory inside the container.
- **COPY `./server/package*.json ./server/`**: Copies the `package.json` and `package-lock.json` (if it exists) from the host's `./server` directory to the `./server` directory inside the container.
- **WORKDIR /app/root/server**: Changes the working directory to `/app/root/server`.
- **RUN npm cache clean --force**: Cleans the npm cache.
- **RUN npm install**: Installs the server's dependencies.
- **COPY `./server/ .`**: Copies the rest of the server files from the host to the container.

#### **2.4 Exposing the Server Port**

- **EXPOSE 5000**: Exposes port `5000` of the container, which is the port the server listens on.

#### **2.5 Starting the Server**

- **CMD `[ "node", "index.js" ]`**: Specifies the command to run when the container starts. This command starts the server using Node.js.

---

**Note**: This Dockerfile is designed for applications that have separate client and server components. The client is built in the first stage, and the built files are then used in the main stage where the server is set up and run.

---

## GitLab CI/CD Configuration

This configuration file describes the steps to build a Docker image from a Git repository and then deploy it to a server.

### **Global Variables**

- **GIT_CLONE_URL**: The URL used to clone the Git repository. This includes authentication details.
- **IMAGE_NAME**: The name of the Docker image.
- **IMAGE_TAG**: The tag for the Docker image.

### **Stages**

The CI/CD process is divided into two stages:

1. **build**: This stage builds the Docker image.
2. **deploy**: This stage deploys the Docker image to a server.

---

### **1. Build Image Stage (`build image`)**

#### **1.1 Configuration**

- **stage**: Associates this job with the `build` stage.
- **image**: Uses the latest version of Docker for this job.
- **services**: Uses Docker-in-Docker (dind) service to allow Docker commands to be run inside this job.

#### **1.2 Variables**

- **DOCKER_HOST**: Specifies the Docker host.
- **DOCKER_TLS_CERTDIR**: Disables TLS for Docker.
- **DOCKER_DRIVER**: Sets the Docker storage driver to `overlay2`.

#### **1.3 Before Script**

- Logs into the Docker registry using GitLab CI's built-in environment variables.
- Installs the `git` package to the image.

#### **1.4 Script**

- Clones the Git repository.
- Changes the working directory to `tender-assistant/root`.
- Builds the Docker image with the specified name and tag.
- Pushes the Docker image to the registry.

#### **1.5 Execution Conditions**

- **only**: Specifies that this job should only run for the `main` branch.

---

### **2. Deploy to Server Stage (`deploy to server`)**

#### **2.1 Configuration**

- **stage**: Associates this job with the `deploy` stage.
- **image**: Uses the latest version of Node.js for this job.

#### **2.2 Before Script**

- Sets the correct permissions for the SSH key.

#### **2.3 Script**

- Uses SSH to connect to the server `root@appaipa.eu`.
- Logs into the Docker registry.
- Pulls the Docker image with the specified name and tag.
- Stops and removes any existing Docker container named `AIPA`.
- Runs a new Docker container with the specified image, binding port `5000` and setting the name to `AIPA`. Also mounts a volume for environment variables.

#### **2.4 Execution Conditions**

- **only**: Specifies that this job should only run for the `main` branch.

---

**Note**: This configuration is designed for applications that are containerized using Docker. The `build` stage creates a Docker image from the source code, and the `deploy` stage deploys this image to a server using Docker.

---

## Monstache Sync Daemon

Monstache is a synchronization daemon used for MongoDB and Elasticsearch. It continuously indexes your MongoDB collections into Elasticsearch in real-time. This is run as a service in the deployment server as well as elasticsearch

### Configuration

- **MongoDB**: Connects to the MongoDB instance and watches for changes using the oplog.
- **Elasticsearch**: Data from MongoDB is indexed into Elasticsearch.
- **Real-time Sync**: Monstache provides real-time sync to ensure that Elasticsearch is always up-to-date with MongoDB.

---

## Nginx Proxies

Nginx is used as a reverse proxy to route requests from the internet to specific services running in the backend.

### Main App Proxy

- **From**: Port 443 (HTTPS)
- **To**: Docker container running on port 5000

### Elasticsearch Proxy

- **From**: Port 9200
- **To**: Port 9201 (HTTPS)

### Kibana Proxy

- **From**: Port 5601
- **To**: Port 5602 (HTTPS)

---

## Deployment Server

The application is deployed on a Digital Ocean droplet, which provides a virtual private server for running the application.

### Configuration

- **Droplet Size**: 4vCpu 16gb RAM, 25GB NVME SSD + 100GB mounted volume.
- **Operating System**: Ubuntu 20.04
- **Security**: SSH and firewalls.

---

## Managed Database Service

The application's database runs on a managed database service provided by DigitalOcean.

### Configuration

- **Database Type**: MongoDB
- **Version**: 6.0.6.
- **Backup**: Manual mongodumps to S3.
- **Scaling**: Can be resized. Currently 4GB RAM, 2vCPU, 56GB DISK.
- **Security**: Only certain IP:s allowed.
- **Configuration**: Primary only

---