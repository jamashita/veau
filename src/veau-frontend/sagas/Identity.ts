import { fork, put, select, take } from 'redux-saga/effects';
import { ACTION, IdentityLanguageModifiedAction } from '../../declarations/Action';
import { State } from '../../declarations/State';
import { Identity as IdentityVO } from '../../veau-vo/Identity';
import { IdentityID } from '../../veau-vo/IdentityID';
import { identityRenewed } from '../actions/IdentityAction';

export class Identity {

  public static *init(): IterableIterator<any> {
    yield fork(Identity.newLanguageSelected);
    yield fork(Identity.initialize);
  }

  private static *newLanguageSelected(): IterableIterator<any> {
    while (true) {
      const action: IdentityLanguageModifiedAction = yield take(ACTION.IDENTITY_LANGUAGE_MODIFIED);
      const state: State = yield select();

      const {
        identity
      } = state;

      const newIdentity: IdentityVO = IdentityVO.of(identity.getIdentityID(), identity.getAccount(), action.language, identity.getLocale());

      yield put(identityRenewed(newIdentity));
    }
  }

  private static *initialize(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.IDENTITY_INITIALIZE);
      const state: State = yield select();

      const {
        identity
      } = state;

      const newIdentity: IdentityVO = IdentityVO.of(IdentityID.default(), '', identity.getLanguage(), identity.getLocale());

      yield put(identityRenewed(newIdentity));
    }
  }
}
