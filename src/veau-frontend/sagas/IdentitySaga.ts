import { fork, put, select, take } from 'redux-saga/effects';
import { VeauAccount } from '../../veau-entity/VeauAccount';
import { VeauAccountFactory } from '../../veau-factory/VeauAccountFactory';
import { LanguageIdentifier } from '../../veau-general/LanguageIdentifier';
import { ISO639 } from '../../veau-vo/ISO639';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { ACTION } from '../actions/Action';
import { identified, identityAuthenticated } from '../actions/IdentityAction';
import { pushToEntrance, pushToStatsList } from '../actions/RedirectAction';
import { Endpoints } from '../Endpoints';
import { SessionQuery } from '../queries/SessionQuery';
import { State } from '../State';

const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
const sessionQuery: SessionQuery = SessionQuery.getInstance();

export class IdentitySaga {

  public static *init(): IterableIterator<any> {
    yield fork(IdentitySaga.initIdentity);
    yield fork(IdentitySaga.initialize);
  }

  private static *initIdentity(): IterableIterator<any> {
    try {
      const veauAccount: VeauAccount = yield sessionQuery.find();

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

  private constructor() {
  }
}
