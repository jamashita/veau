import express from 'express';
import { AuthController } from './AuthController';
import { DestroyController } from './DestroyController';
import { IdentityController } from './IdentityController';
import { LocaleController } from './LocaleController';
import { StatsController } from './StatsController';

const router: express.Router = express.Router();

router.use('/auth', AuthController);
router.use('/locale', LocaleController);
router.use('/destroy', DestroyController);
router.use('/identity', IdentityController);
router.use('/stats', StatsController);

export const APIController: express.Router = router;