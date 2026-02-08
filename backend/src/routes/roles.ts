import { Router } from 'express';
import {
  createRole,
  deleteRole,
  getRole,
  listRoles,
  updateRole,
} from '../controllers/rolesController.js';

const router = Router();

router.get('/', listRoles);
router.get('/:id', getRole);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router;
