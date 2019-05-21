import { fork, put, select, take } from 'redux-saga/effects';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { VeauAccount } from '../../veau-entity/VeauAccount';
import { VeauAccountFactory } from '../../veau-factory/VeauAccountFactory';
import { LanguageIdentifier } from '../../veau-general/LanguageIdentifier';
import { ISO639 } from '../../veau-vo/ISO639';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { ACTION } from '../actions/Action';
import { identified, identityAuthenticated } from '../actions/IdentityAction';
import { loaded, loading } from '../actions/LoadingAction';
import { defineLanguages, defineRegions } from '../actions/LocaleAction';
import { raiseModal } from '../actions/ModalAction';
import { pushToEntrance, pushToStatsList } from '../actions/RedirectAction';
import { Endpoints } from '../Endpoints';
import { LocaleQuery } from '../queries/LocaleQuery';
import { SessionQuery } from '../queries/SessionQuery';
import { State } from '../State';

const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();
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

      const languages: Array<Language> = yield localeQuery.allLanguages();
      const regions: Array<Region> = yield localeQuery.allRegions();

      yield put(defineLanguages(languages));
      yield put(defineRegions(regions));
      yield put(loaded());

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
        const iso639: ISO639 = ISO639.of(newLanguage);
        const state: State = yield select();

        const {
          identity
        } = state;

        const found: Language | undefined = languages.find((language: Language) => {
          if (language.getISO639().equals(iso639)) {
            return true;
          }

          return false;
        });

        if (found === undefined) {
          yield put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
          return;
        }

        const veauAccount: VeauAccount = veauAccountFactory.from(identity.getVeauAccountID(), identity.getAccount(), found, identity.getRegion());

        yield put(identityAuthenticated(veauAccount));
        yield put(pushToEntrance());
      }
    }
    catch (err) {
      yield put(loaded());
      yield put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
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
