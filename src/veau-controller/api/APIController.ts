import * as express from 'express';
import { AuthenticationMiddleware } from '../middleware/AuthenticationMiddleware';
import { AuthController } from './AuthController';
import { DestroyController } from './DestroyController';
import { IdentityController } from './IdentityController';
import { LocaleController } from './LocaleController';
import { StatsController } from './StatsController';
import { WIPController } from './WIPController';

const router: express.Router = express.Router();

router.use('/auth', AuthController);
router.use('/wip', WIPController);
router.use(AuthenticationMiddleware);
router.use('/identity', IdentityController);
router.use('/locales', LocaleController);
router.use('/stats', StatsController);
router.use('/destroy', DestroyController);

export const APIController: express.Router = router;
