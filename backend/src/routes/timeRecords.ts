import { Router } from 'express';
import {
  createRecord,
  deleteRecord,
  getRecord,
  getRecordsByUser,
  listRecords,
  updateRecord,
} from '../controllers/recordsController.js';

const router = Router();

router.get('/', listRecords);
router.post('/', createRecord);
router.get('/user/:userId', getRecordsByUser);
router.get('/:id', getRecord);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export default router;
