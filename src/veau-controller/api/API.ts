import {Router} from 'express';
import * as express from 'express';
import {Auth} from './Auth';
import {Destroy} from './Destroy';
import {WIP} from './WIP';

const router: Router = Router();

router.use('/auth', Auth);
router.use('/wip', WIP);

router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.user) {
    next();
    return;
  }

  res.sendStatus(401);
});

router.use('/destroy', Destroy);

export const API = router;
