import { IMySQL } from '@jamashita/catacombe-mysql';
import { IRedis } from '@jamashita/catacombe-redis';
import { Container } from 'inversify';
import { StatsCommand as StatsKernelCommand } from '../Command/Kernel/StatsCommand';
import { LanguageCommand as LanguageRedisCommand } from '../Command/Redis/LanguageCommand';
import { RegionCommand as RegionRedisCommand } from '../Command/Redis/RegionCommand';
import { AccountController } from '../Controller/API/AccountController';
import { AuthController } from '../Controller/API/AuthController';
import { LocaleController } from '../Controller/API/LocaleController';
import { SessionController } from '../Controller/API/SessionController';
import { StatsController } from '../Controller/API/StatsController';
import { FEController } from '../Controller/FE/FEController';
import { AuthenticationMiddleware } from '../Controller/Middleware/AuthenticationMiddleware';
import { ILogger } from '../Infrastructure/Interface/ILogger';
import { logger } from '../Infrastructure/Logger';
import { veauMySQL } from '../Infrastructure/VeauMySQL';
import { veauRedis } from '../Infrastructure/VeauRedis';
import { AuthenticationInteractor } from '../Interactor/AuthenticationInteractor';
import { LocaleInteractor } from '../Interactor/LocaleInteractor';
import { StatsInteractor } from '../Interactor/StatsInteractor';
import { LanguageQuery as LanguageKernelQuery } from '../Query/Kernel/LanguageQuery';
import { RegionQuery as RegionKernelQuery } from '../Query/Kernel/RegionQuery';
import { StatsQuery as StatsKernelQuery } from '../Query/Kernel/StatsQuery';
import { AccountQuery as AccountMySQLQuery } from '../Query/MySQL/AccountQuery';
import { LanguageQuery as LanguageMySQLQuery } from '../Query/MySQL/LanguageQuery';
import { RegionQuery as RegionMySQLQuery } from '../Query/MySQL/RegionQuery';
import { StatsItemQuery as StatsItemMySQLQuery } from '../Query/MySQL/StatsItemQuery';
import { StatsOutlineQuery as StatsOutlineMySQLQuery } from '../Query/MySQL/StatsOutlineQuery';
import { StatsValueQuery as StatsValueMySQLQuery } from '../Query/MySQL/StatsValueQuery';
import { LanguageQuery as LanguageRedisQuery } from '../Query/Redis/LanguageQuery';
import { RegionQuery as RegionRedisQuery } from '../Query/Redis/RegionQuery';
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
