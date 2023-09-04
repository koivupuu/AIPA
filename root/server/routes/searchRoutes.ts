import express from 'express';
import * as searchController from '../controllers/searchController';
import { checkJwt, handleAuthError } from '../middleware/authMiddleware';

const router = express.Router();

// Create a search for a given subprofile
router.post('/create/:subProfileID', checkJwt, searchController.createSearchForSubProfile);

// Delete a search for a given subprofile
router.delete('/delete/:searchID', checkJwt, searchController.deleteSearchForSubProfile);

// Fetch all searches for a given subprofile
router.get('/fetch/:subProfileID', checkJwt, searchController.fetchSearchesForSubProfile);

// Fetch all procurement calls and their suitability scores for a given search
router.get('/procurement/:searchID', checkJwt, searchController.fetchProcurementCallsForSearch);

router.use(handleAuthError);

export default router;
