import { fork, put, take } from 'redux-saga/effects';
import { ACTION } from '../actions/Action';
import { initializeIdentity } from '../actions/IdentityAction';
import { closeProvider } from '../actions/PageProviderAction';
import { pushToEntrance } from '../actions/RedirectAction';
import { SessionCommand } from '../commands/SessionCommand';

const sessionCommand: SessionCommand = SessionCommand.getInstance();

export class LogoutSaga {

  public static *init(): IterableIterator<any> {
    yield fork(LogoutSaga.logout);
  }

  private static *logout(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.LOGOUT);

      try {
        yield sessionCommand.delete();

        yield put(initializeIdentity());
        yield put(closeProvider());
        yield put(pushToEntrance());
      }
      catch (err) {
        // NOOP
      }
    }
  }

  private constructor() {
  }
}
