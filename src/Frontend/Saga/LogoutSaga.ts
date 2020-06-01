/* eslint-disable */
// @ts-nocheck
import { DataSourceError, Superposition } from 'publikum';
import { SagaIterator } from 'redux-saga';
import { all, call, fork, put, take } from 'redux-saga/effects';

import { ISessionCommand } from '../../Command/Interface/ISessionCommand';
import { LOGOUT } from '../Action';
import { initializeIdentity } from '../ActionCreator/IdentityAction';
import { closeProvider } from '../ActionCreator/PageProviderAction';
import { pushToEntrance } from '../ActionCreator/RedirectAction';

export class LogoutSaga {
  private readonly sessionCommand: ISessionCommand;

  public constructor(sessionCommand: ISessionCommand) {
    this.sessionCommand = sessionCommand;
  }

  public *init(): IterableIterator<unknown> {
    yield fork(this.logout);
  }

  private *logout(): SagaIterator<unknown> {
    while (true) {
      yield take(LOGOUT);

      yield call(
        (): Promise<Superposition<void, DataSourceError>> => {
          return this.sessionCommand.delete();
        }
      );

      yield all([put(initializeIdentity()), put(closeProvider()), put(pushToEntrance())]);
    }
  }
}
