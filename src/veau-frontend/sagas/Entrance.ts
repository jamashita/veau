import {fork, put, select, take} from 'redux-saga/effects';
import {ACTION, EntranceAccountNameTypedAction, EntrancePasswordTypedAction} from '../../declarations/Action';
import {State} from '../../declarations/State';
import {entranceLoginInfoUpdate} from '../actions/EntranceActions';
import {LoginFactory} from '../../veau-factory/LoginFactory';

export class Entrance {

  public static *init(): IterableIterator<any> {
    yield fork(Entrance.login);
    yield fork(Entrance.accountNameTyped);
    yield fork(Entrance.passwordTyped);
  }

  private static *login(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.IDENTITY_AUTHENTICATE);
    }
  }

  private static *accountNameTyped(): IterableIterator<any> {
    while (true) {
      const action: EntranceAccountNameTypedAction = yield take(ACTION.ENTRANCE_ACCOUNT_NAME_TYPED);
      const state: State = yield select();

      const {
        entrance: {
          login
        }
      } = state;

      const newLogin = LoginFactory.fromName(login, action.name);
      yield put(entranceLoginInfoUpdate(newLogin));
    }
  }

  private static *passwordTyped(): IterableIterator<any> {
    while (true) {
      const action: EntrancePasswordTypedAction = yield take(ACTION.ENTRANCE_PASSWORD_TYPED);
      const state: State = yield select();

      const {
        entrance: {
          login
        }
      } = state;

      const newLogin = LoginFactory.fromPassword(login, action.password);
      yield put(entranceLoginInfoUpdate(newLogin));
    }
  }
}
