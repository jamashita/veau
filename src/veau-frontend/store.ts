import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, createStore, Reducer, Store } from 'redux';
import { createLogger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistConfig, Persistor } from 'redux-persist/es/types';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { history } from './history';
import { reducers } from './reducers/reducer';
import { Root } from './sagas/Root';

const saga: SagaMiddleware<object> = createSagaMiddleware();

const persistConfig: PersistConfig = {
  key: 'BPVZglB7RzMZSHQL0ZaXcH7n4BYof8Xg',
  storage,
  whitelist: []
};

const persistedReducer: Reducer = persistReducer(persistConfig, reducers);

export const store: Store = createStore(
  persistedReducer,
  applyMiddleware(saga, createLogger(), routerMiddleware(history))
);

saga.run(Root.init);

export const persistor: Persistor = persistStore(store);

