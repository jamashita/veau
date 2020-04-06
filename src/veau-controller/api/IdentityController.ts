import express from 'express';
import { OK } from 'http-status';
import { kernel } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { AuthenticationMiddleware } from '../middlewares/AuthenticationMiddleware';

const router: express.Router = express.Router();

const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);

router.get('/', authenticationMiddleware.requires(), (req: express.Request, res: express.Response) => {
  res.status(OK).send(res.locals.account.toJSON());
});

export const IdentityController: express.Router = router;
