import { Container } from 'inversify';
import { LanguageCommand } from '../veau-command/LanguageCommand';
import { RegionCommand } from '../veau-command/RegionCommand';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { Redis } from '../veau-general/Redis/Redis';
import { veauMySQL } from '../veau-infrastructure/VeauMySQL';
import { veauRedis } from '../veau-infrastructure/VeauRedis';
import { AuthenticationInteractor } from '../veau-interactor/AuthenticationInteractor';
import { LocaleInteractor } from '../veau-interactor/LocaleInteractor';
import { StatsInteractor } from '../veau-interactor/StatsInteractor';
import { LanguageQuery } from '../veau-query/LanguageQuery';
import { RegionQuery } from '../veau-query/RegionQuery';
import { StatsItemQuery } from '../veau-query/StatsItemQuery';
import { StatsOutlineQuery } from '../veau-query/StatsOutlineQuery';
import { StatsQuery } from '../veau-query/StatsQuery';
import { StatsValueQuery } from '../veau-query/StatsValueQuery';
import { VeauAccountQuery } from '../veau-query/VeauAccountQuery';
import { TYPE } from './Types';

export const container: Container = new Container();

container.bind<MySQL>(TYPE.MySQL).toConstantValue(veauMySQL);
container.bind<Redis>(TYPE.Redis).toConstantValue(veauRedis);
container.bind<AuthenticationInteractor>(TYPE.AuthenticationInteractor).to(AuthenticationInteractor);
container.bind<LocaleInteractor>(TYPE.LocaleInteractor).to(LocaleInteractor);
container.bind<StatsInteractor>(TYPE.StatsInteractor).to(StatsInteractor);
container.bind<LanguageQuery>(TYPE.LanguageQuery).to(LanguageQuery);
container.bind<RegionQuery>(TYPE.RegionQuery).to(RegionQuery);
container.bind<StatsItemQuery>(TYPE.StatsItemQuery).to(StatsItemQuery);
container.bind<StatsOutlineQuery>(TYPE.StatsOutlineQuery).to(StatsOutlineQuery);
container.bind<StatsQuery>(TYPE.StatsQuery).to(StatsQuery);
container.bind<StatsValueQuery>(TYPE.StatsValueQuery).to(StatsValueQuery);
container.bind<VeauAccountQuery>(TYPE.VeauAccountQuery).to(VeauAccountQuery);
container.bind<LanguageCommand>(TYPE.LanguageCommand).to(LanguageCommand);
container.bind<RegionCommand>(TYPE.RegionCommand).to(RegionCommand);
