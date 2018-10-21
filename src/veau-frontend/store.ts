import {
  applyMiddleware,
  createStore
} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from 'redux-persist';
import {reducers} from './reducers';
// import {Root} from './sagas/Root';
import {history} from './history';

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

// saga.run(Root.init);

export const persistor = persistStore(created);
export const store = created;

