import express from 'express';
import { BAD_REQUEST, OK } from 'http-status';
import * as log4js from 'log4js';
import * as passport from 'passport';
import { AuthenticatedMiddleware } from '../middlewares/AuthenticatedMiddleware';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const authenticatedMiddleware: AuthenticatedMiddleware = AuthenticatedMiddleware.getInstance();

router.post('/', passport.authenticate('local'), authenticatedMiddleware.apply(), (req: express.Request, res: express.Response): any => {
  if (req.isAuthenticated()) {
    res.status(OK).send(req.user.toJSON());
    return;
  }

  logger.fatal('ILLEGAL ACCESS');
  res.sendStatus(BAD_REQUEST);
});

export const AuthController: express.Router = router;
