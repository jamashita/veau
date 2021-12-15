import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware, EpicMiddleware } from 'redux-observable';
import { bin } from '../container/Bin';
import { Type } from '../container/Types';
import { VeauAction } from './Action';
import { onload } from './ActionCreator/OnLoadActionCreator';
import { RootEpic } from './Epic/RootEpic';
import { history } from './History';
import { reducers } from './Reducer/Reducer';
import { State } from './State';

const logger: Middleware = createLogger({
  diff: true,
  collapsed: true
});
const router: Middleware = routerMiddleware(history);
const epic: EpicMiddleware<VeauAction, VeauAction, State> = createEpicMiddleware<VeauAction, VeauAction, State>();
const s: Store = createStore(reducers, applyMiddleware(epic, logger, router));
const rootEpic: RootEpic = bin.get<RootEpic>(Type.RootEpic);

epic.run(rootEpic.init());
s.dispatch(onload());

export const store: Store = s;
