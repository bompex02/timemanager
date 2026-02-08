import { Router } from 'express';
import {
  countProjectsByUser,
  createProject,
  deleteProject,
  getProject,
  listProjects,
  listProjectsByUser,
  updateProject,
} from '../controllers/projectsController.js';

const router = Router();

router.get('/', listProjects);
router.post('/', createProject);
router.get('/user/:userId/count', countProjectsByUser);
router.get('/user/:userId', listProjectsByUser);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
