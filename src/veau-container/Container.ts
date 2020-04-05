import { Container } from 'inversify';
import { LanguageCommand } from '../veau-command/LanguageCommand';
import { RegionCommand } from '../veau-command/RegionCommand';
import { AuthenticationMiddleware } from '../veau-controller/middlewares/AuthenticationMiddleware';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { Redis } from '../veau-general/Redis/Redis';
import { veauMySQL } from '../veau-infrastructure/VeauMySQL';
import { veauRedis } from '../veau-infrastructure/VeauRedis';
import { AuthenticationInteractor } from '../veau-interactor/AuthenticationInteractor';
import { LocaleInteractor } from '../veau-interactor/LocaleInteractor';
import { StatsInteractor } from '../veau-interactor/StatsInteractor';
import { AccountQuery } from '../veau-query/AccountQuery';
import { LanguageQuery } from '../veau-query/LanguageQuery';
import { LanguageQuery as LanguageMySQLQuery } from '../veau-query/MySQL/LanguageQuery';
import { RegionQuery as RegionMySQLQuery } from '../veau-query/MySQL/RegionQuery';
import { LanguageQuery as LanguageRedisQuery } from '../veau-query/Redis/LanguageQuery';
import { RegionQuery as RegionRedisQuery } from '../veau-query/Redis/RegionQuery';
import { RegionQuery } from '../veau-query/RegionQuery';
import { StatsItemQuery } from '../veau-query/StatsItemQuery';
import { StatsOutlineQuery } from '../veau-query/StatsOutlineQuery';
import { StatsQuery } from '../veau-query/StatsQuery';
import { StatsValueQuery } from '../veau-query/StatsValueQuery';
import { TYPE } from './Types';

export const container: Container = new Container();

container.bind<LanguageCommand>(TYPE.LanguageCommand).to(LanguageCommand).inSingletonScope();
container.bind<RegionCommand>(TYPE.RegionCommand).to(RegionCommand).inSingletonScope();
container.bind<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware).to(AuthenticationMiddleware).inSingletonScope();
container.bind<MySQL>(TYPE.MySQL).toConstantValue(veauMySQL);
container.bind<Redis>(TYPE.Redis).toConstantValue(veauRedis);
container.bind<AuthenticationInteractor>(TYPE.AuthenticationInteractor).to(AuthenticationInteractor).inSingletonScope();
container.bind<LocaleInteractor>(TYPE.LocaleInteractor).to(LocaleInteractor).inSingletonScope();
container.bind<StatsInteractor>(TYPE.StatsInteractor).to(StatsInteractor).inSingletonScope();
container.bind<AccountQuery>(TYPE.AccountQuery).to(AccountQuery).inSingletonScope();
container.bind<LanguageQuery>(TYPE.LanguageQuery).to(LanguageQuery).inSingletonScope();
container.bind<LanguageMySQLQuery>(TYPE.LanguageMySQLQuery).to(LanguageMySQLQuery).inSingletonScope();
container.bind<RegionMySQLQuery>(TYPE.RegionMySQLQuery).to(RegionMySQLQuery).inSingletonScope();
container.bind<LanguageRedisQuery>(TYPE.LanguageRedisQuery).to(LanguageRedisQuery).inSingletonScope();
container.bind<RegionRedisQuery>(TYPE.RegionRedisQuery).to(RegionRedisQuery).inSingletonScope();
container.bind<RegionQuery>(TYPE.RegionQuery).to(RegionQuery).inSingletonScope();
container.bind<StatsItemQuery>(TYPE.StatsItemQuery).to(StatsItemQuery).inSingletonScope();
container.bind<StatsOutlineQuery>(TYPE.StatsOutlineQuery).to(StatsOutlineQuery).inSingletonScope();
container.bind<StatsQuery>(TYPE.StatsQuery).to(StatsQuery).inSingletonScope();
container.bind<StatsValueQuery>(TYPE.StatsValueQuery).to(StatsValueQuery).inSingletonScope();
