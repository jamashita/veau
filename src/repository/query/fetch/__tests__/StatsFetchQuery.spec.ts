import { UUID } from '@jamashita/anden-uuid';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError, MockFetch } from '@jamashita/catacombe-fetch';
import { Schrodinger } from '@jamashita/genitore';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { bin } from '../../../../container/Bin';
import { Type } from '../../../../container/Types';
import { Stats, StatsJSON } from '../../../../domain/entity/Stats/Stats';
import { StatsError } from '../../../../domain/vo/StatsOutline/error/StatsError';
import { MockStatsID } from '../../../../domain/vo/StatsOutline/mock/MockStatsID';
import { Term } from '../../../../domain/vo/Term/Term';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { StatsFetchQuery } from '../StatsFetchQuery';

describe('StatsFetchsQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const statsQuery1: StatsFetchQuery = bin.get<StatsFetchQuery>(Type.StatsFetchQuery);
      const statsQuery2: StatsFetchQuery = bin.get<StatsFetchQuery>(Type.StatsFetchQuery);

      expect(statsQuery1).toBeInstanceOf(StatsFetchQuery);
      expect(statsQuery1).toBe(statsQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      expect.assertions(14);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const statsID: MockStatsID = new MockStatsID();
      const json: StatsJSON = {
        outline: {
          statsID: uuid1.get(),
          languageID: uuid2.get(),
          regionID: uuid3.get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: uuid2.get(),
          name: 'language',
          englishName: 'english language',
          iso639: 'DU'
        },
        region: {
          regionID: uuid3.get(),
          name: 'region',
          iso3166: 'IDE'
        },
        items: []
      };

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: json
      });

      const statsQuery: StatsFetchQuery = new StatsFetchQuery(ajax);
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(stub.withArgs(`/api/stats/${statsID.get().get()}`).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const stats: Stats = schrodinger.get();

      expect(stats.getStatsID().get().get()).toBe(json.outline.statsID);
      expect(stats.getName().get()).toBe(json.outline.name);
      expect(stats.getUnit().get()).toBe(json.outline.unit);
      expect(stats.getUpdatedAt().toString()).toBe(json.outline.updatedAt);
      expect(stats.getLanguage().getLanguageID().get().get()).toBe(json.language.languageID);
      expect(stats.getLanguage().getName().get()).toBe(json.language.name);
      expect(stats.getLanguage().getEnglishName().get()).toBe(json.language.englishName);
      expect(stats.getLanguage().getISO639().get()).toBe(json.language.iso639);
      expect(stats.getRegion().getRegionID().get().get()).toBe(json.region.regionID);
      expect(stats.getRegion().getName().get()).toBe(json.region.name);
      expect(stats.getRegion().getISO3166().get()).toBe(json.region.iso3166);
      expect(stats.getItems().size()).toBe(0);
    });

    it('returns StatusCodes.NO_CONTENT', async () => {
      expect.assertions(2);

      const statsID: MockStatsID = new MockStatsID();

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.NO_CONTENT,
        body: {}
      });

      const statsQuery: StatsFetchQuery = new StatsFetchQuery(ajax);
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('does not return StatusCodes.OK', async () => {
      expect.assertions(2);

      const statsID: MockStatsID = new MockStatsID();

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {}
      });

      const statsQuery: StatsFetchQuery = new StatsFetchQuery(ajax);
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });
  });
});
