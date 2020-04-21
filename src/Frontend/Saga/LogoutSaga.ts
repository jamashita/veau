import { SagaIterator } from '@redux-saga/types';
import { inject, injectable } from 'inversify';
import { all, call, fork, put, take } from 'redux-saga/effects';
import { ISessionCommand } from '../../Command/Interface/ISessionCommand';
import { TYPE } from '../../Container/Types';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { ACTION } from '../Action/Action';
import { initializeIdentity } from '../Action/IdentityAction';
import { closeProvider } from '../Action/PageProviderAction';
import { pushToEntrance } from '../Action/RedirectAction';

@injectable()
export class LogoutSaga {
  private readonly sessionCommand: ISessionCommand;

  public constructor(@inject(TYPE.SessionAJAXCommand) sessionCommand: ISessionCommand) {
    this.sessionCommand = sessionCommand;
  }

  public *init(): IterableIterator<unknown> {
    yield fork(this.logout);
  }

  private *logout(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.LOGOUT);

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