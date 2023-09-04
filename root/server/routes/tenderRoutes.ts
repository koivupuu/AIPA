import express from 'express';
import * as P2TController from '../controllers/P2TController';
import * as T2PController from '../controllers/T2PController';
import { checkJwt, handleAuthError } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/getTenders', checkJwt, P2TController.getTenders);

router.post('/getAwardNotices', checkJwt, T2PController.getAwardNotices)

router.use(handleAuthError);

export default router;
