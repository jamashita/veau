import { JSONable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Controller, Delete, Get, Inject, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Type } from '../../container/Types';
import { LocaleError } from '../../domain/vo/Locale/error/LocaleError';
import { ILogger } from '../../infrastructure/ILogger';
import { LocaleInteractor } from '../../interactor/LocaleInteractor';

@Controller('locale')
export class LocaleController {
  private readonly localeInteractor: LocaleInteractor;
  private readonly logger: ILogger;

  public constructor(
    @Inject(Type.LocaleInteractor) localeInteractor: LocaleInteractor,
    @Inject(Type.Logger) logger: ILogger
  ) {
    this.localeInteractor = localeInteractor;
    this.logger = logger;
  }

  @Get('/')
  public all(@Res() res: FastifyReply): void {
    this.localeInteractor.all().transform<void, Error>((locale: JSONable) => {
      res.status(StatusCodes.OK).send(locale.toJSON());
    }, (err: DataSourceError | LocaleError) => {
      this.logger.error(err);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    });
  }

  @Delete('/')
  // TODO USEBEFORE
  public delete(@Res() res: FastifyReply): void {
    this.localeInteractor.delete().transform<void, Error>(() => {
      this.logger.trace('LOCALE CACHE DELETED');

      res.status(StatusCodes.OK).send();
    }, (err: DataSourceError) => {
      this.logger.error(err);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    });
  }
}
