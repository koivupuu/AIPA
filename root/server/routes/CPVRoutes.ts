import express from 'express';
import { cpvCode } from '../controllers/profileController';
import { checkJwt, handleAuthError } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:code', checkJwt, cpvCode);
router.use(handleAuthError);

export default router;
