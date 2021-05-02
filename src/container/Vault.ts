import { Fetch, IFetch } from '@jamashita/catacombe-fetch';
import { IHeap } from '@jamashita/catacombe-heap';
import { Container } from 'inversify';
import { EntranceEpic } from '../frontend/Epic/EntranceEpic';
import { IdentityEpic } from '../frontend/Epic/IdentityEpic';
import { LogoutEpic } from '../frontend/Epic/LogoutEpic';
import { RedirectEpic } from '../frontend/Epic/RedirectEpic';
import { RootEpic } from '../frontend/Epic/RootEpic';
import { StatsEditEpic } from '../frontend/Epic/StatsEditEpic';
import { StatsListEpic } from '../frontend/Epic/StatsListEpic';
import { veauHeap } from '../infrastructure/VeauHeap';
import { SessionCommand as SessionFetchCommand } from '../repository/command/Fetch/SessionCommand';
import { StatsCommand as StatsFetchCommand } from '../repository/command/Fetch/StatsCommand';
import { LocaleCommand as LocaleHeapCommand } from '../repository/command/Heap/LocaleCommand';
import { LocaleQuery as LocaleFetchQuery } from '../repository/query/Fetch/LocaleQuery';
import { StatsOutlineQuery as StatsOutlineFetchQuery } from '../repository/query/Fetch/StatsOutlineQuery';
import { StatsQuery as StatsFetchQuery } from '../repository/query/Fetch/StatsQuery';
import { VeauAccountQuery as VeauAccountFetchQuery } from '../repository/query/Fetch/VeauAccountQuery';
import { LocaleQuery as LocaleHeapQuery } from '../repository/query/Heap/LocaleQuery';
import { TermQuery as TermHeapQuery } from '../repository/query/Heap/TermQuery';
import { IdentityQuery as IdentityVaultQuery } from '../repository/query/Vault/IdentityQuery';
import { LanguageQuery as LanguageVaultQuery } from '../repository/query/Vault/LanguageQuery';
import { LocaleQuery as LocaleVaultQuery } from '../repository/query/Vault/LocaleQuery';
import { RegionQuery as RegionVaultQuery } from '../repository/query/Vault/RegionQuery';
import { StatsListItemQuery as StatsListItemVaultQuery } from '../repository/query/Vault/StatsListItemQuery';
import { Type } from './Types';

const v: Container = new Container();

// Infrastructure
v.bind<IFetch<'json'>>(Type.Fetch).toConstantValue(new Fetch<'json'>('json'));
v.bind<IHeap>(Type.Heap).toConstantValue(veauHeap);

// Command
v.bind<SessionFetchCommand>(Type.SessionFetchCommand).to(SessionFetchCommand).inSingletonScope();
v.bind<StatsFetchCommand>(Type.StatsFetchCommand).to(StatsFetchCommand).inSingletonScope();
v.bind<LocaleHeapCommand>(Type.LocaleHeapCommand).to(LocaleHeapCommand).inSingletonScope();

// Epic
v.bind<EntranceEpic>(Type.EntranceEpic).to(EntranceEpic).inSingletonScope();
v.bind<IdentityEpic>(Type.IdentityEpic).to(IdentityEpic).inSingletonScope();
v.bind<LogoutEpic>(Type.LogoutEpic).to(LogoutEpic).inSingletonScope();
v.bind<RedirectEpic>(Type.RedirectEpic).to(RedirectEpic).inSingletonScope();
v.bind<RootEpic>(Type.RootEpic).to(RootEpic).inSingletonScope();
v.bind<StatsEditEpic>(Type.StatsEditEpic).to(StatsEditEpic).inSingletonScope();
v.bind<StatsListEpic>(Type.StatsListEpic).to(StatsListEpic).inSingletonScope();

// Query
v.bind<LocaleFetchQuery>(Type.LocaleFetchQuery).to(LocaleFetchQuery).inSingletonScope();
v.bind<StatsOutlineFetchQuery>(Type.StatsOutlineFetchQuery).to(StatsOutlineFetchQuery).inSingletonScope();
v.bind<StatsFetchQuery>(Type.StatsFetchQuery).to(StatsFetchQuery).inSingletonScope();
v.bind<VeauAccountFetchQuery>(Type.VeauAccountFetchQuery).to(VeauAccountFetchQuery).inSingletonScope();
v.bind<LocaleHeapQuery>(Type.LocaleHeapQuery).to(LocaleHeapQuery).inSingletonScope();
v.bind<TermHeapQuery>(Type.TermHeapQuery).to(TermHeapQuery).inSingletonScope();
v.bind<IdentityVaultQuery>(Type.IdentityVaultQuery).to(IdentityVaultQuery).inSingletonScope();
v.bind<LanguageVaultQuery>(Type.LanguageVaultQuery).to(LanguageVaultQuery).inSingletonScope();
v.bind<LocaleVaultQuery>(Type.LocaleVaultQuery).to(LocaleVaultQuery).inSingletonScope();
v.bind<RegionVaultQuery>(Type.RegionVaultQuery).to(RegionVaultQuery).inSingletonScope();
v.bind<StatsListItemVaultQuery>(Type.StatsListItemVaultQuery).to(StatsListItemVaultQuery).inSingletonScope();

export const vault: Container = v;
