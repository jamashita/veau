import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError, MockFetch } from '@jamashita/catacombe-fetch';
import { Schrodinger } from '@jamashita/genitore';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { bin } from '../../../../container/Bin';
import { Type } from '../../../../container/Types';
import { Language } from '../../../../domain/vo/Language/Language';
import { LanguageID } from '../../../../domain/vo/Language/LanguageID';
import { LocaleError } from '../../../../domain/vo/Locale/error/LocaleError';
import { Locale, LocaleJSON } from '../../../../domain/vo/Locale/Locale';
import { Region } from '../../../../domain/vo/Region/Region';
import { RegionID } from '../../../../domain/vo/Region/RegionID';
import { LocaleQuery } from '../LocaleQuery';

describe('LocaleQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const localeQuery1: LocaleQuery = bin.get<LocaleQuery>(Type.LocaleFetchQuery);
      const localeQuery2: LocaleQuery = bin.get<LocaleQuery>(Type.LocaleFetchQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

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

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: json
      });

      const localeQuery: LocaleQuery = new LocaleQuery(ajax);
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeQuery.all().terminate();

      expect(stub.withArgs('/api/locale').called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const locale: Locale = schrodinger.get();

      expect(locale.getLanguages().size()).toBe(json.languages.length);
      for (let i: number = 0; i < locale.getLanguages().size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const languageID: LanguageID = LanguageID.ofString(json.languages[i]!.languageID);
        const language: Nullable<Language> = locale.getLanguages().get(languageID);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(language?.getLanguageID().get().get()).toBe(json.languages[i]!.languageID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(language?.getName().get()).toBe(json.languages[i]!.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(language?.getEnglishName().get()).toBe(json.languages[i]!.englishName);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(language?.getISO639().get()).toBe(json.languages[i]!.iso639);
      }

      expect(locale.getRegions().size()).toBe(1);
      for (let i: number = 0; i < locale.getRegions().size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const regionID: RegionID = RegionID.ofString(json.regions[i]!.regionID);
        const region: Nullable<Region> = locale.getRegions().get(regionID);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(region?.getRegionID().get().get()).toBe(json.regions[i]!.regionID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(region?.getName().get()).toBe(json.regions[i]!.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(region?.getISO3166().get()).toBe(json.regions[i]!.iso3166);
      }
    });

    it('returns Dead when Fetch call doesn not return StatusCodes.OK', async () => {
      expect.assertions(2);

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {}
      });

      const localeQuery: LocaleQuery = new LocaleQuery(ajax);
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });
  });
});
