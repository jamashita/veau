import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { AJAXError } from '../../../General/AJAX/AJAXError';
import { MockAJAX } from '../../../General/AJAX/Mock/MockAJAX';
import { DataSourceError } from '../../../General/DataSourceError';
import { Try } from '../../../General/Try/Try';
import { Locale, LocaleJSON } from '../../../VO/Locale';
import { LocaleQuery } from '../LocaleQuery';

// DONE
describe('LocaleQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(TYPE.LocaleAJAXQuery);
      const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(TYPE.LocaleAJAXQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const json: LocaleJSON = {
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
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });

      const localeQuery: LocaleQuery = new LocaleQuery(ajax);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

      expect(stub.withArgs('/api/locale').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const locale: Locale = trial.get();
      expect(locale.getLanguages().size()).toEqual(json.languages.length);
      for (let i: number = 0; i < locale.getLanguages().size(); i++) {
        expect(locale.getLanguages().get(i).get().getLanguageID().get()).toEqual(json.languages[i].languageID);
        expect(locale.getLanguages().get(i).get().getName().get()).toEqual(json.languages[i].name);
        expect(locale.getLanguages().get(i).get().getEnglishName().get()).toEqual(json.languages[i].englishName);
        expect(locale.getLanguages().get(i).get().getISO639().get()).toEqual(json.languages[i].iso639);
      }
      expect(locale.getRegions().size()).toEqual(1);
      for (let i: number = 0; i < locale.getRegions().size(); i++) {
        expect(locale.getRegions().get(i).get().getRegionID().get()).toEqual(json.regions[i].regionID);
        expect(locale.getRegions().get(i).get().getName().get()).toEqual(json.regions[i].name);
        expect(locale.getRegions().get(i).get().getISO3166().get()).toEqual(json.regions[i].iso3166);
      }
    });

    it('returns Failure when AJAX call doesn\'t return OK', async () => {
      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {}
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(ajax);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
