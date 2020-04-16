import { INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { Stats, StatsJSON } from '../../../Entity/Stats';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { StatsError } from '../../../Error/StatsError';
import { AJAXError } from '../../../General/AJAX/AJAXError';
import { MockAJAX } from '../../../General/AJAX/Mock/MockAJAX';
import { DataSourceError } from '../../../General/DataSourceError';
import { Superposition } from '../../../General/Superposition/Superposition';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { StatsID } from '../../../VO/StatsID';
import { StatsQuery } from '../StatsQuery';

// DONE
describe('StatsQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsQuery1: StatsQuery = vault.get<StatsQuery>(TYPE.StatsAJAXQuery);
      const statsQuery2: StatsQuery = vault.get<StatsQuery>(TYPE.StatsAJAXQuery);

      expect(statsQuery1).toBeInstanceOf(StatsQuery);
      expect(statsQuery1).toBe(statsQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get();
      const json: StatsJSON = {
        statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english language',
          iso639: 'aa'
        },
        region: {
          regionID: 2,
          name: 'region',
          iso3166: 'bb'
        },
        termID: 3,
        name: 'stats name',
        unit: 'stats unit',
        updatedAt: '2000-01-01 00:00:00',
        items: []
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });

      const statsQuery: StatsQuery = new StatsQuery(ajax);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(stub.withArgs('/api/stats/f6fb9662-cbe8-4a91-8aa4-47a92f05b007').called).toEqual(true);
      expect(superposition.isSuccess()).toEqual(true);
      const stats: Stats = superposition.get();
      expect(stats.getStatsID().get().get()).toEqual(json.statsID);
      expect(stats.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
      expect(stats.getLanguage().getName().get()).toEqual(json.language.name);
      expect(stats.getLanguage().getEnglishName().get()).toEqual(json.language.englishName);
      expect(stats.getLanguage().getISO639().get()).toEqual(json.language.iso639);
      expect(stats.getRegion().getRegionID().get()).toEqual(json.region.regionID);
      expect(stats.getRegion().getName().get()).toEqual(json.region.name);
      expect(stats.getRegion().getISO3166().get()).toEqual(json.region.iso3166);
      expect(stats.getTerm().getID()).toEqual(json.termID);
      expect(stats.getName().get()).toEqual(json.name);
      expect(stats.getUnit().get()).toEqual(json.unit);
      expect(stats.getItems().size()).toEqual(0);
    });

    it('returns Failure when it has wrong format statsID', async () => {
      const statsID: StatsID = StatsID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get();
      const json: StatsJSON = {
        statsID: 'malformat uuid',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english language',
          iso639: 'aa'
        },
        region: {
          regionID: 2,
          name: 'region',
          iso3166: 'bb'
        },
        termID: 3,
        name: 'stats name',
        unit: 'stats unit',
        updatedAt: '2000-01-01 00:00:00',
        items: []
      };

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(ajax);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns NO_CONTENT', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: NO_CONTENT,
        body: {}
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(ajax);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('doesn\'t return OK', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {}
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(ajax);
      const superposition: Superposition<Stats, StatsError | NoSuchElementError | DataSourceError> = await statsQuery.findByStatsID(statsID);

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
