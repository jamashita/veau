import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware, EpicMiddleware } from 'redux-observable';
import { vault } from '../Container/Container';
import { TYPE } from '../Container/Types';
import { Action } from './actions/Action';
import { RootEpic } from './epics/RootEpis';
import { history } from './history';
import { reducers } from './reducers/reducer';
import { State } from './State';

const epic: EpicMiddleware<Action, Action, State> = createEpicMiddleware<Action, Action, State>();
const logger: Middleware = createLogger({
  diff: true,
  collapsed: true
});
const router: Middleware = routerMiddleware(history);

export const store: Store = createStore(
  reducers,
  applyMiddleware(epic, logger, router)
);

const rootEpic: RootEpic = vault.get<RootEpic>(TYPE.AccountMySQLQuery);

epic.run(rootEpic.init());
