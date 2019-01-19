import {Router} from 'express';
import * as express from 'express';
import {Digest, DigestResponseJSON} from '../../veau-general/Digest';

const router: Router = Router();

router.get('/encrypt/:str', async (req: express.Request, res: express.Response) => {
  const str: string = req.params.str;
  const digestResponse: DigestResponseJSON = await Digest.generate(str);

  res.send(digestResponse.hash);
});

export const WIP = router;
