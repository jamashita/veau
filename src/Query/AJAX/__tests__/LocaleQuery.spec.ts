import { AJAXError, MockAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { Language } from '../../../VO/Language/Language';
import { LanguageID } from '../../../VO/Language/LanguageID';
import { LocaleError } from '../../../VO/Locale/Error/LocaleError';
import { Locale, LocaleJSON } from '../../../VO/Locale/Locale';
import { Region } from '../../../VO/Region/Region';
import { RegionID } from '../../../VO/Region/RegionID';
import { LocaleQuery } from '../LocaleQuery';

describe('LocaleQuery', () => {
  // TODO
  // eslint-disable-next-line jest/no-commented-out-tests
  // describe('container', () => {
  // eslint-disable-next-line jest/no-commented-out-tests
  //   it('must be a singleton', () => {
  //     expect.assertions(2);
  //
  //     const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleAJAXQuery);
  //     const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleAJAXQuery);
  //
  //     expect(localeQuery1).toBeInstanceOf(LocaleQuery);
  //     expect(localeQuery1).toBe(localeQuery2);
  //   });
  // });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(11);

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

      const ajax: MockAJAX<'json'> = new MockAJAX<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: json
      });

      const localeQuery: LocaleQuery = new LocaleQuery(ajax);
      const schrodinger: Schrodinger<Locale, LocaleError | DataSourceError> = await localeQuery.all().terminate();

      expect(stub.withArgs('/api/locale').called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const locale: Locale = schrodinger.get();

      expect(locale.getLanguages().size()).toBe(json.languages.length);
      for (let i: number = 0; i < locale.getLanguages().size(); i++) {
        const languageID: LanguageID = LanguageID.ofString(json.languages[i].languageID);
        const language: Nullable<Language> = locale.getLanguages().get(languageID);

        expect(language?.getLanguageID().get().get()).toBe(json.languages[i].languageID);
        expect(language?.getName().get()).toBe(json.languages[i].name);
        expect(language?.getEnglishName().get()).toBe(json.languages[i].englishName);
        expect(language?.getISO639().get()).toBe(json.languages[i].iso639);
      }

      expect(locale.getRegions().size()).toBe(1);
      for (let i: number = 0; i < locale.getRegions().size(); i++) {
        const regionID: RegionID = RegionID.ofString(json.regions[i].regionID);
        const region: Nullable<Region> = locale.getRegions().get(regionID);

        expect(region?.getRegionID().get().get()).toBe(json.regions[i].regionID);
        expect(region?.getName().get()).toBe(json.regions[i].name);
        expect(region?.getISO3166().get()).toBe(json.regions[i].iso3166);
      }
    });

    it('returns Dead when AJAX call doesn not return StatusCodes.OK', async () => {
      expect.assertions(2);

      const ajax: MockAJAX<'json'> = new MockAJAX<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
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
