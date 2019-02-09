import { call, fork, put, select, take } from 'redux-saga/effects';
import * as request from 'request';
import { ACTION } from '../actions/Action';
import { State } from '../declarations/State';
import { VeauAccount, VeauAccountJSON } from '../../veau-entity/VeauAccount';
import { VeauAccountFactory } from '../../veau-factory/VeauAccountFactory';
import { AJAX } from '../../veau-general/AJAX';
import { LanguageIdentifier } from '../../veau-general/LanguageIdentifier';
import { ISO639 } from '../../veau-vo/ISO639';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { identified, identityAuthenticated } from '../actions/IdentityAction';
import { pushToEntrance, pushToStatsList } from '../actions/RedirectAction';
import { Endpoints } from '../Endpoints';

const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();

export class Identity {

  public static *init(): IterableIterator<any> {
    yield fork(Identity.initIdentity);
    yield fork(Identity.initialize);
  }

  private static *initIdentity(): IterableIterator<any> {
    try {
      const res: request.Response = yield call(AJAX.get, '/api/identity');
      const json: VeauAccountJSON = res.body;

      const veauAccount: VeauAccount = veauAccountFactory.fromJSON(json);

      yield put(identityAuthenticated(veauAccount));
      yield put(identified());

      if (location.pathname === Endpoints.ENTRANCE) {
        yield put(pushToStatsList());
      }
    }
    catch (err) {
      const newLanguage: string = LanguageIdentifier.toISO639(navigator.language);
      const state: State = yield select();

      const {
        identity
      } = state;

      const veauAccount: VeauAccount = veauAccountFactory.from(identity.getVeauAccountID(), identity.getAccount(), ISO639.of(newLanguage), identity.getRegion());

      yield put(identityAuthenticated(veauAccount));
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

      const veauAccount: VeauAccount = veauAccountFactory.from(VeauAccountID.default(), '', identity.getLanguage(), identity.getRegion());

      yield put(identityAuthenticated(veauAccount));
    }
  }
}
