import express from 'express';
import { OK } from 'http-status';

const router: express.Router = express.Router();

router.delete('/', (req: express.Request, res: express.Response) => {
  req.logout();
  res.sendStatus(OK);
});

export const DestroyController: express.Router = router;
