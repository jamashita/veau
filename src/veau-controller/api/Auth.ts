import {Router} from 'express';
import * as express from 'express';
import {Logger} from 'log4js';
import * as log4js from 'log4js';
import * as passport from 'passport';

const router: Router = Router();
const logger: Logger = log4js.getLogger();

router.post('/', passport.authenticate('local'), (req: express.Request, res: express.Response) => {
  if (req.user) {
    res.send(req.user.toJSON());
    return;
  }

  logger.error('Illegal access');
  res.sendStatus(500);
});

export const Auth = router;
