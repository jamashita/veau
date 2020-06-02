import { Response } from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { inject } from 'inversify';
import log4js from 'log4js';
import { Controller, Delete, Get, Res, UseBefore } from 'routing-controllers';

import { DataSourceError } from '@jamashita/publikum-error';
import { JSONable } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { LocaleInteractor } from '../../Interactor/LocaleInteractor';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

const logger: log4js.Logger = log4js.getLogger();

@Controller('/locale')
export class LocaleController {
  private readonly localeInteractor: LocaleInteractor;

  public constructor(@inject(Type.LocaleInteractor) localeInteractor: LocaleInteractor) {
    this.localeInteractor = localeInteractor;
  }

  @Get('/')
  public async all(@Res() res: Response<unknown>): Promise<Response<unknown>> {
    const superposition: Superposition<JSONable, LocaleError | DataSourceError> = await this.localeInteractor.all();

    return superposition.match<Response<unknown>>(
      (locale: JSONable) => {
        return res.status(OK).send(locale.toJSON());
      },
      (err: LocaleError | DataSourceError) => {
        logger.error(err);

        return res.sendStatus(INTERNAL_SERVER_ERROR);
      }
    );
  }

  @Delete('/')
  @UseBefore(AuthenticationMiddleware)
  public async delete(@Res() res: Response<unknown>): Promise<Response<unknown>> {
    const superposition: Superposition<unknown, DataSourceError> = await this.localeInteractor.delete();

    return superposition.match<Response<unknown>>(
      () => {
        return res.sendStatus(OK);
      },
      (err: DataSourceError) => {
        logger.error(err);

        return res.sendStatus(INTERNAL_SERVER_ERROR);
      }
    );
  }
}
