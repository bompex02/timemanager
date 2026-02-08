import { Router } from 'express';
import {
  createWorkday,
  deleteWorkday,
  getWorkday,
  getWorkdaysByUser,
  getWorkdaysByUserAndDate,
  listWorkdays,
  updateWorkday,
  getHomeOfficeForUserByDate,
  getHomeOfficeForUserByDateRange,
  getWorkdaysOfLast2WeeksByUser,
  getWorkdaysByUserAndMonth,
} from '../controllers/workdaysController.js';

const router = Router();

router.get('/', listWorkdays);
router.post('/', createWorkday);
router.get('/user/:userId/:date', getWorkdaysByUserAndDate);
router.get('/user/:userId', getWorkdaysByUser);
router.get('/:id', getWorkday);
router.put('/:userId', updateWorkday);
router.delete('/:id', deleteWorkday);
router.get('/homeoffice/bulk/:userId', getHomeOfficeForUserByDateRange);
router.get('/homeoffice/:userId/:date', getHomeOfficeForUserByDate);
router.get('/last2weeks/:userId', getWorkdaysOfLast2WeeksByUser);
router.get('/month/:userId/:year/:month', getWorkdaysByUserAndMonth);


export default router;
