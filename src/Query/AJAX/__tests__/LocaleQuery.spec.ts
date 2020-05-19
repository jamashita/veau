import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { AJAXError, DataSourceError, MockAJAX, Superposition, UUID } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { LocaleError } from '../../../VO/Locale/Error/LocaleError';
import { Locale, LocaleJSON } from '../../../VO/Locale/Locale';
import { LocaleQuery } from '../LocaleQuery';

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
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeQuery.all();

      expect(stub.withArgs('/api/locale').called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const locale: Locale = superposition.get();
      expect(locale.getLanguages().size()).toBe(json.languages.length);
      for (let i: number = 0; i < locale.getLanguages().size(); i++) {
        expect(locale.getLanguages().get(i).get().getLanguageID().get().get()).toBe(json.languages[i].languageID);
        expect(locale.getLanguages().get(i).get().getName().get()).toBe(json.languages[i].name);
        expect(locale.getLanguages().get(i).get().getEnglishName().get()).toBe(json.languages[i].englishName);
        expect(locale.getLanguages().get(i).get().getISO639().get()).toBe(json.languages[i].iso639);
      }
      expect(locale.getRegions().size()).toBe(1);
      for (let i: number = 0; i < locale.getRegions().size(); i++) {
        expect(locale.getRegions().get(i).get().getRegionID().get().get()).toBe(json.regions[i].regionID);
        expect(locale.getRegions().get(i).get().getName().get()).toBe(json.regions[i].name);
        expect(locale.getRegions().get(i).get().getISO3166().get()).toBe(json.regions[i].iso3166);
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(ajax);
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: LocaleError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
