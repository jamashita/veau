import { Container } from 'inversify';
import { LanguageCommand as LanguageRedisCommand } from '../Command/Redis/LanguageCommand';
import { RegionCommand as RegionRedisCommand } from '../Command/Redis/RegionCommand';
import { AuthenticationMiddleware } from '../Controller/middlewares/AuthenticationMiddleware';
import { MySQL } from '../General/MySQL/MySQL';
import { Redis } from '../General/Redis/Redis';
import { veauMySQL } from '../Infrastructure/VeauMySQL';
import { veauRedis } from '../Infrastructure/VeauRedis';
import { AuthenticationInteractor } from '../Interactor/AuthenticationInteractor';
import { LocaleInteractor } from '../Interactor/LocaleInteractor';
import { StatsInteractor } from '../Interactor/StatsInteractor';
import { LanguageQuery as LanguageKernelQuery } from '../Query/Kernel/LanguageQuery';
import { RegionQuery as RegionKernelQuery } from '../Query/Kernel/RegionQuery';
import { AccountQuery as AccountMySQLQuery } from '../Query/MySQL/AccountQuery';
import { LanguageQuery as LanguageMySQLQuery } from '../Query/MySQL/LanguageQuery';
import { RegionQuery as RegionMySQLQuery } from '../Query/MySQL/RegionQuery';
import { StatsItemQuery as StatsItemMySQLQuery } from '../Query/MySQL/StatsItemQuery';
import { StatsOutlineQuery as StatsOutlineMySQLQuery } from '../Query/MySQL/StatsOutlineQuery';
import { StatsQuery as StatsMySQLQuery } from '../Query/MySQL/StatsQuery';
import { StatsValueQuery as StatsValueMySQLQuery } from '../Query/MySQL/StatsValueQuery';
import { LanguageQuery as LanguageRedisQuery } from '../Query/Redis/LanguageQuery';
import { RegionQuery as RegionRedisQuery } from '../Query/Redis/RegionQuery';
import { TYPE } from './Types';

export const kernel: Container = new Container();

kernel.bind<LanguageRedisCommand>(TYPE.LanguageRedisCommand).to(LanguageRedisCommand).inSingletonScope();
kernel.bind<RegionRedisCommand>(TYPE.RegionRedisCommand).to(RegionRedisCommand).inSingletonScope();
kernel.bind<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware).to(AuthenticationMiddleware).inSingletonScope();
kernel.bind<MySQL>(TYPE.MySQL).toConstantValue(veauMySQL);
kernel.bind<Redis>(TYPE.Redis).toConstantValue(veauRedis);
kernel.bind<AuthenticationInteractor>(TYPE.AuthenticationInteractor).to(AuthenticationInteractor).inSingletonScope();
kernel.bind<LocaleInteractor>(TYPE.LocaleInteractor).to(LocaleInteractor).inSingletonScope();
kernel.bind<StatsInteractor>(TYPE.StatsInteractor).to(StatsInteractor).inSingletonScope();
kernel.bind<LanguageKernelQuery>(TYPE.LanguageKernelQuery).to(LanguageKernelQuery).inSingletonScope();
kernel.bind<RegionKernelQuery>(TYPE.RegionKernelQuery).to(RegionKernelQuery).inSingletonScope();
kernel.bind<AccountMySQLQuery>(TYPE.AccountMySQLQuery).to(AccountMySQLQuery).inSingletonScope();
kernel.bind<LanguageMySQLQuery>(TYPE.LanguageMySQLQuery).to(LanguageMySQLQuery).inSingletonScope();
kernel.bind<RegionMySQLQuery>(TYPE.RegionMySQLQuery).to(RegionMySQLQuery).inSingletonScope();
kernel.bind<StatsItemMySQLQuery>(TYPE.StatsItemMySQLQuery).to(StatsItemMySQLQuery).inSingletonScope();
kernel.bind<StatsOutlineMySQLQuery>(TYPE.StatsOutlineMySQLQuery).to(StatsOutlineMySQLQuery).inSingletonScope();
kernel.bind<StatsMySQLQuery>(TYPE.StatsMySQLQuery).to(StatsMySQLQuery).inSingletonScope();
kernel.bind<StatsValueMySQLQuery>(TYPE.StatsValueMySQLQuery).to(StatsValueMySQLQuery).inSingletonScope();
kernel.bind<LanguageRedisQuery>(TYPE.LanguageRedisQuery).to(LanguageRedisQuery).inSingletonScope();
kernel.bind<RegionRedisQuery>(TYPE.RegionRedisQuery).to(RegionRedisQuery).inSingletonScope();