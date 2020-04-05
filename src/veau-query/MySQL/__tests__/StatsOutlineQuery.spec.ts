import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { container } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { StatsOutlinesError } from '../../../veau-error/StatsOutlinesError';
import { MySQL } from '../../../veau-general/MySQL/MySQL';
import { Try } from '../../../veau-general/Try/Try';
import { Limit } from '../../../veau-vo/Limit';
import { Offset } from '../../../veau-vo/Offset';
import { StatsOutline, StatsOutlineRow } from '../../../veau-vo/StatsOutline';
import { StatsOutlines } from '../../../veau-vo/StatsOutlines';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
import { StatsOutlineQuery } from '../StatsOutlineQuery';

describe('StatsOutlineQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsOutlineQuery1: StatsOutlineQuery = container.get<StatsOutlineQuery>(TYPE.StatsOutlineMySQLQuery);
      const statsOutlineQuery2: StatsOutlineQuery = container.get<StatsOutlineQuery>(TYPE.StatsOutlineMySQLQuery);

      expect(statsOutlineQuery1).toBeInstanceOf(StatsOutlineQuery);
      expect(statsOutlineQuery1).toBe(statsOutlineQuery2);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const row: Array<StatsOutlineRow> = [
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
      ];
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.resolves(row);

      const statsOutlineQuery: StatsOutlineQuery = container.get<StatsOutlineQuery>(TYPE.StatsOutlineMySQLQuery);
      const trial: Try<StatsOutlines, StatsOutlinesError> = await statsOutlineQuery.findByVeauAccountID(VeauAccountID.of('2ac64841-5267-48bc-8952-ba9ad1cb12d7').get(), Limit.of(2).get(), Offset.of(0).get());

      expect(trial.isSuccess()).toEqual(true);
      const statsOutlines: StatsOutlines = trial.get();

      expect(statsOutlines.size()).toEqual(2);
      for (let i: number = 0; i < statsOutlines.size(); i++) {
        const statsOutline: StatsOutline = statsOutlines.get(i).get();
        expect(statsOutline.getStatsID().get()).toEqual(row[i].statsID);
        expect(statsOutline.getLanguage().getLanguageID().get()).toEqual(row[i].languageID);
        expect(statsOutline.getLanguage().getName().get()).toEqual(row[i].languageName);
        expect(statsOutline.getLanguage().getEnglishName().get()).toEqual( row[i].languageEnglishName);
        expect(statsOutline.getLanguage().getISO639().get()).toEqual(row[i].iso639);
        expect(statsOutline.getRegion().getRegionID().get()).toEqual(row[i].regionID);
        expect(statsOutline.getRegion().getName().get()).toEqual(row[i].regionName);
        expect(statsOutline.getRegion().getISO3166().get()).toEqual(row[i].iso3166);
        expect(statsOutline.getTerm().getID()).toEqual(row[i].termID);
        expect(statsOutline.getName().get()).toEqual(row[i].name);
        expect(statsOutline.getUnit().get()).toEqual(row[i].unit);
        expect(statsOutline.getUpdatedAt().toString()).toEqual(row[i].updatedAt);
      }
    });

    it('returns Failure when statsID is malformat', async () => {
      const row: Array<StatsOutlineRow> = [
        {
          statsID: 'malformat uuid',
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
      ];
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.resolves(row);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsOutlineQuery: StatsOutlineQuery = container.get<StatsOutlineQuery>(TYPE.StatsOutlineMySQLQuery);
      const trial: Try<StatsOutlines, StatsOutlinesError> = await statsOutlineQuery.findByVeauAccountID(VeauAccountID.of('2ac64841-5267-48bc-8952-ba9ad1cb12d7').get(), Limit.of(2).get(), Offset.of(0).get());

      expect(trial.isFailure()).toEqual(true);

      trial.match<void>(() => {
        spy1();
      }, (err: StatsOutlinesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlinesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
