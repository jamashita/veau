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
import { IdentityBinQuery } from '../repository/query/bin/IdentityBinQuery';
import { LanguageBinQuery } from '../repository/query/bin/LanguageBinQuery';
import { LocaleBinQuery } from '../repository/query/bin/LocaleBinQuery';
import { RegionBinQuery } from '../repository/query/bin/RegionBinQuery';
import { StatsListItemBinQuery } from '../repository/query/bin/StatsListItemBinQuery';
import { LocaleFetchQuery } from '../repository/query/fetch/LocaleFetchQuery';
import { StatsFetchQuery } from '../repository/query/fetch/StatsFetchQuery';
import { StatsOutlineFetchQuery } from '../repository/query/fetch/StatsOutlineFetchQuery';
import { VeauAccountFetchQuery } from '../repository/query/fetch/VeauAccountFetchQuery';
import { LocaleHeapQuery } from '../repository/query/heap/LocaleHeapQuery';
import { TermHeapQuery } from '../repository/query/heap/TermHeapQuery';
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
