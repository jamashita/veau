import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'jest';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { AJAXError } from '../../../veau-error/AJAXError';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { AJAX } from '../../../veau-general/AJAX';
import { Try } from '../../../veau-general/Try/Try';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { Locale } from '../../../veau-vo/Locale';
import { Region } from '../../../veau-vo/Region';
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();
      const trial: Try<Locale, AJAXError> = await localeQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (e: AJAXError) => {
        spy2();
        expect(e).toBeInstanceOf(AJAXError);
      });
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();
      const trial: Try<Locale, AJAXError> = await localeQuery.all();

      expect(stub.withArgs('/api/locale').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      trial.match<void>((locale: Locale) => {
        expect(locale.getLanguages().size()).toEqual(1);
        expect(locale.getLanguages().get(0).getLanguageID().get()).toEqual(1);
        expect(locale.getLanguages().get(0).getName().get()).toEqual('language');
        expect(locale.getLanguages().get(0).getEnglishName().get()).toEqual('english language');
        expect(locale.getLanguages().get(0).getISO639().get()).toEqual('aa');
        expect(locale.getRegions().size()).toEqual(1);
        expect(locale.getRegions().get(0).getRegionID().get()).toEqual(2);
        expect(locale.getRegions().get(0).getName().get()).toEqual('region');
        expect(locale.getRegions().get(0).getISO3166().get()).toEqual('bb');
        spy1();
      }, () => {
        spy2();
      });

      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(false);
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
      const trial1: Try<Locale, AJAXError> = await localeQuery.all();
      const trial2: Try<Locale, AJAXError> = await localeQuery.all();

      expect(trial1.isSuccess()).toEqual(true);
      expect(trial2.isSuccess()).toEqual(true);

      expect(trial1.get()).toBe(trial2.get());
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();
      const trial: Try<Language, NoSuchElementError | AJAXError> = await localeQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isSuccess()).toEqual(true);
      trial.match<void>((language: Language) => {
        expect(language.getLanguageID().get()).toEqual(1);
        expect(language.getName().get()).toEqual('language');
        expect(language.getEnglishName().get()).toEqual('english language');
        expect(language.getISO639().get()).toEqual('aa');
        spy1();
      }, () => {
        spy2();
      });

      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(false);
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();
      const trial: Try<Language, NoSuchElementError | AJAXError> = await localeQuery.findByISO639(ISO639.of('cc'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (e: NoSuchElementError | AJAXError) => {
        spy2();
        expect(e).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();
      const trial: Try<Region, NoSuchElementError | AJAXError> = await localeQuery.findByISO3166(ISO3166.of('bb'));

      expect(trial.isSuccess()).toEqual(true);
      trial.match<void>((region: Region) => {
        expect(region.getRegionID().get()).toEqual(2);
        expect(region.getName().get()).toEqual('region');
        expect(region.getISO3166().get()).toEqual('bb');
        spy1();
      }, () => {
        spy2();
      });

      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(false);
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = LocaleQuery.getInstance();
      const trial: Try<Region, NoSuchElementError | AJAXError> = await localeQuery.findByISO3166(ISO3166.of('aa'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (e: NoSuchElementError | AJAXError) => {
        spy2();
        expect(e).toBeInstanceOf(NoSuchElementError);
      });
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
