import { UNAUTHORIZED } from 'http-status';
import { fork, put, select, take } from 'redux-saga/effects';
import { VeauAccount } from '../../veau-entity/VeauAccount';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';
import { ACTION, EntranceAccountNameTypedAction, EntrancePasswordTypedAction } from '../actions/Action';
import { updateEntranceInformation } from '../actions/EntranceAction';
import { identified, identityAuthenticated } from '../actions/IdentityAction';
import { loaded, loading } from '../actions/LoadingAction';
import { raiseModal } from '../actions/ModalAction';
import { pushToStatsList } from '../actions/RedirectAction';
import { ISessionQuery } from '../queries/interfaces/ISessionQuery';
import { SessionAJAXQuery } from '../queries/SessionAJAXQuery';
import { State } from '../State';

export class EntranceSaga {
  private static instance: EntranceSaga = new EntranceSaga();
  private static sessionQuery: ISessionQuery = SessionAJAXQuery.getInstance();

  public static getInstance(): EntranceSaga {
    return EntranceSaga.instance;
  }

  private constructor() {
  }

  public *init(): IterableIterator<any> {
    yield fork(this.login);
    yield fork(this.accountNameTyped);
    yield fork(this.passwordTyped);
  }

  private *login(): IterableIterator<any> {
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
        const veauAccount: VeauAccount = yield EntranceSaga.sessionQuery.findByEntranceInfo(entranceInformation);

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

  private *accountNameTyped(): IterableIterator<any> {
    while (true) {
      const action: EntranceAccountNameTypedAction = yield take(ACTION.ENTRANCE_ACCOUNT_NAME_TYPED);
      const state: State = yield select();

      const {
        entranceInformation
      } = state;

      const newLogin: EntranceInformation = EntranceInformation.of(action.account, entranceInformation.getPassword());
      yield put(updateEntranceInformation(newLogin));
    }
  }

  private *passwordTyped(): IterableIterator<any> {
    while (true) {
      const action: EntrancePasswordTypedAction = yield take(ACTION.ENTRANCE_PASSWORD_TYPED);
      const state: State = yield select();

      const {
        entranceInformation
      } = state;

      const newLogin: EntranceInformation = EntranceInformation.of(entranceInformation.getAccount(), action.password);
      yield put(updateEntranceInformation(newLogin));
    }
  }
}
