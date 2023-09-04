declare namespace Express {
    export interface Request {
      auth?: {
        sub: string;
        // Add other properties if needed
      };
    }
  }
  