import * as express from 'express';
import { UNAUTHORIZED } from 'http-status';
import { Auth } from './Auth';
import { Destroy } from './Destroy';
import { Identity } from './Identity';
import { Stats } from './Stats';
import { WIP } from './WIP';

const router: express.Router = express.Router();

router.use('/auth', Auth);
router.use('/wip', WIP);

router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.user) {
    next();
    return;
  }

  res.sendStatus(UNAUTHORIZED);
});

router.use('/identity', Identity);
router.use('/destroy', Destroy);
router.use('/stats', Stats);

export const API: express.Router = router;
