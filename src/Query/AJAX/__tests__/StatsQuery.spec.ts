import 'reflect-metadata';

import { INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { AJAXError, MockAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { UUID } from '@jamashita/publikum-uuid';

import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { StatsError } from '../../../Entity/Stats/Error/StatsError';
import { Stats, StatsJSON } from '../../../Entity/Stats/Stats';
import { MockStatsID } from '../../../VO/StatsOutline/Mock/MockStatsID';
import { Term } from '../../../VO/Term/Term';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsQuery } from '../StatsQuery';

describe('StatsQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsQuery1: StatsQuery = vault.get<StatsQuery>(Type.StatsAJAXQuery);
      const statsQuery2: StatsQuery = vault.get<StatsQuery>(Type.StatsAJAXQuery);

      expect(statsQuery1).toBeInstanceOf(StatsQuery);
      expect(statsQuery1).toBe(statsQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
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

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });

      const statsQuery: StatsQuery = new StatsQuery(ajax);
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(stub.withArgs(`/api/stats/${statsID.get().get()}`).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const stats: Stats = superposition.get();

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
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.transform<void>(
        () => {
          spy1();
        },
        (err: StatsError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(NoSuchElementError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('doesn not return OK', async () => {
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
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.transform<void>(
        () => {
          spy1();
        },
        (err: StatsError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
