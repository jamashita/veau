import 'reflect-metadata';

import sinon, { SinonStub } from 'sinon';

import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { MySQLError } from '@jamashita/publikum-mysql';
import { UUID } from '@jamashita/publikum-uuid';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { StatsError } from '../../../Entity/Stats/Error/StatsError';
import { Stats } from '../../../Entity/Stats/Stats';
import { MockStatsItems } from '../../../Entity/StatsItem/Mock/MockStatsItems';
import { StatsItems } from '../../../Entity/StatsItem/StatsItems';
import { LanguageError } from '../../../VO/Language/Error/LanguageError';
import { Language } from '../../../VO/Language/Language';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { RegionError } from '../../../VO/Region/Error/RegionError';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { Region } from '../../../VO/Region/Region';
import { StatsItemsError } from '../../../VO/StatsItem/Error/StatsItemsError';
import { StatsOutlineError } from '../../../VO/StatsOutline/Error/StatsOutlineError';
import { MockStatsID } from '../../../VO/StatsOutline/Mock/MockStatsID';
import { MockStatsName } from '../../../VO/StatsOutline/Mock/MockStatsName';
import { MockStatsOutline } from '../../../VO/StatsOutline/Mock/MockStatsOutline';
import { MockStatsUnit } from '../../../VO/StatsOutline/Mock/MockStatsUnit';
import { MockUpdatedAt } from '../../../VO/StatsOutline/Mock/MockUpdatedAt';
import { StatsOutline } from '../../../VO/StatsOutline/StatsOutline';
import { Term } from '../../../VO/Term/Term';
import { TermID } from '../../../VO/Term/TermID';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { MockLanguageQuery } from '../../Mock/MockLanguageQuery';
import { MockRegionQuery } from '../../Mock/MockRegionQuery';
import { MockStatsItemQuery } from '../../Mock/MockStatsItemQuery';
import { MockStatsOutlineQuery } from '../../Mock/MockStatsOutlineQuery';
import { StatsQuery } from '../StatsQuery';

describe('StatsQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsQuery1: StatsQuery = kernel.get<StatsQuery>(Type.StatsKernelQuery);
      const statsQuery2: StatsQuery = kernel.get<StatsQuery>(Type.StatsKernelQuery);

      expect(statsQuery1).toBeInstanceOf(StatsQuery);
      expect(statsQuery1).toBe(statsQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const name: MockStatsName = new MockStatsName();
      const unit: MockStatsUnit = new MockStatsUnit();
      const updatedAt: MockUpdatedAt = new MockUpdatedAt();
      const outline: MockStatsOutline = new MockStatsOutline({
        statsID,
        name,
        unit,
        termID: Term.QUARTERLY.getTermID(),
        updatedAt
      });
      const items: MockStatsItems = new MockStatsItems();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      
      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.alive<StatsOutline, DataSourceError>(outline, DataSourceError));

      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      
      statsItemQuery.findByStatsID = stub2;
      stub2.returns(Superposition.alive<StatsItems, DataSourceError>(items, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();
      
      languageQuery.find = stub3;
      stub3.returns(Superposition.alive<Language, DataSourceError>(language, DataSourceError));
      
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub4: SinonStub = sinon.stub();
      
      regionQuery.find = stub4;
      stub4.returns(Superposition.alive<Region, DataSourceError>(region, DataSourceError));

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const stats: Stats = schrodinger.get();

      expect(stats.getStatsID()).toBe(statsID);
      expect(stats.getName()).toBe(name);
      expect(stats.getUnit()).toBe(unit);
      expect(stats.getTerm()).toBe(Term.QUARTERLY);
      expect(stats.getUpdatedAt()).toBe(updatedAt);
      expect(stats.getLanguage()).toBe(language);
      expect(stats.getRegion()).toBe(region);
      expect(stats.getItems()).toBe(items);
    });

    it('returns Dead because StatsOutlineQuery returns Dead with StatsOutlineError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      
      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.dead<StatsOutline, StatsOutlineError>(new StatsOutlineError('test failed'), StatsOutlineError));
      
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsError);
    });

    it('returns Dead because StatsOutlineQuery returns Dead with NoSuchElementError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      
      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.dead<StatsOutline, NoSuchElementError>(new NoSuchElementError('test failed'), NoSuchElementError));
      
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because StatsItemQuery returns Dead with StatsItemsError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      
      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.alive<StatsOutline, DataSourceError>(outline, DataSourceError));
      
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      
      statsItemQuery.findByStatsID = stub2;
      stub2.returns(Superposition.dead<StatsItems, StatsItemsError>(new StatsItemsError('test failed'), StatsItemsError));
      
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsError);
    });

    it('returns Dead because StatsItemQuery returns Dead with MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      
      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.alive<StatsOutline, DataSourceError>(outline, DataSourceError));
      
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      
      statsItemQuery.findByStatsID = stub2;
      stub2.returns(Superposition.dead<StatsItems, MySQLError>(new MySQLError('test failed'), MySQLError));
      
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('returns Dead because LanguageQuery returns Dead with LanguageError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();
      const items: MockStatsItems = new MockStatsItems();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      
      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.alive<StatsOutline, DataSourceError>(outline, DataSourceError));
      
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      
      statsItemQuery.findByStatsID = stub2;
      stub2.returns(Superposition.alive<StatsItems, DataSourceError>(items, DataSourceError));
      
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();

      languageQuery.find = stub3;
      stub3.returns(
        Superposition.dead<Language, LanguageError>(new LanguageError('test failed'), LanguageError)
      );
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsError);
    });

    it('returns Dead because LanguageQuery returns Dead with NoSuchElementError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();
      const items: MockStatsItems = new MockStatsItems();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      
      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.alive<StatsOutline, DataSourceError>(outline, DataSourceError));
      
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      
      statsItemQuery.findByStatsID = stub2;
      stub2.returns(Superposition.alive<StatsItems, DataSourceError>(items, DataSourceError));
      
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();

      languageQuery.find = stub3;
      stub3.returns(
        Superposition.dead<Language, NoSuchElementError>(new NoSuchElementError('test failed'), NoSuchElementError)
      );
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because RegionQuery returns Dead with RegionError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();
      const items: MockStatsItems = new MockStatsItems();
      const language: MockLanguage = new MockLanguage();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      
      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.alive<StatsOutline, DataSourceError>(outline, DataSourceError));
      
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      
      statsItemQuery.findByStatsID = stub2;
      stub2.returns(Superposition.alive<StatsItems, DataSourceError>(items, DataSourceError));
      
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();
      
      languageQuery.find = stub3;
      stub3.returns(Superposition.alive<Language, DataSourceError>(language, DataSourceError));
      
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub4: SinonStub = sinon.stub();
      
      regionQuery.find = stub4;
      stub4.returns(
        Superposition.dead<Region, RegionError>(new RegionError('test failed'), RegionError)
      );

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsError);
    });

    it('returns Dead because RegionQuery returns Dead with NoSuchElementError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();
      const items: MockStatsItems = new MockStatsItems();
      const language: MockLanguage = new MockLanguage();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      
      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.alive<StatsOutline, DataSourceError>(outline, DataSourceError));
      
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      
      statsItemQuery.findByStatsID = stub2;
      stub2.returns(Superposition.alive<StatsItems, DataSourceError>(items, DataSourceError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();
      
      languageQuery.find = stub3;
      stub3.returns(Superposition.alive<Language, DataSourceError>(language, DataSourceError));
      
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub4: SinonStub = sinon.stub();
      
      regionQuery.find = stub4;
      stub4.returns(
        Superposition.dead<Region, NoSuchElementError>(new NoSuchElementError('test failed'), NoSuchElementError)
      );

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead becuase TermID does not exist', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline({
        termID: TermID.of(UUID.v4())
      });
      const items: MockStatsItems = new MockStatsItems();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      
      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.alive<StatsOutline, DataSourceError>(outline, DataSourceError));
      
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      
      statsItemQuery.findByStatsID = stub2;
      stub2.returns(Superposition.alive<StatsItems, DataSourceError>(items, DataSourceError));
      
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();
      
      languageQuery.find = stub3;
      stub3.returns(Superposition.alive<Language, DataSourceError>(language, DataSourceError));
      
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub4: SinonStub = sinon.stub();
      
      regionQuery.find = stub4;
      stub4.returns(Superposition.alive<Region, DataSourceError>(region, DataSourceError));

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsError);
    });
  });
});
