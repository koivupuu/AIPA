import express from 'express';
import * as profileController from '../controllers/profileController';
import { checkJwt, handleAuthError } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create', checkJwt, profileController.createProfile);
router.delete('/delete/:profileID', checkJwt, profileController.deleteProfile);
router.get('/fetch', checkJwt, profileController.fetchProfile);

router.get('/subprofile/fetch/:subProfileId', checkJwt, profileController.fetchSubProfile);
router.put('/subprofile/update/:subProfileId', checkJwt, profileController.updateSubProfile);
router.delete('/subprofile/delete/:subProfileId', checkJwt, profileController.deleteSubProfile);
router.post('/subprofile/create', checkJwt, profileController.createSubProfile);

router.post('/scrape', checkJwt, profileController.scrape);

router.use(handleAuthError);

export default router;
