# Artificial Intelligence Procurement Assistant - Version 1

This software is the first version of a new tool that helps companies improve their procurement processes using artificial intelligence.

## Description

The AI Procurement Assistant creates a company profile and procurement search parameters by entering the company's strategy and financial statements into the user interface. It uses the openai GPT-API (Mainly 3.5-turbo-16k).

The user interface provides an opportunity to check and verify the correctness of the company profile. Once the profile is approved, a search button appears.

By pressing the search button, the user is directed to a new page where the search results and the information filtered by artificial intelligence are presented as a list. The list also includes a "suitability score" assessment, which is produced by a specific algorithm.

If a database is created, and you have configured it in the server side you can run node xmlHeaven.js to retrieve data from the TED portal to the database.

## Installation

Installation and execution take place as follows:

1. Cloning
    ```
    git clone <REPO_URL>
    ```
2. Install dependencies in both client and server folders
    ```
    cd client
    npm install
    cd ../server
    npm install
    ```
3. Build the application in the client folder
    ```
    cd ../client
    npm run build
    ```
4. Build the application in the server folder
    ```
    cd ../server
    tsc
    ```
    or 

    ```
    cd ../server
    npm run build
    ```
5. Start the application in the server folder
    ```
    node dist/index.js
    ```
    or
    ```
    npm start
    ```


The software assumes that the user has a .env file in the *./client* folder with the following information:

```
REACT_APP_BACKEND_URL=http://localhost:5000/api
REACT_APP_AUTH0_DOMAIN=
REACT_APP_AUTH0_CLIENT_ID=
REACT_APP_AUTH0_AUDIENCE=
PUPPETEER_SKIP_DOWNLOAD=true
```


The software assumes that the user has a .env file in the *./server* folder with the following information:

```
OPENAI_API_KEY=
DB_NAME=
DB_USER=
DB_PASSWORD=
EL_USER=
EL_PASSWORD=
NODE_ENV=
AUTH0_AUDIENCE=
AUTH0_ISSUER=
AUTH0_DOMAIN= 
AUTH0_MANAGEMENT_TOKEN=
PUPPETEER_SKIP_DOWNLOAD=true
```



## Usage

Use the software as follows:

1. Start the application and open your browser at the address where the application is running (localhost:5000 if running on your own computer).

2. Select your use case (active calls or results)

3. Enter relevant info.

4. Fill in the open fields by pressing the AI button and check the information.

5. Once the data is checked, the search button will appear. Press the search button to perform a match between the company and the search results.

6. After the match, a new view opens where you see the search results. You can view detailed information of a specific tender by clicking on it in the list.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


