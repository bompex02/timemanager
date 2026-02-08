import { Router } from 'express';
import { changePassword, login, logout, register } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', authLimiter, logout);
router.post('/change-password', authLimiter, changePassword);

export default router;
