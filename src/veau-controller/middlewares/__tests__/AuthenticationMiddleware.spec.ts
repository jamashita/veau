import express from 'express';
import { OK, UNAUTHORIZED } from 'http-status';
import 'jest';
import supertest from 'supertest';
import { AuthenticationMiddleware } from '../AuthenticationMiddleware';

describe('AuthenticationMiddleware', () => {
  describe('GET', () => {
    it('pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.apply());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(OK);
    });

    it('blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
      const app: express.Express = express();
      app.use(authenticationMiddleware.apply());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });

  describe('POST', () => {
    it('pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.apply());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).post('/');
      expect(response.status).toEqual(OK);
    });

    it('blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
      const app: express.Express = express();
      app.use(authenticationMiddleware.apply());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).post('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });

  describe('PUT', () => {
    it('pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.apply());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).put('/');
      expect(response.status).toEqual(OK);
    });

    it('blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
      const app: express.Express = express();
      app.use(authenticationMiddleware.apply());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).put('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });

  describe('DELETE', () => {
    it('pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.apply());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(OK);
    });

    it('blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
      const app: express.Express = express();
      app.use(authenticationMiddleware.apply());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });
});
