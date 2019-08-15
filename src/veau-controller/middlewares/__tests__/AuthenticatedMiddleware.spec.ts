import express from 'express';
import { OK, UNAUTHORIZED } from 'http-status';
import 'jest';
import supertest from 'supertest';
import { AuthenticatedMiddleware } from '../AuthenticatedMiddleware';

describe('AuthenticatedMiddleware', () => {
  describe('GET', () => {
    it('blocked', async () => {
      const authenticatedMiddleware: AuthenticatedMiddleware = AuthenticatedMiddleware.getInstance();
      const app: express.Express = express();
      app.use(authenticatedMiddleware.apply());
      app.use((req: express.Request, res: express.Response): any => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });

  describe('POST', () => {
    it('blocked', async () => {
      const authenticatedMiddleware: AuthenticatedMiddleware = AuthenticatedMiddleware.getInstance();
      const app: express.Express = express();
      app.use(authenticatedMiddleware.apply());
      app.use((req: express.Request, res: express.Response): any => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).post('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });

  describe('PUT', () => {
    it('blocked', async () => {
      const authenticatedMiddleware: AuthenticatedMiddleware = AuthenticatedMiddleware.getInstance();
      const app: express.Express = express();
      app.use(authenticatedMiddleware.apply());
      app.use((req: express.Request, res: express.Response): any => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).put('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });

  describe('DELETE', () => {
    it('blocked', async () => {
      const authenticatedMiddleware: AuthenticatedMiddleware = AuthenticatedMiddleware.getInstance();
      const app: express.Express = express();
      app.use(authenticatedMiddleware.apply());
      app.use((req: express.Request, res: express.Response): any => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });
});