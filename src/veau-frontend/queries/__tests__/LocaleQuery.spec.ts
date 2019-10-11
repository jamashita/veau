import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'jest';
import sinon, { SinonStub } from 'sinon';
import { Locale } from '../../../veau-entity/aggregate/Locale';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { AJAXError } from '../../../veau-error/AJAXError';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { AJAX } from '../../../veau-general/AJAX';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { LocaleQuery } from '../LocaleQuery';

describe('LocaleQuery', () => {
  describe('all', () => {
    it('doesn\'t return OK', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();

      await expect(localeQuery.all()).rejects.toThrow(AJAXError);
    });

    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: {
          languages: [
            {
              languageID: 1,
              name: 'language',
              englishName: 'english language',
              iso639: 'aa'
            }
          ],
          regions: [
            {
              regionID: 2,
              name: 'region',
              iso3166: 'bb'
            }
          ]
        }
      });

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();
      const locale: Locale = await localeQuery.all();

      expect(stub.withArgs('/api/locale').called).toEqual(true);
      expect(locale.getLanguages().length()).toEqual(1);
      expect(locale.getLanguages().get(0).getLanguageID().get()).toEqual(1);
      expect(locale.getLanguages().get(0).getName().get()).toEqual('language');
      expect(locale.getLanguages().get(0).getEnglishName().get()).toEqual('english language');
      expect(locale.getLanguages().get(0).getISO639().get()).toEqual('aa');
      expect(locale.getRegions().length()).toEqual(1);
      expect(locale.getRegions().get(0).getRegionID().get()).toEqual(2);
      expect(locale.getRegions().get(0).getName().get()).toEqual('region');
      expect(locale.getRegions().get(0).getISO3166().get()).toEqual('bb');
    });

    it('already has locale in memory', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: {
          languages: [
          ],
          regions: [
          ]
        }
      });

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();
      const locale1: Locale = await localeQuery.all();
      const locale2: Locale = await localeQuery.all();

      expect(locale1).toBe(locale2);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: {
          languages: [
            {
              languageID: 1,
              name: 'language',
              englishName: 'english language',
              iso639: 'aa'
            }
          ],
          regions: [
            {
              regionID: 2,
              name: 'region',
              iso3166: 'bb'
            }
          ]
        }
      });

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();
      const language: Language = await localeQuery.findByISO639(ISO639.of('aa'));

      expect(language.getLanguageID().get()).toEqual(1);
      expect(language.getName().get()).toEqual('language');
      expect(language.getEnglishName().get()).toEqual('english language');
      expect(language.getISO639().get()).toEqual('aa');
    });

    it('could\'t find the language', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: {
          languages: [
            {
              languageID: 1,
              name: 'language',
              englishName: 'english language',
              iso639: 'aa'
            }
          ],
          regions: [
            {
              regionID: 2,
              name: 'region',
              iso3166: 'bb'
            }
          ]
        }
      });

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();

      await expect(localeQuery.findByISO639(ISO639.of('ab'))).rejects.toThrow(NoSuchElementError);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: {
          languages: [
            {
              languageID: 1,
              name: 'language',
              englishName: 'english language',
              iso639: 'aa'
            }
          ],
          regions: [
            {
              regionID: 2,
              name: 'region',
              iso3166: 'bb'
            }
          ]
        }
      });

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();
      const region: Region = await localeQuery.findByISO3166(ISO3166.of('bb'));

      expect(region.getRegionID().get()).toEqual(2);
      expect(region.getName().get()).toEqual('region');
      expect(region.getISO3166().get()).toEqual('bb');
    });

    it('could\'t find the region', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: {
          languages: [
            {
              languageID: 1,
              name: 'language',
              englishName: 'english language',
              iso639: 'aa'
            }
          ],
          regions: [
            {
              regionID: 2,
              name: 'region',
              iso3166: 'bb'
            }
          ]
        }
      });

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();

      await expect(localeQuery.findByISO3166(ISO3166.of('ba'))).rejects.toThrow(NoSuchElementError);
    });
  });
});
