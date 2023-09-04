import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';

dotenv.config();

import GPTAPIRoute from './routes/GPTAPIRoute';
import tenderRoutes from './routes/tenderRoutes';
import profileRoutes from './routes/profileRoutes';
import searchRoutes from './routes/searchRoutes';
import cpvRoutes from './routes/CPVRoutes';
import './config/database';

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',  // This is the address of your frontend. Adjust if needed.
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));  // Use the cors middleware with the specified options

app.use(express.json());
app.use('/api/gpt', GPTAPIRoute);
app.use('/api/tenders', tenderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cpv', cpvRoutes);
app.use('/api/search', searchRoutes);

// Conditionally serve static files in development environment
if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));
  
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});

