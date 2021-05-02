import { IMySQL } from '@jamashita/catacombe-mysql';
import { IRedis } from '@jamashita/catacombe-redis';
import { Container } from 'inversify';
import { AccountController } from '../controller/api/AccountController';
import { AuthController } from '../controller/api/AuthController';
import { LocaleController } from '../controller/api/LocaleController';
import { SessionController } from '../controller/api/SessionController';
import { StatsController } from '../controller/api/StatsController';
import { FEController } from '../controller/fe/FEController';
import { AuthenticationMiddleware } from '../controller/middleware/AuthenticationMiddleware';
import { ILogger } from '../infrastructure/interface/ILogger';
import { logger } from '../infrastructure/Logger';
import { veauMySQL } from '../infrastructure/VeauMySQL';
import { veauRedis } from '../infrastructure/VeauRedis';
import { AuthenticationInteractor } from '../interactor/AuthenticationInteractor';
import { LocaleInteractor } from '../interactor/LocaleInteractor';
import { StatsInteractor } from '../interactor/StatsInteractor';
import { StatsCommand as StatsCaskCommand } from '../repository/command/kernel/StatsCommand';
import { LanguageCommand as LanguageRedisCommand } from '../repository/command/redis/LanguageCommand';
import { RegionCommand as RegionRedisCommand } from '../repository/command/redis/RegionCommand';
import { LanguageQuery as LanguageCaskQuery } from '../repository/query/kernel/LanguageQuery';
import { RegionQuery as RegionCaskQuery } from '../repository/query/kernel/RegionQuery';
import { StatsQuery as StatsCaskQuery } from '../repository/query/kernel/StatsQuery';
import { AccountQuery as AccountMySQLQuery } from '../repository/query/mysql/AccountQuery';
import { LanguageQuery as LanguageMySQLQuery } from '../repository/query/mysql/LanguageQuery';
import { RegionQuery as RegionMySQLQuery } from '../repository/query/mysql/RegionQuery';
import { StatsItemQuery as StatsItemMySQLQuery } from '../repository/query/mysql/StatsItemQuery';
import { StatsOutlineQuery as StatsOutlineMySQLQuery } from '../repository/query/mysql/StatsOutlineQuery';
import { StatsValueQuery as StatsValueMySQLQuery } from '../repository/query/mysql/StatsValueQuery';
import { LanguageQuery as LanguageRedisQuery } from '../repository/query/redis/LanguageQuery';
import { RegionQuery as RegionRedisQuery } from '../repository/query/redis/RegionQuery';
import { Type } from './Types';

const container: Container = new Container();

// Infrastructure
container.bind<ILogger>(Type.Logger).toConstantValue(logger);
container.bind<IMySQL>(Type.MySQL).toConstantValue(veauMySQL);
container.bind<IRedis>(Type.Redis).toConstantValue(veauRedis);

// Command
container.bind<StatsCaskCommand>(Type.StatsCaskCommand).to(StatsCaskCommand).inSingletonScope();
container.bind<LanguageRedisCommand>(Type.LanguageRedisCommand).to(LanguageRedisCommand).inSingletonScope();
container.bind<RegionRedisCommand>(Type.RegionRedisCommand).to(RegionRedisCommand).inSingletonScope();

// Controller
container.bind<AccountController>(AccountController).toSelf().inSingletonScope();
container.bind<AuthController>(AuthController).toSelf().inSingletonScope();
container.bind<LocaleController>(LocaleController).toSelf().inSingletonScope();
container.bind<SessionController>(SessionController).toSelf().inSingletonScope();
container.bind<StatsController>(StatsController).toSelf().inSingletonScope();
container.bind<FEController>(FEController).toSelf().inSingletonScope();
container.bind<AuthenticationMiddleware>(AuthenticationMiddleware).toSelf().inSingletonScope();

// Interactor
container.bind<AuthenticationInteractor>(Type.AuthenticationInteractor).to(AuthenticationInteractor).inSingletonScope();
container.bind<LocaleInteractor>(Type.LocaleInteractor).to(LocaleInteractor).inSingletonScope();
container.bind<StatsInteractor>(Type.StatsInteractor).to(StatsInteractor).inSingletonScope();

// Query
container.bind<LanguageCaskQuery>(Type.LanguageCaskQuery).to(LanguageCaskQuery).inSingletonScope();
container.bind<RegionCaskQuery>(Type.RegionCaskQuery).to(RegionCaskQuery).inSingletonScope();
container.bind<StatsCaskQuery>(Type.StatsCaskQuery).to(StatsCaskQuery).inSingletonScope();
container.bind<AccountMySQLQuery>(Type.AccountMySQLQuery).to(AccountMySQLQuery).inSingletonScope();
container.bind<LanguageMySQLQuery>(Type.LanguageMySQLQuery).to(LanguageMySQLQuery).inSingletonScope();
container.bind<RegionMySQLQuery>(Type.RegionMySQLQuery).to(RegionMySQLQuery).inSingletonScope();
container.bind<StatsItemMySQLQuery>(Type.StatsItemMySQLQuery).to(StatsItemMySQLQuery).inSingletonScope();
container.bind<StatsOutlineMySQLQuery>(Type.StatsOutlineMySQLQuery).to(StatsOutlineMySQLQuery).inSingletonScope();
container.bind<StatsValueMySQLQuery>(Type.StatsValueMySQLQuery).to(StatsValueMySQLQuery).inSingletonScope();
container.bind<LanguageRedisQuery>(Type.LanguageRedisQuery).to(LanguageRedisQuery).inSingletonScope();
container.bind<RegionRedisQuery>(Type.RegionRedisQuery).to(RegionRedisQuery).inSingletonScope();

export const cask: Container = container;
