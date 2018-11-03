import * as express from 'express';
import * as assert from 'power-assert';
import * as log4js from 'log4js';
import {api} from './api';
import {fe} from './fe';

export class RequestError extends Error {
  public status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const router = express.Router();
const logger = log4js.getLogger();

router.use('/api', api);
router.use('/', fe);

// catch 404 and forward to error handler
router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const err = new RequestError('Not Found', 404);
  next(err);
});

router.use((err: Error, req: express.Request, res: express.Response) => {
  assert(err !== null);
  const error: RequestError = err as RequestError;
  const {
    status,
    message,
    stack
  } = error;

  res.status(status || 500);
  logger.warn(`ERROR STATUS: ${status}`);
  logger.warn(`ERROR MESSAGE: ${message}`);
  logger.warn(`ERROR STACK: ${stack}`);
  res.render('error', {
    message
  });
});

export const Controller = router;
