import { SagaIterator } from '@redux-saga/types';
import { all, call, fork, put, take } from 'redux-saga/effects';
import { AJAXError } from '../../veau-error/AJAXError';
import { Try } from '../../veau-general/Try/Try';
import { ACTION } from '../actions/Action';
import { initializeIdentity } from '../actions/IdentityAction';
import { closeProvider } from '../actions/PageProviderAction';
import { pushToEntrance } from '../actions/RedirectAction';
import { SessionCommand } from '../commands/SessionCommand';

export class LogoutSaga {
  private sessionCommand: SessionCommand;

  public constructor(sessionCommand: SessionCommand) {
    this.sessionCommand = sessionCommand;
  }

  public *init(): IterableIterator<unknown> {
    yield fork(this.logout);
  }

  private *logout(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.LOGOUT);

      yield call((): Promise<Try<void, AJAXError>> => {
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
