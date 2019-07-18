import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { StatsItems } from '../../veau-entity/collection/StatsItems';
import { Stats } from '../../veau-entity/Stats';
import { StatsOutline } from '../../veau-entity/StatsOutline';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { veauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { StatsValues } from '../../veau-vo/collection/StatsValues';
import { StatsID } from '../../veau-vo/StatsID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { StatsQuery } from '../StatsQuery';

describe('StatsQuery', () => {
  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: string = 'a25a8b7f-c810-4dc0-b94e-e97e74329307';
      const stub: SinonStub = sinon.stub();
      veauMySQL.execute = stub;
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
          updatedAt: '2000-01-01T00:00:00.000Z'
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

      const statsQuery: StatsQuery = StatsQuery.getInstance();
      const stats: Stats = await statsQuery.findByStatsID(StatsID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307'));

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
      expect(stats.getUnit()).toEqual('unit');
      expect(stats.getUpdatedAt().toJSON()).toEqual('2000-01-01T00:00:00.000Z');

      const items: StatsItems = stats.getItems();
      expect(items.length()).toEqual(3);
      expect(items.get(0).getStatsItemID().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
      expect(items.get(0).getName()).toEqual('name1');

      let values: StatsValues = items.get(0).getValues();
      expect(values.length()).toEqual(3);
      expect(values.get(0).getAsOfAsString()).toEqual('2000-01-01');
      expect(values.get(0).getValue()).toEqual(1);
      expect(values.get(1).getAsOfAsString()).toEqual('2000-01-02');
      expect(values.get(1).getValue()).toEqual(2);
      expect(values.get(2).getAsOfAsString()).toEqual('2000-01-03');
      expect(values.get(2).getValue()).toEqual(3);

      expect(items.get(1).getStatsItemID().get()).toEqual('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c');
      expect(items.get(1).getName()).toEqual('name2');

      values = items.get(1).getValues();
      expect(values.length()).toEqual(2);
      expect(values.get(0).getAsOfAsString()).toEqual('2001-01-01');
      expect(values.get(0).getValue()).toEqual(11);
      expect(values.get(1).getAsOfAsString()).toEqual('2001-01-02');
      expect(values.get(1).getValue()).toEqual(12);

      expect(items.get(2).getStatsItemID().get()).toEqual('2ac64841-5267-48bc-8952-ba9ad1cb12d7');
      expect(items.get(2).getName()).toEqual('name3');

      values = items.get(2).getValues();
      expect(values.length()).toEqual(0);
    });

    it('throws error', () => {
      const stub: SinonStub = sinon.stub();
      veauMySQL.execute = stub;
      stub.resolves([]);

      const statsQuery: StatsQuery = StatsQuery.getInstance();
      expect(statsQuery.findByStatsID(StatsID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307'))).rejects.toThrow(NoSuchElementError);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      veauMySQL.execute = stub;
      stub.resolves([
        {
          statsID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
          languageID: 1,
          languageName: 'lang1',
          languageEnglishName: 'lang1',
          iso639: 'l1',
          regionID: 2,
          regionName: 'regn2',
          iso3166: 'r2',
          termID: 1,
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: 'a25a8b7f-c810-4dc0-b94e-e97e74329307',
          languageID: 2,
          languageName: 'lang2',
          languageEnglishName: 'lang2',
          iso639: 'l2',
          regionID: 3,
          regionName: 'regn3',
          iso3166: 'r3',
          termID: 2,
          name: 'stats2',
          unit: 'unit2',
          updatedAt: '2001-01-01 00:00:00'
        }
      ]);

      const statsQuery: StatsQuery = StatsQuery.getInstance();
      const statsOutlines: Array<StatsOutline> = await statsQuery.findByVeauAccountID(VeauAccountID.of('2ac64841-5267-48bc-8952-ba9ad1cb12d7'), 2, 0);

      expect(statsOutlines.length).toEqual(2);
      expect(statsOutlines[0].getStatsID().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
      expect(statsOutlines[0].getLanguage().getLanguageID().get()).toEqual(1);
      expect(statsOutlines[0].getLanguage().getName().get()).toEqual('lang1');
      expect(statsOutlines[0].getLanguage().getEnglishName().get()).toEqual('lang1');
      expect(statsOutlines[0].getLanguage().getISO639().get()).toEqual('l1');
      expect(statsOutlines[0].getRegion().getRegionID().get()).toEqual(2);
      expect(statsOutlines[0].getRegion().getName().get()).toEqual('regn2');
      expect(statsOutlines[0].getRegion().getISO3166().get()).toEqual('r2');
      expect(statsOutlines[0].getTerm().getID()).toEqual(1);
      expect(statsOutlines[0].getName().get()).toEqual('stats1');
      expect(statsOutlines[0].getUnit()).toEqual('unit1');
      expect(statsOutlines[0].getUpdatedAtAsString()).toEqual('2000-01-01 00:00:00');
      expect(statsOutlines[1].getStatsID().get()).toEqual('a25a8b7f-c810-4dc0-b94e-e97e74329307');
      expect(statsOutlines[1].getLanguage().getLanguageID().get()).toEqual(2);
      expect(statsOutlines[1].getLanguage().getName().get()).toEqual('lang2');
      expect(statsOutlines[1].getLanguage().getEnglishName().get()).toEqual('lang2');
      expect(statsOutlines[1].getLanguage().getISO639().get()).toEqual('l2');
      expect(statsOutlines[1].getRegion().getRegionID().get()).toEqual(3);
      expect(statsOutlines[1].getRegion().getName().get()).toEqual('regn3');
      expect(statsOutlines[1].getRegion().getISO3166().get()).toEqual('r3');
      expect(statsOutlines[1].getTerm().getID()).toEqual(2);
      expect(statsOutlines[1].getName().get()).toEqual('stats2');
      expect(statsOutlines[1].getUnit()).toEqual('unit2');
      expect(statsOutlines[1].getUpdatedAtAsString()).toEqual('2001-01-01 00:00:00');
    });
  });
});
