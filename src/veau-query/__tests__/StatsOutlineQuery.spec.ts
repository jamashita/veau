import 'jest';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { Limit } from '../../veau-vo/Limit';
import { Offset } from '../../veau-vo/Offset';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { StatsOutlineQuery } from '../StatsOutlineQuery';

describe('StatsOutlineQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsOutlineQuery1: StatsOutlineQuery = container.get<StatsOutlineQuery>(TYPE.StatsOutlineQuery);
      const statsOutlineQuery2: StatsOutlineQuery = container.get<StatsOutlineQuery>(TYPE.StatsOutlineQuery);

      expect(statsOutlineQuery1).toBeInstanceOf(StatsOutlineQuery);
      expect(statsOutlineQuery1).toBe(statsOutlineQuery2);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
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

      const statsOutlineQuery: StatsOutlineQuery = container.get<StatsOutlineQuery>(TYPE.StatsOutlineQuery);
      const statsOutlines: StatsOutlines = await statsOutlineQuery.findByVeauAccountID(VeauAccountID.of('2ac64841-5267-48bc-8952-ba9ad1cb12d7'), Limit.of(2), Offset.of(0));

      expect(statsOutlines.size()).toEqual(2);
      expect(statsOutlines.get(0).getStatsID().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
      expect(statsOutlines.get(0).getLanguage().getLanguageID().get()).toEqual(1);
      expect(statsOutlines.get(0).getLanguage().getName().get()).toEqual('lang1');
      expect(statsOutlines.get(0).getLanguage().getEnglishName().get()).toEqual('lang1');
      expect(statsOutlines.get(0).getLanguage().getISO639().get()).toEqual('l1');
      expect(statsOutlines.get(0).getRegion().getRegionID().get()).toEqual(2);
      expect(statsOutlines.get(0).getRegion().getName().get()).toEqual('regn2');
      expect(statsOutlines.get(0).getRegion().getISO3166().get()).toEqual('r2');
      expect(statsOutlines.get(0).getTerm().getID()).toEqual(1);
      expect(statsOutlines.get(0).getName().get()).toEqual('stats1');
      expect(statsOutlines.get(0).getUnit().get()).toEqual('unit1');
      expect(statsOutlines.get(0).getUpdatedAt().toString()).toEqual('2000-01-01 00:00:00');
      expect(statsOutlines.get(1).getStatsID().get()).toEqual('a25a8b7f-c810-4dc0-b94e-e97e74329307');
      expect(statsOutlines.get(1).getLanguage().getLanguageID().get()).toEqual(2);
      expect(statsOutlines.get(1).getLanguage().getName().get()).toEqual('lang2');
      expect(statsOutlines.get(1).getLanguage().getEnglishName().get()).toEqual('lang2');
      expect(statsOutlines.get(1).getLanguage().getISO639().get()).toEqual('l2');
      expect(statsOutlines.get(1).getRegion().getRegionID().get()).toEqual(3);
      expect(statsOutlines.get(1).getRegion().getName().get()).toEqual('regn3');
      expect(statsOutlines.get(1).getRegion().getISO3166().get()).toEqual('r3');
      expect(statsOutlines.get(1).getTerm().getID()).toEqual(2);
      expect(statsOutlines.get(1).getName().get()).toEqual('stats2');
      expect(statsOutlines.get(1).getUnit().get()).toEqual('unit2');
      expect(statsOutlines.get(1).getUpdatedAt().toString()).toEqual('2001-01-01 00:00:00');
    });
  });
});
