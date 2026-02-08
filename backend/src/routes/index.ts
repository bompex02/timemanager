import { Router } from 'express';
import recordsRouter from './timeRecords.js';
import workdaysRouter from './workdays.js';
import workmonthsRouter from './workmonths.js';
import projectsRouter from './projects.js';
import usersRouter from './users.js';
import rolesRouter from './roles.js';
import authRouter from './auth.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Chroniq API läuft' });
});

router.use('/records', recordsRouter);
router.use('/workdays', workdaysRouter);
router.use('/workmonths', workmonthsRouter);
router.use('/projects', projectsRouter);
router.use('/users', usersRouter);
router.use('/roles', rolesRouter);
router.use('/auth', authRouter);

export default router;
