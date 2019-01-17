import * as express from 'express';
import {Auth} from './Auth';

const router = express.Router();

router.use('/auth', Auth);

export const API = router;
