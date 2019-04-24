import { call, fork, put, take } from 'redux-saga/effects';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';
import { ACTION } from '../actions/Action';
import { defineLanguages, defineLocale, defineRegions } from '../actions/LocaleAction';
import { ILocaleQuery } from '../queries/interfaces/ILocaleQuery';
import { LocaleAJAXQuery } from '../queries/LocaleAJAXQuery';
import { LocaleMemoryQuery } from '../queries/LocaleMemoryQuery';

export class Locale {
  private static localeQuery: ILocaleQuery = LocaleAJAXQuery.getInstance();

  public static *init(): IterableIterator<any> {
    yield fork(Locale.fetchLocales);
  }

  private static *fetchLocales(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.IDENTITY_IDENTIFIED);

      const languages: Array<Language> = yield call(Locale.localeQuery.allLanguages);
      const regions: Array<Region> = yield call(Locale.localeQuery.allRegions);

      yield put(defineLanguages(languages));
      yield put(defineRegions(regions));
      yield put(defineLocale(LocaleMemoryQuery.getInstance(languages, regions)));
    }
  }
}
