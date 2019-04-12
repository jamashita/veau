import * as express from 'express';
import { Digest } from '../../veau-general/Digest';

const router: express.Router = express.Router();

router.get('/encrypt/:str', async (req: express.Request, res: express.Response) => {
  const {
    str
  } = req.params;

  const hash: string = await Digest.generate(str);

  res.send(hash);
});

export const WIPController: express.Router = router;
