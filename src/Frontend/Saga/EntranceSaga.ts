/* eslint-disable */
// @ts-nocheck
import { DataSourceError, Superposition } from 'publikum';
import { SagaIterator } from 'redux-saga';
import { all, call, Effect, fork, put, select, take } from 'redux-saga/effects';

import { ISessionQuery } from '../../Query/Interface/ISessionQuery';
import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { VeauAccountError } from '../../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount } from '../../VO/VeauAccount/VeauAccount';
import {
  ENTRANCE_ACCOUNT_NAME_TYPED,
  ENTRANCE_PASSWORD_TYPED,
  EntranceAccountNameTypedAction,
  EntrancePasswordTypedAction,
  IDENTITY_AUTHENTICATE
} from '../Action';
import { updateEntranceInformation } from '../ActionCreator/EntranceActionCreator';
import { identified, identityAuthenticated } from '../ActionCreator/IdentityActionCreator';
import { loaded, loading } from '../ActionCreator/LoadingActionCreator';
import { raiseModal } from '../ActionCreator/ModalActionCreator';
import { pushToStatsList } from '../ActionCreator/RedirectActionCreator';
import { State } from '../State';

export class EntranceSaga {
  private readonly sessionQuery: ISessionQuery;

  public constructor(sessionQuery: ISessionQuery) {
    this.sessionQuery = sessionQuery;
  }

  public* init(): IterableIterator<unknown> {
    yield fork(this.login);
    yield fork(this.accountNameTyped);
    yield fork(this.passwordTyped);
  }

  private* login(): SagaIterator<unknown> {
    while (true) {
      yield take(IDENTITY_AUTHENTICATE);
      const state: State = yield select();

      const {
        modal: {open},
        entranceInformation
      } = state;

      if (open) {
        continue;
      }
      if (!entranceInformation.isAcceptable()) {
        continue;
      }

      yield put(loading());

      const superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError> = yield call(
        (): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>> => {
          return this.sessionQuery.findByEntranceInfo(entranceInformation);
        }
      );

      yield put(loaded());

      yield superposition.transform<Effect>(
        (veauAccount: VeauAccount) => {
          return all([put(identityAuthenticated(veauAccount)), put(pushToStatsList()), put(identified())]);
        },
        () => {
          return put(raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION'));
        }
      );
    }
  }

  private* accountNameTyped(): SagaIterator<unknown> {
    while (true) {
      const action: EntranceAccountNameTypedAction = yield take(ENTRANCE_ACCOUNT_NAME_TYPED);
      const state: State = yield select();

      const {
        entranceInformation
      } = state;

      const newLogin: EntranceInformation = EntranceInformation.of(action.account, entranceInformation.getPassword());

      yield put(updateEntranceInformation(newLogin));
    }
  }

  private* passwordTyped(): SagaIterator<unknown> {
    while (true) {
      const action: EntrancePasswordTypedAction = yield take(ENTRANCE_PASSWORD_TYPED);
      const state: State = yield select();

      const {
        entranceInformation
      } = state;

      const newLogin: EntranceInformation = EntranceInformation.of(entranceInformation.getAccount(), action.password);

      yield put(updateEntranceInformation(newLogin));
    }
  }
}
