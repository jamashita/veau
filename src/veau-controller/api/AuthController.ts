import * as express from 'express';
import { BAD_REQUEST } from 'http-status';
import * as log4js from 'log4js';
import * as passport from 'passport';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

router.post('/', passport.authenticate('local'), (req: express.Request, res: express.Response) => {
  if (req.user) {
    res.send(req.user.toJSON());
    return;
  }

  logger.fatal('ILLEGAL ACCESS');
  res.sendStatus(BAD_REQUEST);
});

export const AuthController: express.Router = router;
