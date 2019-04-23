import { call, fork, put, take } from 'redux-saga/effects';
import { ISessionCommand } from '../commands/interfaces/ISessionCommand';
import { SessionAJAXCommand } from '../commands/SessionAJAXCommand';
import { ACTION } from '../actions/Action';
import { initializeIdentity } from '../actions/IdentityAction';
import { closeProvider } from '../actions/PageProviderAction';
import { pushToEntrance } from '../actions/RedirectAction';

export class Logout {
  private static sessionCommand: ISessionCommand = SessionAJAXCommand.getInstance();

  public static *init(): IterableIterator<any> {
    yield fork(Logout.logout);
  }

  private static *logout(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.LOGOUT);

      try {
        yield call(Logout.sessionCommand.delete);

        yield put(initializeIdentity());
        yield put(closeProvider());
        yield put(pushToEntrance());
      }
      catch (err) {
        // NOOP
      }
    }
  }
}
