import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { history } from './history';
import { reducers } from './reducers/reducer';
import { Root } from './sagas/Root';

const saga: SagaMiddleware<object> = createSagaMiddleware();

export const store: Store = createStore(
  reducers,
  applyMiddleware(saga, createLogger(), routerMiddleware(history))
);

saga.run(Root.init);
