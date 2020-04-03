import { SagaIterator } from '@redux-saga/types';
import { all, call, fork, put, take } from 'redux-saga/effects';
import { AJAXError } from '../../veau-error/AJAXError';
import { Try } from '../../veau-general/Try/Try';
import { ACTION } from '../actions/Action';
import { initializeIdentity } from '../actions/IdentityAction';
import { closeProvider } from '../actions/PageProviderAction';
import { pushToEntrance } from '../actions/RedirectAction';
import { SessionCommand } from '../commands/SessionCommand';

const sessionCommand: SessionCommand = SessionCommand.getInstance();

export class LogoutSaga {

  public static *init(): IterableIterator<unknown> {
    yield fork(LogoutSaga.logout);
  }

  private static *logout(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.LOGOUT);

      yield call((): Promise<Try<void, AJAXError>> => {
        return sessionCommand.delete();
      });

      yield all([
        put(initializeIdentity()),
        put(closeProvider()),
        put(pushToEntrance())
      ]);
    }
  }

  private constructor() {
  }
}
