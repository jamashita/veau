import express from 'express';
import { OK } from 'http-status';
import passport from 'passport';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware';

const router: express.Router = express.Router();

const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();

router.post('/', passport.authenticate('local'), authenticationMiddleware.requires(), (req: express.Request, res: express.Response): void => {
  res.status(OK).send(res.locals.account.toJSON());
});

export const AuthController: express.Router = router;
