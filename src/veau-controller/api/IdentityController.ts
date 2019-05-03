import * as express from 'express';
import { RequestSession } from '../RequestSession';

const router: express.Router = express.Router();

router.get('/', (req: RequestSession, res: express.Response) => {
  res.send(req.user.toJSON());
});

export const IdentityController: express.Router = router;
