import express from 'express';
import { APIController } from './API/APIController';
import { FEController } from './FE/FEController';

const router: express.Router = express.Router();

router.use('/api', APIController);
router.use('/', FEController);

export const BaseController: express.Router = router;
