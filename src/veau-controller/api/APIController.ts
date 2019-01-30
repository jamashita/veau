import * as express from 'express';
import { UNAUTHORIZED } from 'http-status';
import { AuthController } from './AuthController';
import { DestroyController } from './DestroyController';
import { IdentityController } from './IdentityController';
import { LocaleController } from './LocaleController';
import { StatsController } from './StatsController';
import { WIPController } from './WIPController';

const router: express.Router = express.Router();

router.use('/auth', AuthController);
router.use('/wip', WIPController);

router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.user) {
    next();
    return;
  }

  res.sendStatus(UNAUTHORIZED);
});

router.use('/identity', IdentityController);
router.use('/destroy', DestroyController);
router.use('/locales', LocaleController);
router.use('/stats', StatsController);

export const APIController: express.Router = router;
