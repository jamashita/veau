import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { TYPE } from './container/Types';
import { container } from './DIContainer';
import { history } from './history';
import { reducers } from './reducers/reducer';
import { RootSaga } from './sagas/RootSaga';

const saga: SagaMiddleware = createSagaMiddleware();
const logger: Middleware = createLogger({
  diff: true,
  collapsed: true
});
const router: Middleware = routerMiddleware(history);

export const store: Store = createStore(
  reducers,
  applyMiddleware(saga, logger, router)
);

const rootSaga: RootSaga = container.get<RootSaga>(TYPE.RootSaga);

saga.run(rootSaga.init);
