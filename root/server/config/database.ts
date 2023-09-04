// Load environment variables from a .env file
import dotenv from 'dotenv';
dotenv.config();

// Import the Mongoose library
import mongoose from 'mongoose';

const ENV = process.env.NODE_ENV || 'development';

const DB_NAME = ENV === 'test' ? 'testDatabase' : process.env.DB_NAME;

// Destructure environment variables
const { DB_USER, DB_PASSWORD } = process.env;

// Construct the MongoDB connection URI with authentication details
const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_NAME}/AIPA?tls=true&authSource=admin&replicaSet=aipadb`;

// Connect to MongoDB using the provided URI and options
mongoose.connect(uri, {
  tls: true,                              // Enable TLS connection
  tlsAllowInvalidCertificates: false      // Do not allow invalid certificates
}).then(() => {
  // Connection successful
  console.log('\x1b[32m%s\x1b[0m', 'MongoDB connection successful');
}).catch((error: Error) => {
  // Error connecting to MongoDB
  console.error('\x1b[31m%s\x1b[0m', 'Error connecting to MongoDB: ', error);
  process.exit(1);    // Exit the process with a non-zero status code
});

// Export the Mongoose object for use in other modules
export { mongoose };
