import { fork, put, select, take } from 'redux-saga/effects';
import { Locale } from '../../veau-entity/aggregate/Locale';
import { Language } from '../../veau-entity/Language';
import { VeauAccount } from '../../veau-entity/VeauAccount';
import { AJAXError } from '../../veau-error/AJAXError';
import { UnauthorizedError } from '../../veau-error/UnauthorizedError';
import { LanguageIdentifier } from '../../veau-general/LanguageIdentifier';
import { AccountName } from '../../veau-vo/AccountName';
import { ISO639 } from '../../veau-vo/ISO639';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { ACTION } from '../actions/Action';
import { identified, identityAuthenticated } from '../actions/IdentityAction';
import { loaded, loading } from '../actions/LoadingAction';
import { defineLocale } from '../actions/LocaleAction';
import { raiseModal } from '../actions/ModalAction';
import { pushToEntrance, pushToStatsList } from '../actions/RedirectAction';
import { Endpoints } from '../Endpoints';
import { LocaleQuery } from '../queries/LocaleQuery';
import { SessionQuery } from '../queries/SessionQuery';
import { State } from '../State';

const sessionQuery: SessionQuery = SessionQuery.getInstance();
const localeQuery: LocaleQuery = LocaleQuery.getInstance();

export class IdentitySaga {

  public static *init(): IterableIterator<any> {
    yield fork(IdentitySaga.initIdentity);
    yield fork(IdentitySaga.initialize);
  }

  private static *initIdentity(): IterableIterator<any> {
    try {
      yield put(loading());

      const locale: Locale = yield localeQuery.all();

      yield put(defineLocale(locale));
      yield put(loaded());

      const veauAccount: VeauAccount = yield sessionQuery.find();

      yield put(identityAuthenticated(veauAccount));
      yield put(identified());

      if (location.pathname === Endpoints.ENTRANCE) {
        yield put(pushToStatsList());
      }
    }
    catch (err1) {
      if (err1 instanceof AJAXError) {
        yield put(loaded());
        yield put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
      }
      if (err1 instanceof UnauthorizedError) {
        const newLanguage: string = LanguageIdentifier.toISO639(navigator.language);
        const iso639: ISO639 = ISO639.of(newLanguage);
        const state: State = yield select();

        const {
          identity
        } = state;

        try {
          const language: Language = yield localeQuery.findByISO639(iso639);

          const veauAccount: VeauAccount = VeauAccount.from(identity.getVeauAccountID(), identity.getAccount(), language, identity.getRegion());

          yield put(identityAuthenticated(veauAccount));
          yield put(pushToEntrance());

        }
        catch (err2) {
          yield put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
          return;
        }
      }
    }
  }

  private static *initialize(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.IDENTITY_INITIALIZE);
      const state: State = yield select();

      const {
        identity
      } = state;

      const veauAccount: VeauAccount = VeauAccount.from(VeauAccountID.default(), AccountName.default(), identity.getLanguage(), identity.getRegion());

      yield put(identityAuthenticated(veauAccount));
    }
  }

  private constructor() {
  }
}
