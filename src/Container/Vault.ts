import { Container } from 'inversify';

import { AJAX, IAJAX } from '@jamashita/publikum-ajax';
import { ICache } from '@jamashita/publikum-cache';

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

export const vault: Container = new Container();

// Gateway
vault.bind<IAJAX>(Type.AJAX).toConstantValue(new AJAX());
vault.bind<ICache>(Type.Cache).toConstantValue(veauCache);

// Command
vault.bind<SessionAJAXCommand>(Type.SessionAJAXCommand).to(SessionAJAXCommand).inSingletonScope();
vault.bind<StatsAJAXCommand>(Type.StatsAJAXCommand).to(StatsAJAXCommand).inSingletonScope();
vault.bind<LocaleCacheCommand>(Type.LocaleCacheCommand).to(LocaleCacheCommand).inSingletonScope();

// Epic
vault.bind<EntranceEpic>(Type.EntranceEpic).to(EntranceEpic).inSingletonScope();
vault.bind<IdentityEpic>(Type.IdentityEpic).to(IdentityEpic).inSingletonScope();
vault.bind<LogoutEpic>(Type.LogoutEpic).to(LogoutEpic).inSingletonScope();
vault.bind<RedirectEpic>(Type.RedirectEpic).to(RedirectEpic).inSingletonScope();
vault.bind<RootEpic>(Type.RootEpic).to(RootEpic).inSingletonScope();
vault.bind<StatsEditEpic>(Type.StatsEditEpic).to(StatsEditEpic).inSingletonScope();
vault.bind<StatsListEpic>(Type.StatsListEpic).to(StatsListEpic).inSingletonScope();

// Query
vault.bind<LocaleAJAXQuery>(Type.LocaleAJAXQuery).to(LocaleAJAXQuery).inSingletonScope();
vault.bind<StatsOutlineAJAXQuery>(Type.StatsOutlineAJAXQuery).to(StatsOutlineAJAXQuery).inSingletonScope();
vault.bind<StatsAJAXQuery>(Type.StatsAJAXQuery).to(StatsAJAXQuery).inSingletonScope();
vault.bind<VeauAccountAJAXQuery>(Type.VeauAccountAJAXQuery).to(VeauAccountAJAXQuery).inSingletonScope();
vault.bind<LocaleCacheQuery>(Type.LocaleCacheQuery).to(LocaleCacheQuery).inSingletonScope();
vault.bind<TermCacheQuery>(Type.TermCacheQuery).to(TermCacheQuery).inSingletonScope();
vault.bind<IdentityVaultQuery>(Type.IdentityVaultQuery).to(IdentityVaultQuery).inSingletonScope();
vault.bind<LanguageVaultQuery>(Type.LanguageVaultQuery).to(LanguageVaultQuery).inSingletonScope();
vault.bind<LocaleVaultQuery>(Type.LocaleVaultQuery).to(LocaleVaultQuery).inSingletonScope();
vault.bind<RegionVaultQuery>(Type.RegionVaultQuery).to(RegionVaultQuery).inSingletonScope();
vault.bind<StatsListItemVaultQuery>(Type.StatsListItemVaultQuery).to(StatsListItemVaultQuery).inSingletonScope();
