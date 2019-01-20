import { Router } from 'express';
import { API } from './api/API';
import { FE } from './fe/FE';

const router: Router = Router();

router.use('/api', API);
router.use('/', FE);

export const Controller: Router = router;
