import { NextFunction, Request, Response, Router } from 'express';
import { UNAUTHORIZED } from 'http-status';
import { Auth } from './Auth';
import { Destroy } from './Destroy';
import { Identity } from './Identity';
import { WIP } from './WIP';

const router: Router = Router();

router.use('/auth', Auth);
router.use('/wip', WIP);

router.use((req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
    return;
  }

  res.sendStatus(UNAUTHORIZED);
});

router.use('/identity', Identity);
router.use('/destroy', Destroy);

export const API: Router = router;
