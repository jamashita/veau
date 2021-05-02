import { JSONable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Controller, Delete, Get, Res, UseBefore } from 'routing-controllers';
import { Type } from '../../container/Types';
import { LocaleError } from '../../domain/vo/Locale/error/LocaleError';
import { logger } from '../../infrastructure/Logger';
import { LocaleInteractor } from '../../interactor/LocaleInteractor';
import { AuthenticationMiddleware } from '../middleware/AuthenticationMiddleware';

@injectable()
@Controller('/locale')
export class LocaleController {
  private readonly localeInteractor: LocaleInteractor;

  public constructor(@inject(Type.LocaleInteractor) localeInteractor: LocaleInteractor) {
    this.localeInteractor = localeInteractor;
  }

  @Get('/')
  public async all(@Res() res: Response): Promise<Response> {
    return this.localeInteractor.all().transform<Response, Error>((locale: JSONable) => {
      return res.status(StatusCodes.OK).send(locale.toJSON());
    }, (err: DataSourceError | LocaleError) => {
      logger.error(err);

      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }).get();
  }

  @Delete('/')
  @UseBefore(AuthenticationMiddleware)
  public async delete(@Res() res: Response): Promise<Response> {
    return this.localeInteractor.delete().transform<Response, Error>(() => {
      return res.sendStatus(StatusCodes.OK);
    }, (err: DataSourceError) => {
      logger.error(err);

      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }).get();
  }
}
