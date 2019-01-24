import { call, fork, put, select, take } from 'redux-saga/effects';
import * as request from 'request';
import { ACTION } from '../../declarations/Action';
import { State } from '../../declarations/State';
import { AJAX } from '../../veau-general/AJAX';
import { LanguageIdentifier } from '../../veau-general/LanguageIdentifier';
import { Identity as IdentityVO, IdentityJSON } from '../../veau-vo/Identity';
import { IdentityID } from '../../veau-vo/IdentityID';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { identified, identityAuthenticated } from '../actions/IdentityAction';
import { pushToEntrance } from '../actions/RedirectAction';

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
        region
      } = json;

      const identity: IdentityVO = IdentityVO.of(IdentityID.of(id), account, ISO639.of(language), ISO3166.of(region));

      yield put(identityAuthenticated(identity));
      yield put(identified());
    }
    catch (err) {
      const newLanguage: string = LanguageIdentifier.toISO639(navigator.language);
      const state: State = yield select();

      const {
        identity
      } = state;

      const newIdentity: IdentityVO = IdentityVO.of(identity.getIdentityID(), identity.getAccount(), ISO639.of(newLanguage), identity.getRegion());

      yield put(identityAuthenticated(newIdentity));
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

      const newIdentity: IdentityVO = IdentityVO.of(IdentityID.default(), '', identity.getLanguage(), identity.getRegion());

      yield put(identityAuthenticated(newIdentity));
    }
  }
}
