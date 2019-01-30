import * as express from 'express';
import { APIController } from './api/APIController';
import { FEController } from './fe/FEController';

const router: express.Router = express.Router();

router.use('/api', APIController);
router.use('/', FEController);

export const Controller: express.Router = router;
