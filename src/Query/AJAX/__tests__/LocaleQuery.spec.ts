import { AJAXError, MockAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';

import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';

import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { Language } from '../../../VO/Language/Language';
import { LanguageID } from '../../../VO/Language/LanguageID';
import { LocaleError } from '../../../VO/Locale/Error/LocaleError';
import { Locale, LocaleJSON } from '../../../VO/Locale/Locale';
import { Region } from '../../../VO/Region/Region';
import { RegionID } from '../../../VO/Region/RegionID';
import { LocaleQuery } from '../LocaleQuery';

describe('LocaleQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleAJAXQuery);
      const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleAJAXQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const json: LocaleJSON = {
        languages: [
          {
            languageID: UUID.v4().get(),
            name: 'language',
            englishName: 'english language',
            iso639: 'aa'
          }
        ],
        regions: [
          {
            regionID: UUID.v4().get(),
            name: 'region',
            iso3166: 'bb'
          }
        ]
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });

      const localeQuery: LocaleQuery = new LocaleQuery(ajax);
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeQuery.all().terminate();

      expect(stub.withArgs('/api/locale').called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const locale: Locale = schrodinger.get();

      expect(locale.getLanguages().size()).toBe(json.languages.length);
      for (let i: number = 0; i < locale.getLanguages().size(); i++) {
        // eslint-disable-next-line no-await-in-loop
        const languageID: LanguageID = await LanguageID.ofString(json.languages[i].languageID).get();
        const language: Nullable<Language> = locale.getLanguages().get(languageID);

        expect(language?.getLanguageID().get().get()).toBe(json.languages[i].languageID);
        expect(language?.getName().get()).toBe(json.languages[i].name);
        expect(language?.getEnglishName().get()).toBe(json.languages[i].englishName);
        expect(language?.getISO639().get()).toBe(json.languages[i].iso639);
      }

      expect(locale.getRegions().size()).toBe(1);
      for (let i: number = 0; i < locale.getRegions().size(); i++) {
        // eslint-disable-next-line no-await-in-loop
        const regionID: RegionID = await RegionID.ofString(json.regions[i].regionID).get();
        const region: Nullable<Region> = locale.getRegions().get(regionID);

        expect(region?.getRegionID().get().get()).toBe(json.regions[i].regionID);
        expect(region?.getName().get()).toBe(json.regions[i].name);
        expect(region?.getISO3166().get()).toBe(json.regions[i].iso3166);
      }
    });

    it('returns Dead when AJAX call doesn not return OK', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {}
      });

      const localeQuery: LocaleQuery = new LocaleQuery(ajax);
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AJAXError);
    });
  });
});
