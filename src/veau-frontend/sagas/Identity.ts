import { call, fork, put, select, take } from 'redux-saga/effects';
import * as request from 'request';
import { ACTION } from '../../declarations/Action';
import { State } from '../../declarations/State';
import { AJAX } from '../../veau-general/AJAX';
import { LanguageIdentifier } from '../../veau-general/LanguageIdentifier';
import { Identity as IdentityVO, IdentityJSON } from '../../veau-vo/Identity';
import { IdentityID } from '../../veau-vo/IdentityID';
import { identityRenewed } from '../actions/IdentityAction';
import { pushToEntrance, pushToStatsList } from '../actions/RedirectAction';

export class Identity {

  public static *init(): IterableIterator<any> {
    yield fork(Identity.initIdentity);
    yield fork(Identity.initialize);
  }

  private static *initIdentity(): IterableIterator<any> {
    try {
      const res: request.Response = yield call(AJAX.get, '/api/identity');
      const json: IdentityJSON = res.body;
      const {
        id,
        account,
        language,
        locale
      } = json;
      const identity: IdentityVO = IdentityVO.of(IdentityID.of(id), account, language, locale);

      yield put(identityRenewed(identity));
      yield put(pushToStatsList());
    }
    catch (err) {
      const newLanguage: string = LanguageIdentifier.toISO639(navigator.language);
      const state: State = yield select();

      const {
        identity
      } = state;

      const newIdentity: IdentityVO = IdentityVO.of(identity.getIdentityID(), identity.getAccount(), newLanguage, identity.getLocale());

      yield put(identityRenewed(newIdentity));
      yield put(pushToEntrance());
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
