import {routerMiddleware} from 'connected-react-router';
import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import {history} from './history';
import {reducers} from './reducers/reducer';
import {Root} from './sagas/Root';

const saga = createSagaMiddleware();

const persistConfig = {
  key: 'BPVZglB7RzMZSHQL0ZaXcH7n4BYof8Xg',
  storage,
  whitelist: ['identity']
};

const persistedReducer = persistReducer(persistConfig, reducers);

const created = createStore(
  persistedReducer,
  applyMiddleware(saga, createLogger(), routerMiddleware(history))
);

saga.run(Root.init);

export const persistor = persistStore(created);
export const store = created;

