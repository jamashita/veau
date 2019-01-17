import * as express from 'express';
import {API} from './api/API';
import {FE} from './fe/FE';

const router = express.Router();

router.use('/API', API);
router.use('/', FE);

export const Controller = router;
