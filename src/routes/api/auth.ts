import express from 'express';
import { ctrl } from './../../controllers/auth';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.post('/register', ctrl.register);

router.post('/login', ctrl.login);

router.patch('/logout', authenticate, ctrl.logout);

export default router;
