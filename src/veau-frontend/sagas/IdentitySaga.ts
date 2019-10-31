import { SagaIterator } from '@redux-saga/types';
import { all, call, fork, put, select, take } from 'redux-saga/effects';
import { AJAXError } from '../../veau-error/AJAXError';
import { UnauthorizedError } from '../../veau-error/UnauthorizedError';
import { LanguageIdentificationService } from '../../veau-service/LanguageIdentificationService';
import { AccountName } from '../../veau-vo/AccountName';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Locale } from '../../veau-vo/Locale';
import { VeauAccount } from '../../veau-vo/VeauAccount';
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

  public static *init(): IterableIterator<unknown> {
    yield fork(IdentitySaga.initIdentity);
    yield fork(IdentitySaga.initialize);
  }

  private static *initIdentity(): SagaIterator<void> {
    try {
      yield put(loading());

      const locale: Locale = yield call((): Promise<Locale> => {
        return localeQuery.all();
      });

      yield all([
        put(defineLocale(locale)),
        put(loaded())
      ]);

      const veauAccount: VeauAccount = yield call((): Promise<VeauAccount> => {
        return sessionQuery.find();
      });

      yield all([
        put(identityAuthenticated(veauAccount)),
        put(identified())
      ]);

      if (location.pathname === Endpoints.ENTRANCE) {
        yield put(pushToStatsList());
      }
    }
    catch (err1) {
      if (err1 instanceof AJAXError) {
        yield all([
          put(loaded()),
          put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'))
        ]);
      }
      if (err1 instanceof UnauthorizedError) {
        const newLanguage: string = LanguageIdentificationService.toISO639(navigator.language);
        const iso639: ISO639 = ISO639.of(newLanguage);
        const state: State = yield select();

        const {
          identity
        } = state;

        try {
          const language: Language = yield call((): Promise<Language> => {
            return localeQuery.findByISO639(iso639);
          });

          const veauAccount: VeauAccount = VeauAccount.of(identity.getVeauAccountID(), identity.getAccount(), language, identity.getRegion());

          yield all([
            put(identityAuthenticated(veauAccount)),
            put(pushToEntrance())
          ]);
        }
        catch (err2) {
          yield put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
        }
      }
    }
  }

  private static *initialize(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.IDENTITY_INITIALIZE);
      const state: State = yield select();

      const {
        identity
      } = state;

      const veauAccount: VeauAccount = VeauAccount.of(VeauAccountID.generate(), AccountName.default(), identity.getLanguage(), identity.getRegion());

      yield put(identityAuthenticated(veauAccount));
    }
  }

  private constructor() {
  }
}
