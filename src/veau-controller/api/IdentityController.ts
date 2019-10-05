import express from 'express';
import { OK } from 'http-status';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware';

const router: express.Router = express.Router();

const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();

router.get('/', authenticationMiddleware.apply(), (req: express.Request, res: express.Response): void => {
  res.status(OK).send(req.account.toJSON());
});

export const IdentityController: express.Router = router;
