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
import { StatsCommand as StatsKernelCommand } from '../repository/command/kernel/StatsCommand';
import { LanguageCommand as LanguageRedisCommand } from '../repository/command/redis/LanguageCommand';
import { RegionCommand as RegionRedisCommand } from '../repository/command/redis/RegionCommand';
import { LanguageQuery as LanguageKernelQuery } from '../repository/query/Kernel/LanguageQuery';
import { RegionQuery as RegionKernelQuery } from '../repository/query/Kernel/RegionQuery';
import { StatsQuery as StatsKernelQuery } from '../repository/query/Kernel/StatsQuery';
import { AccountQuery as AccountMySQLQuery } from '../repository/query/MySQL/AccountQuery';
import { LanguageQuery as LanguageMySQLQuery } from '../repository/query/MySQL/LanguageQuery';
import { RegionQuery as RegionMySQLQuery } from '../repository/query/MySQL/RegionQuery';
import { StatsItemQuery as StatsItemMySQLQuery } from '../repository/query/MySQL/StatsItemQuery';
import { StatsOutlineQuery as StatsOutlineMySQLQuery } from '../repository/query/MySQL/StatsOutlineQuery';
import { StatsValueQuery as StatsValueMySQLQuery } from '../repository/query/MySQL/StatsValueQuery';
import { LanguageQuery as LanguageRedisQuery } from '../repository/query/Redis/LanguageQuery';
import { RegionQuery as RegionRedisQuery } from '../repository/query/Redis/RegionQuery';
import { Type } from './Types';

const k: Container = new Container();

// Infrastructure
k.bind<ILogger>(Type.Logger).toConstantValue(logger);
k.bind<IMySQL>(Type.MySQL).toConstantValue(veauMySQL);
k.bind<IRedis>(Type.Redis).toConstantValue(veauRedis);

// Command
k.bind<StatsKernelCommand>(Type.StatsKernelCommand).to(StatsKernelCommand).inSingletonScope();
k.bind<LanguageRedisCommand>(Type.LanguageRedisCommand).to(LanguageRedisCommand).inSingletonScope();
k.bind<RegionRedisCommand>(Type.RegionRedisCommand).to(RegionRedisCommand).inSingletonScope();

// Controller
k.bind<AccountController>(AccountController).toSelf().inSingletonScope();
k.bind<AuthController>(AuthController).toSelf().inSingletonScope();
k.bind<LocaleController>(LocaleController).toSelf().inSingletonScope();
k.bind<SessionController>(SessionController).toSelf().inSingletonScope();
k.bind<StatsController>(StatsController).toSelf().inSingletonScope();
k.bind<FEController>(FEController).toSelf().inSingletonScope();
k.bind<AuthenticationMiddleware>(AuthenticationMiddleware).toSelf().inSingletonScope();

// Interactor
k.bind<AuthenticationInteractor>(Type.AuthenticationInteractor).to(AuthenticationInteractor).inSingletonScope();
k.bind<LocaleInteractor>(Type.LocaleInteractor).to(LocaleInteractor).inSingletonScope();
k.bind<StatsInteractor>(Type.StatsInteractor).to(StatsInteractor).inSingletonScope();

// Query
k.bind<LanguageKernelQuery>(Type.LanguageKernelQuery).to(LanguageKernelQuery).inSingletonScope();
k.bind<RegionKernelQuery>(Type.RegionKernelQuery).to(RegionKernelQuery).inSingletonScope();
k.bind<StatsKernelQuery>(Type.StatsKernelQuery).to(StatsKernelQuery).inSingletonScope();
k.bind<AccountMySQLQuery>(Type.AccountMySQLQuery).to(AccountMySQLQuery).inSingletonScope();
k.bind<LanguageMySQLQuery>(Type.LanguageMySQLQuery).to(LanguageMySQLQuery).inSingletonScope();
k.bind<RegionMySQLQuery>(Type.RegionMySQLQuery).to(RegionMySQLQuery).inSingletonScope();
k.bind<StatsItemMySQLQuery>(Type.StatsItemMySQLQuery).to(StatsItemMySQLQuery).inSingletonScope();
k.bind<StatsOutlineMySQLQuery>(Type.StatsOutlineMySQLQuery).to(StatsOutlineMySQLQuery).inSingletonScope();
k.bind<StatsValueMySQLQuery>(Type.StatsValueMySQLQuery).to(StatsValueMySQLQuery).inSingletonScope();
k.bind<LanguageRedisQuery>(Type.LanguageRedisQuery).to(LanguageRedisQuery).inSingletonScope();
k.bind<RegionRedisQuery>(Type.RegionRedisQuery).to(RegionRedisQuery).inSingletonScope();

export const kernel: Container = k;
