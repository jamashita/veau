import { UNAUTHORIZED } from 'http-status';
import { call, fork, put, select, take } from 'redux-saga/effects';
import * as request from 'superagent';
import {
  ACTION,
  EntranceAccountNameTypedAction,
  EntrancePasswordTypedAction
} from '../../declarations/Action';
import { State } from '../../declarations/State';
import { VeauAccount, VeauAccountJSON } from '../../veau-entity/VeauAccount';
import { VeauAccountFactory } from '../../veau-factory/VeauAccountFactory';
import { AJAX } from '../../veau-general/AJAX';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';
import { entranceInformationUpdate } from '../actions/EntranceAction';
import { identified, identityAuthenticated } from '../actions/IdentityAction';
import { loaded, loading } from '../actions/LoadingAction';
import { raiseModal } from '../actions/ModalAction';
import { pushToStatsList } from '../actions/RedirectAction';

const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();

export class Entrance {

  public static *init(): IterableIterator<any> {
    yield fork(Entrance.login);
    yield fork(Entrance.accountNameTyped);
    yield fork(Entrance.passwordTyped);
  }

  private static *login(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.IDENTITY_AUTHENTICATE);
      const state: State = yield select();

      const {
        modal: {
          open
        },
        entranceInformation
      } = state;

      if (open) {
        continue;
      }
      if (!entranceInformation.isAcceptable()) {
        continue;
      }

      yield put(loading());

      try {
        const res: request.Response = yield call(AJAX.post, '/api/auth', entranceInformation.toJSON());
        const json: VeauAccountJSON = res.body;

        const veauAccount: VeauAccount = veauAccountFactory.fromJSON(json);

        yield put(identityAuthenticated(veauAccount));
        yield put(pushToStatsList());
        yield put(identified());
        yield put(loaded());
      }
      catch (err) {
        yield put(loaded());

        if (err.status === UNAUTHORIZED) {
          yield put(raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION'));
          continue;
        }

        yield put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
      }
    }
  }

  private static *accountNameTyped(): IterableIterator<any> {
    while (true) {
      const action: EntranceAccountNameTypedAction = yield take(ACTION.ENTRANCE_ACCOUNT_NAME_TYPED);
      const state: State = yield select();

      const {
        entranceInformation
      } = state;

      const newLogin: EntranceInformation = EntranceInformation.of(action.account, entranceInformation.getPassword());
      yield put(entranceInformationUpdate(newLogin));
    }
  }

  private static *passwordTyped(): IterableIterator<any> {
    while (true) {
      const action: EntrancePasswordTypedAction = yield take(ACTION.ENTRANCE_PASSWORD_TYPED);
      const state: State = yield select();

      const {
        entranceInformation
      } = state;

      const newLogin: EntranceInformation = EntranceInformation.of(entranceInformation.getAccount(), action.password);
      yield put(entranceInformationUpdate(newLogin));
    }
  }
}
