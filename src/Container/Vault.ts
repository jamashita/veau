import { Container } from 'inversify';
import { AJAX } from 'publikum';
import { SessionCommand as SessionAJAXCommand } from '../Command/AJAX/SessionCommand';
import { StatsCommand as StatsAJAXCommand } from '../Command/AJAX/StatsCommand';
import { LocaleCommand as LocaleCacheCommand } from '../Command/Cache/LocaleCommand';
import { EntranceEpic } from '../Frontend/Epic/EntranceEpic';
import { IdentityEpic } from '../Frontend/Epic/IdentityEpic';
import { LogoutEpic } from '../Frontend/Epic/LogoutEpic';
import { RedirectEpic } from '../Frontend/Epic/RedirectEpic';
import { RootEpic } from '../Frontend/Epic/RootEpic';
import { StatsEditEpic } from '../Frontend/Epic/StatsEditEpic';
import { StatsListEpic } from '../Frontend/Epic/StatsListEpic';
import { veauCache } from '../Infrastructure/VeauCache';
import { LocaleQuery as LocaleAJAXQuery } from '../Query/AJAX/LocaleQuery';
import { SessionQuery as SessionAJAXQuery } from '../Query/AJAX/SessionQuery';
import { StatsOutlineQuery as StatsOutlineAJAXQuery } from '../Query/AJAX/StatsOutlineQuery';
import { StatsQuery as StatsAJAXQuery } from '../Query/AJAX/StatsQuery';
import { LocaleQuery as LocaleCacheQuery } from '../Query/Cache/LocaleQuery';
import { LanguageQuery as LanguageVaultQuery } from '../Query/Vault/LanguageQuery';
import { LocaleQuery as LocaleVaultQuery } from '../Query/Vault/LocaleQuery';
import { RegionQuery as RegionVaultQuery } from '../Query/Vault/RegionQuery';
import { TYPE } from './Types';

export const vault: Container = new Container();

vault.bind<AJAX>(TYPE.AJAX).toConstantValue(new AJAX());
vault.bind<Cache>(TYPE.Cache).toConstantValue(veauCache);
vault.bind<SessionAJAXCommand>(TYPE.SessionAJAXCommand).to(SessionAJAXCommand).inSingletonScope();
vault.bind<StatsAJAXCommand>(TYPE.StatsAJAXCommand).to(StatsAJAXCommand).inSingletonScope();
vault.bind<LocaleCacheCommand>(TYPE.LocaleCacheCommand).to(LocaleCacheCommand).inSingletonScope();
vault.bind<EntranceEpic>(TYPE.EntranceEpic).to(EntranceEpic).inSingletonScope();
vault.bind<IdentityEpic>(TYPE.IdentityEpic).to(IdentityEpic).inSingletonScope();
vault.bind<LogoutEpic>(TYPE.LogoutEpic).to(LogoutEpic).inSingletonScope();
vault.bind<RedirectEpic>(TYPE.RedirectEpic).to(RedirectEpic).inSingletonScope();
vault.bind<RootEpic>(TYPE.RootEpic).to(RootEpic).inSingletonScope();
vault.bind<StatsEditEpic>(TYPE.StatsEditEpic).to(StatsEditEpic).inSingletonScope();
vault.bind<StatsListEpic>(TYPE.StatsListEpic).to(StatsListEpic).inSingletonScope();
vault.bind<LocaleAJAXQuery>(TYPE.LocaleAJAXQuery).to(LocaleAJAXQuery).inSingletonScope();
vault.bind<SessionAJAXQuery>(TYPE.SessionAJAXQuery).to(SessionAJAXQuery).inSingletonScope();
vault.bind<StatsOutlineAJAXQuery>(TYPE.StatsOutlineAJAXQuery).to(StatsOutlineAJAXQuery).inSingletonScope();
vault.bind<StatsAJAXQuery>(TYPE.StatsAJAXQuery).to(StatsAJAXQuery).inSingletonScope();
vault.bind<LocaleCacheQuery>(TYPE.LocaleCacheQuery).to(LocaleCacheQuery).inSingletonScope();
vault.bind<LanguageVaultQuery>(TYPE.LanguageVaultQuery).to(LanguageVaultQuery).inSingletonScope();
vault.bind<LocaleVaultQuery>(TYPE.LocaleVaultQuery).to(LocaleVaultQuery).inSingletonScope();
vault.bind<RegionVaultQuery>(TYPE.RegionVaultQuery).to(RegionVaultQuery).inSingletonScope();
