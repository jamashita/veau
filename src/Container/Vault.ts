import { Fetch, IFetch } from '@jamashita/catacombe-fetch';
import { IHeap } from '@jamashita/catacombe-heap';
import { Container } from 'inversify';
import { SessionCommand as SessionFetchCommand } from '../Command/Fetch/SessionCommand';
import { StatsCommand as StatsFetchCommand } from '../Command/Fetch/StatsCommand';
import { LocaleCommand as LocaleHeapCommand } from '../Command/Heap/LocaleCommand';
import { EntranceEpic } from '../Frontend/Epic/EntranceEpic';
import { IdentityEpic } from '../Frontend/Epic/IdentityEpic';
import { LogoutEpic } from '../Frontend/Epic/LogoutEpic';
import { RedirectEpic } from '../Frontend/Epic/RedirectEpic';
import { RootEpic } from '../Frontend/Epic/RootEpic';
import { StatsEditEpic } from '../Frontend/Epic/StatsEditEpic';
import { StatsListEpic } from '../Frontend/Epic/StatsListEpic';
import { veauHeap } from '../Infrastructure/VeauCache';
import { LocaleQuery as LocaleFetchQuery } from '../Query/Fetch/LocaleQuery';
import { LocaleQuery as LocaleHeapQuery } from '../Query/Heap/LocaleQuery';
import { TermQuery as TermHeapQuery } from '../Query/Heap/TermQuery';
import { IdentityQuery as IdentityVaultQuery } from '../Query/Vault/IdentityQuery';
import { LanguageQuery as LanguageVaultQuery } from '../Query/Vault/LanguageQuery';
import { LocaleQuery as LocaleVaultQuery } from '../Query/Vault/LocaleQuery';
import { RegionQuery as RegionVaultQuery } from '../Query/Vault/RegionQuery';
import { StatsListItemQuery as StatsListItemVaultQuery } from '../Query/Vault/StatsListItemQuery';
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
