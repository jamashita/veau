import * as express from 'express';

const router = express.Router();

router.post('/', (req: express.Request, res: express.Response) => {
  // TODO fake response
  res.send({
    id: 1,
    language: 'ja',
    name: 'john.doe'
  });
});

export const Auth = router;
