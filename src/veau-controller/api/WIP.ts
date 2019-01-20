import { Request, Response, Router } from 'express';
import { Digest, DigestResponseJSON } from '../../veau-general/Digest';

const router: Router = Router();

router.get('/encrypt/:str', async (req: Request, res: Response) => {
  const str: string = req.params.str;
  const digestResponse: DigestResponseJSON = await Digest.generate(str);

  res.send(digestResponse.hash);
});

export const WIP: Router = router;
