import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { Type } from '../container/Types';
import { logger } from '../infrastructure/Logger';
import { veauMySQL } from '../infrastructure/VeauMySQL';
import { veauRedis } from '../infrastructure/VeauRedis';
import { AuthenticationInteractor } from '../interactor/AuthenticationInteractor';
import { LocaleInteractor } from '../interactor/LocaleInteractor';
import { StatsInteractor } from '../interactor/StatsInteractor';
import { StatsCaskCommand } from '../repository/command/cask/StatsCaskCommand';
import { LanguageRedisCommand } from '../repository/command/redis/LanguageRedisCommand';
import { RegionRedisCommand } from '../repository/command/redis/RegionRedisCommand';
import { LanguageCaskQuery } from '../repository/query/cask/LanguageCaskQuery';
import { RegionCaskQuery } from '../repository/query/cask/RegionCaskQuery';
import { StatsCaskQuery } from '../repository/query/cask/StatsCaskQuery';
import { AccountMySQLQuery } from '../repository/query/mysql/AccountMySQLQuery';
import { LanguageMySQLQuery } from '../repository/query/mysql/LanguageMySQLQuery';
import { RegionMySQLQuery } from '../repository/query/mysql/RegionMySQLQuery';
import { StatsItemMySQLQuery } from '../repository/query/mysql/StatsItemMySQLQuery';
import { StatsOutlineMySQLQuery } from '../repository/query/mysql/StatsOutlineMySQLQuery';
import { StatsValueMySQLQuery } from '../repository/query/mysql/StatsValueMySQLQuery';
import { LanguageRedisQuery } from '../repository/query/redis/LanguageRedisQuery';
import { RegionRedisQuery } from '../repository/query/redis/RegionRedisQuery';
import { AccountController } from './api/AccountController';
import { AuthController } from './api/AuthController';
import { LocaleController } from './api/LocaleController';
import { SessionController } from './api/SessionController';
import { StatsController } from './api/StatsController';
import { FEController } from './fe/FEController';
import { AuthenticationMiddleware } from './middleware/AuthenticationMiddleware';

@Module({
  providers: [
    // infrastructure
    {
      provide: Type.Logger,
      useValue: logger
    },
    {
      provide: Type.MySQL,
      useValue: veauMySQL
    },
    {
      provide: Type.Redis,
      useValue: veauRedis
    },
    // command
    {
      provide: Type.StatsCaskCommand,
      useClass: StatsCaskCommand
    },
    {
      provide: Type.LanguageRedisCommand,
      useClass: LanguageRedisCommand
    },
    {
      provide: Type.RegionRedisCommand,
      useClass: RegionRedisCommand
    },
    // interactor
    {
      provide: Type.AuthenticationInteractor,
      useClass: AuthenticationInteractor
    },
    {
      provide: Type.LocaleInteractor,
      useClass: LocaleInteractor
    },
    {
      provide: Type.StatsInteractor,
      useClass: StatsInteractor
    },
    // query
    {
      provide: Type.LanguageCaskQuery,
      useClass: LanguageCaskQuery
    },
    {
      provide: Type.RegionCaskQuery,
      useClass: RegionCaskQuery
    },
    {
      provide: Type.StatsCaskQuery,
      useClass: StatsCaskQuery
    },
    {
      provide: Type.AccountMySQLQuery,
      useClass: AccountMySQLQuery
    },
    {
      provide: Type.LanguageMySQLQuery,
      useClass: LanguageMySQLQuery
    },
    {
      provide: Type.RegionMySQLQuery,
      useClass: RegionMySQLQuery
    },
    {
      provide: Type.StatsItemMySQLQuery,
      useClass: StatsItemMySQLQuery
    },
    {
      provide: Type.StatsOutlineMySQLQuery,
      useClass: StatsOutlineMySQLQuery
    },
    {
      provide: Type.StatsValueMySQLQuery,
      useClass: StatsValueMySQLQuery
    },
    {
      provide: Type.LanguageRedisQuery,
      useClass: LanguageRedisQuery
    },
    {
      provide: Type.RegionRedisQuery,
      useClass: RegionRedisQuery
    }
  ],
  controllers: [
    AccountController,
    AuthController,
    LocaleController,
    SessionController,
    StatsController,
    FEController
  ]
})
export class BaseController implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthenticationMiddleware).exclude(
      {
        path: 'locale',
        method: RequestMethod.DELETE
      }).forRoutes(
      LocaleController,
      StatsController
    );
  }
}
