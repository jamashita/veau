import { fork, put, take } from 'redux-saga/effects';
import { ACTION } from '../actions/Action';
import { initializeIdentity } from '../actions/IdentityAction';
import { closeProvider } from '../actions/PageProviderAction';
import { pushToEntrance } from '../actions/RedirectAction';
import { ISessionCommand } from '../commands/interfaces/ISessionCommand';
import { SessionAJAXCommand } from '../commands/SessionAJAXCommand';

export class LogoutSaga {
  private static instance: LogoutSaga = new LogoutSaga();
  private static sessionCommand: ISessionCommand = SessionAJAXCommand.getInstance();

  public static getInstance(): LogoutSaga {
    return LogoutSaga.instance;
  }

  private constructor() {
  }

  public *init(): IterableIterator<any> {
    yield fork(this.logout);
  }

  private *logout(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.LOGOUT);

      try {
        yield LogoutSaga.sessionCommand.delete();

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
