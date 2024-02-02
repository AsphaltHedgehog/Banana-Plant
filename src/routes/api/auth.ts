import express from 'express';
import { ctrl } from './../../controllers/auth';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.post('/register', ctrl.register);

router.post('/login', ctrl.login);

router.post('/logout', authenticate, ctrl.logout);

export default router;
