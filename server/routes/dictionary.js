import express from 'express';
import db from './queries.js';

import authorization from '../middleware/auth.js';

const router = express.Router();

/* GET words submitted by user */
router.get('/:id', authorization, db.getWords);

router.post('/', authorization, db.createWord);

router.delete('/:id', authorization, db.deleteWord);

router.put('/:id', authorization, db.updateWord);

export default router;