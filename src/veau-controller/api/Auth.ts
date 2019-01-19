import {Router} from 'express';
import * as express from 'express';
import * as passport from 'passport';
import {RequestSession} from '../../declarations/RequestSession';

const router: Router = Router();

router.post('/', passport.authenticate('local'), (req: RequestSession, res: express.Response) => {
  console.log(req.user);
  // TODO fake response
  res.send({
    id: 1,
    language: 'ja',
    name: 'john doe'
  });
});

export const Auth = router;
