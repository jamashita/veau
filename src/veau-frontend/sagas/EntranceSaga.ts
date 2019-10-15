import { SagaIterator } from '@redux-saga/types';
import { all, call, fork, put, select, take } from 'redux-saga/effects';
import { AuthenticationFailureError } from '../../veau-error/AuthenticationFailureError';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';
import { VeauAccount } from '../../veau-vo/VeauAccount';
import { ACTION, EntranceAccountNameTypedAction, EntrancePasswordTypedAction } from '../actions/Action';
import { updateEntranceInformation } from '../actions/EntranceAction';
import { identified, identityAuthenticated } from '../actions/IdentityAction';
import { loaded, loading } from '../actions/LoadingAction';
import { raiseModal } from '../actions/ModalAction';
import { pushToStatsList } from '../actions/RedirectAction';
import { SessionQuery } from '../queries/SessionQuery';
import { State } from '../State';

const sessionQuery: SessionQuery = SessionQuery.getInstance();

export class EntranceSaga {

  public static *init(): IterableIterator<unknown> {
    yield fork(EntranceSaga.login);
    yield fork(EntranceSaga.accountNameTyped);
    yield fork(EntranceSaga.passwordTyped);
  }

  private static *login(): SagaIterator<unknown> {
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
        const veauAccount: VeauAccount = yield call((): Promise<VeauAccount> => {
          return sessionQuery.findByEntranceInfo(entranceInformation);
        });

        yield all([
          put(identityAuthenticated(veauAccount)),
          put(pushToStatsList()),
          put(identified()),
          put(loaded())
        ]);
      }
      catch (err) {
        yield put(loaded());

        if (err instanceof AuthenticationFailureError) {
          yield put(raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION'));
          continue;
        }

        yield put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
      }
    }
  }

  private static *accountNameTyped(): SagaIterator<unknown> {
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

  private static *passwordTyped(): SagaIterator<unknown> {
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

  private constructor() {
  }
}
