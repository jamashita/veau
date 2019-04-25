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
import { ISessionQuery } from '../queries/interfaces/ISessionQuery';
import { SessionAJAXQuery } from '../queries/SessionAJAXQuery';
import { State } from '../State';

export class Identity {
  private static veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
  private static sessionQuery: ISessionQuery = SessionAJAXQuery.getInstance();

  public static *init(): IterableIterator<any> {
    yield fork(Identity.initIdentity);
    yield fork(Identity.initialize);
  }

  private static *initIdentity(): IterableIterator<any> {
    try {
      const veauAccount: VeauAccount = yield Identity.sessionQuery.find();

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

      const veauAccount: VeauAccount = Identity.veauAccountFactory.from(identity.getVeauAccountID(), identity.getAccount(), ISO639.of(newLanguage), identity.getRegion());

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

      const veauAccount: VeauAccount = Identity.veauAccountFactory.from(VeauAccountID.default(), '', identity.getLanguage(), identity.getRegion());

      yield put(identityAuthenticated(veauAccount));
    }
  }
}
