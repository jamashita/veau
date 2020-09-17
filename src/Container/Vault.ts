import { AJAX, IAJAX } from '@jamashita/publikum-ajax';
import { ICache } from '@jamashita/publikum-cache';
import { Container } from 'inversify';
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
import { StatsOutlineQuery as StatsOutlineAJAXQuery } from '../Query/AJAX/StatsOutlineQuery';
import { StatsQuery as StatsAJAXQuery } from '../Query/AJAX/StatsQuery';
import { VeauAccountQuery as VeauAccountAJAXQuery } from '../Query/AJAX/VeauAccountQuery';
import { LocaleQuery as LocaleCacheQuery } from '../Query/Cache/LocaleQuery';
import { TermQuery as TermCacheQuery } from '../Query/Cache/TermQuery';
import { IdentityQuery as IdentityVaultQuery } from '../Query/Vault/IdentityQuery';
import { LanguageQuery as LanguageVaultQuery } from '../Query/Vault/LanguageQuery';
import { LocaleQuery as LocaleVaultQuery } from '../Query/Vault/LocaleQuery';
import { RegionQuery as RegionVaultQuery } from '../Query/Vault/RegionQuery';
import { StatsListItemQuery as StatsListItemVaultQuery } from '../Query/Vault/StatsListItemQuery';
import { Type } from './Types';

const v: Container = new Container();

// Infrastructure
v.bind<IAJAX<'json'>>(Type.AJAX).toConstantValue(new AJAX<'json'>('json'));
v.bind<ICache>(Type.Cache).toConstantValue(veauCache);

// Command
v.bind<SessionAJAXCommand>(Type.SessionAJAXCommand).to(SessionAJAXCommand).inSingletonScope();
v.bind<StatsAJAXCommand>(Type.StatsAJAXCommand).to(StatsAJAXCommand).inSingletonScope();
v.bind<LocaleCacheCommand>(Type.LocaleCacheCommand).to(LocaleCacheCommand).inSingletonScope();

// Epic
v.bind<EntranceEpic>(Type.EntranceEpic).to(EntranceEpic).inSingletonScope();
v.bind<IdentityEpic>(Type.IdentityEpic).to(IdentityEpic).inSingletonScope();
v.bind<LogoutEpic>(Type.LogoutEpic).to(LogoutEpic).inSingletonScope();
v.bind<RedirectEpic>(Type.RedirectEpic).to(RedirectEpic).inSingletonScope();
v.bind<RootEpic>(Type.RootEpic).to(RootEpic).inSingletonScope();
v.bind<StatsEditEpic>(Type.StatsEditEpic).to(StatsEditEpic).inSingletonScope();
v.bind<StatsListEpic>(Type.StatsListEpic).to(StatsListEpic).inSingletonScope();

// Query
v.bind<LocaleAJAXQuery>(Type.LocaleAJAXQuery).to(LocaleAJAXQuery).inSingletonScope();
v.bind<StatsOutlineAJAXQuery>(Type.StatsOutlineAJAXQuery).to(StatsOutlineAJAXQuery).inSingletonScope();
v.bind<StatsAJAXQuery>(Type.StatsAJAXQuery).to(StatsAJAXQuery).inSingletonScope();
v.bind<VeauAccountAJAXQuery>(Type.VeauAccountAJAXQuery).to(VeauAccountAJAXQuery).inSingletonScope();
v.bind<LocaleCacheQuery>(Type.LocaleCacheQuery).to(LocaleCacheQuery).inSingletonScope();
v.bind<TermCacheQuery>(Type.TermCacheQuery).to(TermCacheQuery).inSingletonScope();
v.bind<IdentityVaultQuery>(Type.IdentityVaultQuery).to(IdentityVaultQuery).inSingletonScope();
v.bind<LanguageVaultQuery>(Type.LanguageVaultQuery).to(LanguageVaultQuery).inSingletonScope();
v.bind<LocaleVaultQuery>(Type.LocaleVaultQuery).to(LocaleVaultQuery).inSingletonScope();
v.bind<RegionVaultQuery>(Type.RegionVaultQuery).to(RegionVaultQuery).inSingletonScope();
v.bind<StatsListItemVaultQuery>(Type.StatsListItemVaultQuery).to(StatsListItemVaultQuery).inSingletonScope();

export const vault: Container = v;
