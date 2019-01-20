import { Request, Response, Router } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import { getLogger, Logger } from 'log4js';
import * as passport from 'passport';
const router: Router = Router();
const logger: Logger = getLogger();

router.post('/', passport.authenticate('local'), (req: Request, res: Response) => {
  if (req.user) {
    res.send(req.user.toJSON());
    return;
  }

  logger.error('Illegal access');
  res.sendStatus(INTERNAL_SERVER_ERROR);
});

export const Auth: Router = router;
