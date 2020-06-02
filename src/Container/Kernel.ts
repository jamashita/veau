import { Container } from 'inversify';

import { IMySQL } from '@jamashita/publikum-mysql';
import { IRedis } from '@jamashita/publikum-redis';

import { StatsCommand as StatsKernelCommand } from '../Command/Kernel/StatsCommand';
import { LanguageCommand as LanguageRedisCommand } from '../Command/Redis/LanguageCommand';
import { RegionCommand as RegionRedisCommand } from '../Command/Redis/RegionCommand';
import { AccountController } from '../Controller/API/AccountController';
import { AuthController } from '../Controller/API/AuthController';
import { LocaleController } from '../Controller/API/LocaleController';
import { SessionController } from '../Controller/API/SessionController';
import { StatsController } from '../Controller/API/StatsController';
import { FEController } from '../Controller/FE/FEController';
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

export const kernel: Container = new Container();

// Command
kernel.bind<StatsKernelCommand>(Type.StatsKernelCommand).to(StatsKernelCommand).inSingletonScope();
kernel.bind<LanguageRedisCommand>(Type.LanguageRedisCommand).to(LanguageRedisCommand).inSingletonScope();
kernel.bind<RegionRedisCommand>(Type.RegionRedisCommand).to(RegionRedisCommand).inSingletonScope();

// Controller
kernel.bind<AccountController>(Type.AccountController).to(AccountController).inSingletonScope();
kernel.bind<AuthController>(Type.AuthController).to(AuthController).inSingletonScope();
kernel.bind<LocaleController>(Type.LocaleController).to(LocaleController).inSingletonScope();
kernel.bind<SessionController>(Type.SessionController).to(SessionController).inSingletonScope();
kernel.bind<StatsController>(Type.StatsController).to(StatsController).inSingletonScope();
kernel.bind<FEController>(Type.FEController).to(FEController).inSingletonScope();

// Gateway
kernel.bind<IMySQL>(Type.MySQL).toConstantValue(veauMySQL);
kernel.bind<IRedis>(Type.Redis).toConstantValue(veauRedis);

// Interactor
kernel.bind<AuthenticationInteractor>(Type.AuthenticationInteractor).to(AuthenticationInteractor).inSingletonScope();
kernel.bind<LocaleInteractor>(Type.LocaleInteractor).to(LocaleInteractor).inSingletonScope();
kernel.bind<StatsInteractor>(Type.StatsInteractor).to(StatsInteractor).inSingletonScope();

// Query
kernel.bind<LanguageKernelQuery>(Type.LanguageKernelQuery).to(LanguageKernelQuery).inSingletonScope();
kernel.bind<RegionKernelQuery>(Type.RegionKernelQuery).to(RegionKernelQuery).inSingletonScope();
kernel.bind<StatsKernelQuery>(Type.StatsKernelQuery).to(StatsKernelQuery).inSingletonScope();
kernel.bind<AccountMySQLQuery>(Type.AccountMySQLQuery).to(AccountMySQLQuery).inSingletonScope();
kernel.bind<LanguageMySQLQuery>(Type.LanguageMySQLQuery).to(LanguageMySQLQuery).inSingletonScope();
kernel.bind<RegionMySQLQuery>(Type.RegionMySQLQuery).to(RegionMySQLQuery).inSingletonScope();
kernel.bind<StatsItemMySQLQuery>(Type.StatsItemMySQLQuery).to(StatsItemMySQLQuery).inSingletonScope();
kernel.bind<StatsOutlineMySQLQuery>(Type.StatsOutlineMySQLQuery).to(StatsOutlineMySQLQuery).inSingletonScope();
kernel.bind<StatsValueMySQLQuery>(Type.StatsValueMySQLQuery).to(StatsValueMySQLQuery).inSingletonScope();
kernel.bind<LanguageRedisQuery>(Type.LanguageRedisQuery).to(LanguageRedisQuery).inSingletonScope();
kernel.bind<RegionRedisQuery>(Type.RegionRedisQuery).to(RegionRedisQuery).inSingletonScope();
