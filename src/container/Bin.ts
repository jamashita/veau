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
import { SessionCommand as SessionFetchCommand } from '../repository/command/fetch/SessionCommand';
import { StatsCommand as StatsFetchCommand } from '../repository/command/fetch/StatsCommand';
import { LocaleCommand as LocaleHeapCommand } from '../repository/command/heap/LocaleCommand';
import { IdentityQuery as IdentityBinQuery } from '../repository/query/bin/IdentityQuery';
import { LanguageQuery as LanguageBinQuery } from '../repository/query/bin/LanguageQuery';
import { LocaleQuery as LocaleBinQuery } from '../repository/query/bin/LocaleQuery';
import { RegionQuery as RegionBinQuery } from '../repository/query/bin/RegionQuery';
import { StatsListItemQuery as StatsListItemBinQuery } from '../repository/query/bin/StatsListItemQuery';
import { LocaleQuery as LocaleFetchQuery } from '../repository/query/fetch/LocaleQuery';
import { StatsOutlineQuery as StatsOutlineFetchQuery } from '../repository/query/fetch/StatsOutlineQuery';
import { StatsQuery as StatsFetchQuery } from '../repository/query/fetch/StatsQuery';
import { VeauAccountQuery as VeauAccountFetchQuery } from '../repository/query/fetch/VeauAccountQuery';
import { LocaleQuery as LocaleHeapQuery } from '../repository/query/heap/LocaleQuery';
import { TermQuery as TermHeapQuery } from '../repository/query/heap/TermQuery';
import { Type } from './Types';

const container: Container = new Container();

// Infrastructure
container.bind<IFetch<'json'>>(Type.Fetch).toConstantValue(new Fetch<'json'>('json'));
container.bind<IHeap>(Type.Heap).toConstantValue(veauHeap);

// Command
container.bind<SessionFetchCommand>(Type.SessionFetchCommand).to(SessionFetchCommand).inSingletonScope();
container.bind<StatsFetchCommand>(Type.StatsFetchCommand).to(StatsFetchCommand).inSingletonScope();
container.bind<LocaleHeapCommand>(Type.LocaleHeapCommand).to(LocaleHeapCommand).inSingletonScope();

// Epic
container.bind<EntranceEpic>(Type.EntranceEpic).to(EntranceEpic).inSingletonScope();
container.bind<IdentityEpic>(Type.IdentityEpic).to(IdentityEpic).inSingletonScope();
container.bind<LogoutEpic>(Type.LogoutEpic).to(LogoutEpic).inSingletonScope();
container.bind<RedirectEpic>(Type.RedirectEpic).to(RedirectEpic).inSingletonScope();
container.bind<RootEpic>(Type.RootEpic).to(RootEpic).inSingletonScope();
container.bind<StatsEditEpic>(Type.StatsEditEpic).to(StatsEditEpic).inSingletonScope();
container.bind<StatsListEpic>(Type.StatsListEpic).to(StatsListEpic).inSingletonScope();

// Query
container.bind<LocaleFetchQuery>(Type.LocaleFetchQuery).to(LocaleFetchQuery).inSingletonScope();
container.bind<StatsOutlineFetchQuery>(Type.StatsOutlineFetchQuery).to(StatsOutlineFetchQuery).inSingletonScope();
container.bind<StatsFetchQuery>(Type.StatsFetchQuery).to(StatsFetchQuery).inSingletonScope();
container.bind<VeauAccountFetchQuery>(Type.VeauAccountFetchQuery).to(VeauAccountFetchQuery).inSingletonScope();
container.bind<LocaleHeapQuery>(Type.LocaleHeapQuery).to(LocaleHeapQuery).inSingletonScope();
container.bind<TermHeapQuery>(Type.TermHeapQuery).to(TermHeapQuery).inSingletonScope();
container.bind<IdentityBinQuery>(Type.IdentityBinQuery).to(IdentityBinQuery).inSingletonScope();
container.bind<LanguageBinQuery>(Type.LanguageBinQuery).to(LanguageBinQuery).inSingletonScope();
container.bind<LocaleBinQuery>(Type.LocaleBinQuery).to(LocaleBinQuery).inSingletonScope();
container.bind<RegionBinQuery>(Type.RegionBinQuery).to(RegionBinQuery).inSingletonScope();
container.bind<StatsListItemBinQuery>(Type.StatsListItemBinQuery).to(StatsListItemBinQuery).inSingletonScope();

export const bin: Container = container;
