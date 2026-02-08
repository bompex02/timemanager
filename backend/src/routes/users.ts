import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getPreferences,
  getUserById,
  getUsers,
  updatePreferences,
  updateUser,
} from '../controllers/usersController.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/:id/preferences', getPreferences);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/preferences', updatePreferences);

export default router;
