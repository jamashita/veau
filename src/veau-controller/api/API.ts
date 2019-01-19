import * as express from 'express';
import {Auth} from './Auth';
import {WIP} from './WIP';

const router = express.Router();

router.use('/auth', Auth);
router.use('/wip', WIP);

export const API = router;
