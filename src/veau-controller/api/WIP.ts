import * as express from 'express';
import { Digest, DigestResponseJSON } from '../../veau-general/Digest';

const router: express.Router = express.Router();

router.get('/encrypt/:str', async (req: express.Request, res: express.Response) => {
  const str: string = req.params.str;
  const digestResponse: DigestResponseJSON = await Digest.generate(str);

  res.send(digestResponse.hash);
});

export const WIP: express.Router = router;
