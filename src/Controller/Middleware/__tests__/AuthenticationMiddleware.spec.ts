import express, { Express, NextFunction, Request, Response } from 'express';
import { OK, UNAUTHORIZED } from 'http-status';
import 'reflect-metadata';
import { Controller, Delete, Get, Post, Put, Res, UseBefore, useExpressServer } from 'routing-controllers';
import supertest from 'supertest';

import { AuthenticationMiddleware } from '../AuthenticationMiddleware';

@Controller('/')
class MockController {
  @Get('/')
  @UseBefore(AuthenticationMiddleware)
  public get(@Res() res: Response): Response {
    return res.sendStatus(OK);
  }

  @Post('/')
  @UseBefore(AuthenticationMiddleware)
  public post(@Res() res: Response): Response {
    return res.sendStatus(OK);
  }

  @Put('/')
  @UseBefore(AuthenticationMiddleware)
  public put(@Res() res: Response): Response {
    return res.sendStatus(OK);
  }

  @Delete('/')
  @UseBefore(AuthenticationMiddleware)
  public delete(@Res() res: Response): Response {
    return res.sendStatus(OK);
  }
}

const setUser = (req: Request, _res: Response, next: NextFunction): void => {
  req.user = {};
  next();
};

describe('AuthenticationMiddleware', () => {
  describe('requires', () => {
    it('GET: pass', async () => {
      const app: Express = express();

      app.use(setUser);
      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).get('/');

      expect(response.status).toBe(OK);
    });

    it('GET: blocked', async () => {
      const app: Express = express();

      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).get('/');

      expect(response.status).toBe(UNAUTHORIZED);
    });

    it('POST: pass', async () => {
      const app: Express = express();

      app.use(setUser);
      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).post('/');

      expect(response.status).toBe(OK);
    });

    it('POST: blocked', async () => {
      const app: Express = express();

      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).post('/');

      expect(response.status).toBe(UNAUTHORIZED);
    });

    it('PUT: pass', async () => {
      const app: Express = express();

      app.use(setUser);
      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).put('/');

      expect(response.status).toBe(OK);
    });

    it('PUT: blocked', async () => {
      const app: Express = express();

      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).put('/');

      expect(response.status).toBe(UNAUTHORIZED);
    });

    it('DELETE: pass', async () => {
      const app: Express = express();

      app.use(setUser);
      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).delete('/');

      expect(response.status).toBe(OK);
    });

    it('DELETE: blocked', async () => {
      const app: Express = express();

      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).delete('/');

      expect(response.status).toBe(UNAUTHORIZED);
    });
  });
});
