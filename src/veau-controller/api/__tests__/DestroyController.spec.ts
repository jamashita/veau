import express from 'express';
import { OK } from 'http-status';
import 'jest';
import supertest from 'supertest';
import { DestroyController } from '../DestroyController';

describe('DestroyController', () => {
  describe('DELETE /', () => {
    it('no session returns OK', async () => {
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        // @ts-ignore
        req.logout = (): void => {
        };
        next();
      });
      app.use('/', DestroyController);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(OK);
    });
  });
});
