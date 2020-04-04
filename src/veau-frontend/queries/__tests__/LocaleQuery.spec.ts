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

      const localeQuery: LocaleQuery = new LocaleQuery();
      const trial: Try<Locale, AJAXError> = await localeQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
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

      const localeQuery: LocaleQuery = new LocaleQuery();
      const trial: Try<Locale, AJAXError> = await localeQuery.all();

      expect(stub.withArgs('/api/locale').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const locale: Locale = trial.get();
      expect(locale.getLanguages().size()).toEqual(1);
      expect(locale.getLanguages().get(0).get().getLanguageID().get()).toEqual(1);
      expect(locale.getLanguages().get(0).get().getName().get()).toEqual('language');
      expect(locale.getLanguages().get(0).get().getEnglishName().get()).toEqual('english language');
      expect(locale.getLanguages().get(0).get().getISO639().get()).toEqual('aa');
      expect(locale.getRegions().size()).toEqual(1);
      expect(locale.getRegions().get(0).get().getRegionID().get()).toEqual(2);
      expect(locale.getRegions().get(0).get().getName().get()).toEqual('region');
      expect(locale.getRegions().get(0).get().getISO3166().get()).toEqual('bb');
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

      const localeQuery: LocaleQuery = new LocaleQuery();
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

      const localeQuery: LocaleQuery = new LocaleQuery();
      const trial: Try<Language, NoSuchElementError | AJAXError> = await localeQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isSuccess()).toEqual(true);
      const language: Language = trial.get();
      expect(language.getLanguageID().get()).toEqual(1);
      expect(language.getName().get()).toEqual('language');
      expect(language.getEnglishName().get()).toEqual('english language');
      expect(language.getISO639().get()).toEqual('aa');
    });

    it('requests incorrectly', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery();
      const trial: Try<Language, NoSuchElementError | AJAXError> = await localeQuery.findByISO639(ISO639.of('cc'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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

      const localeQuery: LocaleQuery = new LocaleQuery();
      const trial: Try<Language, NoSuchElementError | AJAXError> = await localeQuery.findByISO639(ISO639.of('cc'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
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

      const localeQuery: LocaleQuery = new LocaleQuery();
      const trial: Try<Region, NoSuchElementError | AJAXError> = await localeQuery.findByISO3166(ISO3166.of('bb'));

      expect(trial.isSuccess()).toEqual(true);
      const region: Region = trial.get();
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery();
      const trial: Try<Region, NoSuchElementError | AJAXError> = await localeQuery.findByISO3166(ISO3166.of('aa'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
