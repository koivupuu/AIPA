import express from 'express';
import { generatePrompt } from '../controllers/GPTAPIController';
import { checkJwt, handleAuthError } from '../middleware/authMiddleware';
const router = express.Router();

router.post('/generate', checkJwt, generatePrompt);
router.use(handleAuthError);

export default router;
