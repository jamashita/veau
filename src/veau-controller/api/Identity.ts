import { Response, Router } from 'express';
import { RequestSession } from '../../declarations/RequestSession';

const router: Router = Router();

router.get('/', (req: RequestSession, res: Response) => {
  res.send(req.user);
});

export const Identity: Router = router;
