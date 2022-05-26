import express from 'express';
import db from './queries.js';
import authorization from '../middleware/auth.js';

const router = express.Router();

/* GET language by its id */
router.get('/:id', authorization, db.getLanguage);

/* GET all languages by the user with user id */
router.get('/', authorization, db.getLanguagesByUser);

router.post('/', authorization, db.createLanguage);

router.delete('/:id', authorization, db.deleteLanguage);

router.put('/:id', authorization, db.updateLanguage);

export default router;
