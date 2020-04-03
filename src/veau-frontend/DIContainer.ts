import { SessionCommand } from './commands/SessionCommand';
import { StatsCommand } from './commands/StatsCommand';
import { Container } from './container/Container';
import { TYPE } from './container/Types';
import { LocaleQuery } from './queries/LocaleQuery';
import { SessionQuery } from './queries/SessionQuery';
import { StatsQuery } from './queries/StatsQuery';
import { EntranceSaga } from './sagas/EntranceSaga';
import { IdentitySaga } from './sagas/IdentitySaga';
import { LogoutSaga } from './sagas/LogoutSaga';
import { RedirectSaga } from './sagas/RedirectSaga';
import { RootSaga } from './sagas/RootSaga';
import { StatsEditSaga } from './sagas/StatsEditSaga';
import { StatsListSaga } from './sagas/StatsListSaga';

export const container: Container = new Container();

const sessionCommand: SessionCommand = new SessionCommand();
const statsCommand: StatsCommand = new StatsCommand();
const localeQuery: LocaleQuery = new LocaleQuery();
const sessionQuery: SessionQuery = new SessionQuery();
const statsQuery: StatsQuery = new StatsQuery();
const entranceSaga: EntranceSaga = new EntranceSaga(sessionQuery);
const identitySaga: IdentitySaga = new IdentitySaga(sessionQuery, localeQuery);
const logoutSaga: LogoutSaga = new LogoutSaga(sessionCommand);
const redirectSaga: RedirectSaga = new RedirectSaga();
const statsEditSaga: StatsEditSaga = new StatsEditSaga(statsCommand, statsQuery, localeQuery);
const statsListSaga: StatsListSaga = new StatsListSaga(statsCommand, statsQuery, localeQuery);
const rootSaga: RootSaga = new RootSaga(entranceSaga, identitySaga, logoutSaga, redirectSaga, statsEditSaga, statsListSaga);

container.bind(TYPE.SessionCommand, sessionCommand);
container.bind(TYPE.StatsCommand, statsCommand);
container.bind(TYPE.LocaleQuery, localeQuery);
container.bind(TYPE.SessionQuery, sessionQuery);
container.bind(TYPE.StatsQuery, statsQuery);
container.bind(TYPE.RootSaga, rootSaga);
