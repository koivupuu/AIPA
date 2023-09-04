import dotenv from 'dotenv';
import { Client } from '@elastic/elasticsearch';

dotenv.config(); // Loads environment variables from a .env file

// Retrieving ElasticSearch credentials from environment variables
const EL_USER: string = process.env.EL_USER!;
const EL_PASSWORD: string = process.env.EL_PASSWORD!;

const esClient = new Client({
  node: 'http://appaipa.eu:9200', // Specify the ElasticSearch node URL
  auth: {
    username: EL_USER, // Set the username for authentication
    password: EL_PASSWORD, // Set the password for authentication
  },
});

export default esClient; // Export the ElasticSearch client instance for reuse
