import { call, fork, put, take } from 'redux-saga/effects';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { LocaleAJAXQuery } from '../../veau-query/LocaleAJAXQuery';
import { Locales } from '../../veau-usecase/interfaces/ILocaleUseCase';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language, LanguageJSON } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { Region, RegionJSON } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { ACTION } from '../actions/Action';
import { defineLocale } from '../actions/LocaleAction';

export class Locale {

  public static *init(): IterableIterator<any> {
    yield fork(Locale.fetchLocales);
  }

  private static *fetchLocales(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.IDENTITY_IDENTIFIED);

      const response: AJAXResponse<Locales> = yield call(AJAX.get, '/api/locales');

      const languages: Array<Language> = response.body.languages.map<Language>((json: LanguageJSON) => {
        const {
          languageID,
          name,
          englishName,
          iso639
        } = json;

        return Language.of(LanguageID.of(languageID), name, englishName, ISO639.of(iso639));
      });

      const regions: Array<Region> = response.body.regions.map<Region>((json: RegionJSON) => {
        const {
          regionID,
          name,
          iso3166
        } = json;

        return Region.of(RegionID.of(regionID), name, ISO3166.of(iso3166));
      });

      const localeQuery: LocaleAJAXQuery = LocaleAJAXQuery.getInstance(languages, regions);

      yield put(defineLocale(localeQuery));
    }
  }
}
