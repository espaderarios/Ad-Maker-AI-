import { Router } from 'express';
import { login, signup } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);

// Password reset / email verification
import { forgotPassword, resetPassword, sendVerification, verifyEmail } from '../controllers/auth.controller.js';

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-verification', sendVerification);
router.post('/verify-email', verifyEmail);

export default router;
