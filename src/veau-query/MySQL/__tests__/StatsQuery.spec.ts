import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { Stats } from '../../../veau-entity/Stats';
import { StatsItems } from '../../../veau-entity/StatsItems';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { StatsError } from '../../../veau-error/StatsError';
import { MySQL } from '../../../veau-general/MySQL/MySQL';
import { Try } from '../../../veau-general/Try/Try';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsValues } from '../../../veau-vo/StatsValues';
import { StatsQuery } from '../StatsQuery';

describe('StatsQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsQuery1: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsMySQLQuery);
      const statsQuery2: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsMySQLQuery);

      expect(statsQuery1).toBeInstanceOf(StatsQuery);
      expect(statsQuery1).toBe(statsQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: string = 'a25a8b7f-c810-4dc0-b94e-e97e74329307';
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.onCall(0).resolves([
        {
          statsID,
          languageID: 1,
          languageName: 'language1',
          languageEnglishName: 'englishLanguage1',
          iso639: 'lang1',
          regionID: 2,
          regionName: 'region1',
          iso3166: 'regn1',
          termID: 3,
          name: 'name',
          unit: 'unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ]);
      stub.onCall(1).resolves([
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          name: 'name1'
        },
        {
          statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
          name: 'name2'
        },
        {
          statsItemID: '2ac64841-5267-48bc-8952-ba9ad1cb12d7',
          name: 'name3'
        }
      ]);
      stub.onCall(2).resolves([
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          asOf: '2000-01-01',
          value: 1
        },
        {
          statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
          asOf: '2001-01-01',
          value: 11
        },
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          asOf: '2000-01-02',
          value: 2
        },
        {
          statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
          asOf: '2001-01-02',
          value: 12
        },
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          asOf: '2000-01-03',
          value: 3
        }
      ]);

      const statsQuery: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsMySQLQuery);
      const trial: Try<Stats, NoSuchElementError | StatsError> = await statsQuery.findByStatsID(StatsID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307').get());

      expect(trial.isSuccess()).toEqual(true);
      const stats: Stats = trial.get();
      expect(stats.getStatsID().get()).toEqual('a25a8b7f-c810-4dc0-b94e-e97e74329307');
      expect(stats.getLanguage().getLanguageID().get()).toEqual(1);
      expect(stats.getLanguage().getName().get()).toEqual('language1');
      expect(stats.getLanguage().getEnglishName().get()).toEqual('englishLanguage1');
      expect(stats.getLanguage().getISO639().get()).toEqual('lang1');
      expect(stats.getRegion().getRegionID().get()).toEqual(2);
      expect(stats.getRegion().getName().get()).toEqual('region1');
      expect(stats.getRegion().getISO3166().get()).toEqual('regn1');
      expect(stats.getTerm().getID()).toEqual(3);
      expect(stats.getName().get()).toEqual('name');
      expect(stats.getUnit().get()).toEqual('unit');
      expect(stats.getUpdatedAt().toString()).toEqual('2000-01-01 00:00:00');

      const items: StatsItems = stats.getItems();
      expect(items.size()).toEqual(3);
      expect(items.get(0).get().getStatsItemID().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
      expect(items.get(0).get().getName().get()).toEqual('name1');

      let values: StatsValues = items.get(0).get().getValues();
      expect(values.size()).toEqual(3);
      expect(values.get(0).get().getAsOf().toString()).toEqual('2000-01-01');
      expect(values.get(0).get().getValue().get()).toEqual(1);
      expect(values.get(1).get().getAsOf().toString()).toEqual('2000-01-02');
      expect(values.get(1).get().getValue().get()).toEqual(2);
      expect(values.get(2).get().getAsOf().toString()).toEqual('2000-01-03');
      expect(values.get(2).get().getValue().get()).toEqual(3);

      expect(items.get(1).get().getStatsItemID().get()).toEqual('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c');
      expect(items.get(1).get().getName().get()).toEqual('name2');

      values = items.get(1).get().getValues();
      expect(values.size()).toEqual(2);
      expect(values.get(0).get().getAsOf().toString()).toEqual('2001-01-01');
      expect(values.get(0).get().getValue().get()).toEqual(11);
      expect(values.get(1).get().getAsOf().toString()).toEqual('2001-01-02');
      expect(values.get(1).get().getValue().get()).toEqual(12);

      expect(items.get(2).get().getStatsItemID().get()).toEqual('2ac64841-5267-48bc-8952-ba9ad1cb12d7');
      expect(items.get(2).get().getName().get()).toEqual('name3');

      values = items.get(2).get().getValues();
      expect(values.size()).toEqual(0);
    });

    it('returns Failure becuase of the statsID is malformat', async () => {
      const statsID: string = 'malformat uuid';
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.onCall(0).resolves([
        {
          statsID,
          languageID: 1,
          languageName: 'language1',
          languageEnglishName: 'englishLanguage1',
          iso639: 'lang1',
          regionID: 2,
          regionName: 'region1',
          iso3166: 'regn1',
          termID: 3,
          name: 'name',
          unit: 'unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ]);
      stub.onCall(1).resolves([
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          name: 'name1'
        },
        {
          statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
          name: 'name2'
        },
        {
          statsItemID: '2ac64841-5267-48bc-8952-ba9ad1cb12d7',
          name: 'name3'
        }
      ]);
      stub.onCall(2).resolves([
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          asOf: '2000-01-01',
          value: 1
        },
        {
          statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
          asOf: '2001-01-01',
          value: 11
        },
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          asOf: '2000-01-02',
          value: 2
        },
        {
          statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
          asOf: '2001-01-02',
          value: 12
        },
        {
          statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          asOf: '2000-01-03',
          value: 3
        }
      ]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsMySQLQuery);
      const trial: Try<Stats, NoSuchElementError | StatsError> = await statsQuery.findByStatsID(StatsID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307').get());

      expect(trial.isFailure()).toEqual(true);

      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | StatsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because there is no results', async () => {
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.resolves([]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsMySQLQuery);
      const trial: Try<Stats, NoSuchElementError | StatsError> = await statsQuery.findByStatsID(StatsID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307').get());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | StatsError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
