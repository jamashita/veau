import { SagaIterator } from '@redux-saga/types';
import { all, call, fork, put, take } from 'redux-saga/effects';
import { ISessionCommand } from '../../Command/Interface/ISessionCommand';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { LOGOUT } from '../Action/Action';
import { initializeIdentity } from '../Action/IdentityAction';
import { closeProvider } from '../Action/PageProviderAction';
import { pushToEntrance } from '../Action/RedirectAction';

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

      yield call((): Promise<Superposition<void, DataSourceError>> => {
        return this.sessionCommand.delete();
      });

      yield all([
        put(initializeIdentity()),
        put(closeProvider()),
        put(pushToEntrance())
      ]);
    }
  }
}
