import { SagaIterator } from '@redux-saga/types';
import { inject, injectable } from 'inversify';
import { all, call, Effect, fork, put, select, take } from 'redux-saga/effects';
import { TYPE } from '../../Container/Types';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { ISessionQuery } from '../../Query/Interface/ISessionQuery';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { VeauAccount } from '../../VO/VeauAccount';
import {
  ACTION,
  EntranceAccountNameTypedAction,
  EntrancePasswordTypedAction
} from '../actions/Action';
import { updateEntranceInformation } from '../actions/EntranceAction';
import { identified, identityAuthenticated } from '../actions/IdentityAction';
import { loaded, loading } from '../actions/LoadingAction';
import { raiseModal } from '../actions/ModalAction';
import { pushToStatsList } from '../actions/RedirectAction';
import { State } from '../State';

@injectable()
export class EntranceSaga {
  private readonly sessionQuery: ISessionQuery;

  public constructor(@inject(TYPE.SessionAJAXQuery) sessionQuery: ISessionQuery) {
    this.sessionQuery = sessionQuery;
  }

  public *init(): IterableIterator<unknown> {
    yield fork(this.login);
    yield fork(this.accountNameTyped);
    yield fork(this.passwordTyped);
  }

  private *login(): SagaIterator<unknown> {
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

      const trial: Try<VeauAccount, VeauAccountError | DataSourceError> = yield call((): Promise<Try<VeauAccount, VeauAccountError | DataSourceError>> => {
        return this.sessionQuery.findByEntranceInfo(entranceInformation);
      });

      yield put(loaded());

      yield trial.match<Effect>((veauAccount: VeauAccount) => {
        return all([
          put(identityAuthenticated(veauAccount)),
          put(pushToStatsList()),
          put(identified())
        ]);
      }, (err: VeauAccountError | DataSourceError) => {
        return put(raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION'));
      });
    }
  }

  private *accountNameTyped(): SagaIterator<unknown> {
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

  private *passwordTyped(): SagaIterator<unknown> {
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
