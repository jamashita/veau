import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware, EpicMiddleware } from 'redux-observable';

import { Type } from '../Container/Types';
import { vault } from '../Container/Vault';
import { VeauAction } from './Action';
import { RootEpic } from './Epic/RootEpic';
import { history } from './history';
import { reducers } from './Reducer/Reducer';
import { State } from './State';

const logger: Middleware = createLogger({
  diff: true,
  collapsed: true
});
const router: Middleware = routerMiddleware(history);
const epic: EpicMiddleware<VeauAction, VeauAction, State> = createEpicMiddleware<VeauAction, VeauAction, State>();

export const store: Store = createStore(reducers, applyMiddleware(epic, logger, router));

const rootEpic: RootEpic = vault.get<RootEpic>(Type.RootEpic);

epic.run(rootEpic.init());
