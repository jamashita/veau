import { UUID } from '@jamashita/anden-uuid';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../../../container/Kernel';
import { Type } from '../../../../container/Types';
import { Stats } from '../../../../domain/entity/Stats/Stats';
import { MockStatsItems } from '../../../../domain/entity/StatsItem/Mock/MockStatsItems';
import { StatsItems } from '../../../../domain/entity/StatsItem/StatsItems';
import { LanguageError } from '../../../../domain/vo/Language/Error/LanguageError';
import { Language } from '../../../../domain/vo/Language/Language';
import { MockLanguage } from '../../../../domain/vo/Language/Mock/MockLanguage';
import { RegionError } from '../../../../domain/vo/Region/Error/RegionError';
import { MockRegion } from '../../../../domain/vo/Region/Mock/MockRegion';
import { Region } from '../../../../domain/vo/Region/Region';
import { StatsItemError } from '../../../../domain/vo/StatsItem/Error/StatsItemError';
import { StatsError } from '../../../../domain/vo/StatsOutline/Error/StatsError';
import { StatsOutlineError } from '../../../../domain/vo/StatsOutline/Error/StatsOutlineError';
import { MockStatsID } from '../../../../domain/vo/StatsOutline/Mock/MockStatsID';
import { MockStatsOutline } from '../../../../domain/vo/StatsOutline/Mock/MockStatsOutline';
import { MockUpdatedAt } from '../../../../domain/vo/StatsOutline/Mock/MockUpdatedAt';
import { StatsName } from '../../../../domain/vo/StatsOutline/StatsName';
import { StatsOutline } from '../../../../domain/vo/StatsOutline/StatsOutline';
import { StatsUnit } from '../../../../domain/vo/StatsOutline/StatsUnit';
import { Term } from '../../../../domain/vo/Term/Term';
import { TermID } from '../../../../domain/vo/Term/TermID';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { MockLanguageQuery } from '../../Mock/MockLanguageQuery';
import { MockRegionQuery } from '../../Mock/MockRegionQuery';
import { MockStatsItemQuery } from '../../Mock/MockStatsItemQuery';
import { MockStatsOutlineQuery } from '../../Mock/MockStatsOutlineQuery';
import { StatsQuery } from '../StatsQuery';

describe('StatsQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const statsQuery1: StatsQuery = kernel.get<StatsQuery>(Type.StatsKernelQuery);
      const statsQuery2: StatsQuery = kernel.get<StatsQuery>(Type.StatsKernelQuery);

      expect(statsQuery1).toBeInstanceOf(StatsQuery);
      expect(statsQuery1).toBe(statsQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      expect.assertions(9);

      const statsID: MockStatsID = new MockStatsID();
      const name: StatsName = StatsName.empty();
      const unit: StatsUnit = StatsUnit.empty();
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
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

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
      expect.assertions(2);

      const statsID: MockStatsID = new MockStatsID();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.dead<StatsOutline, StatsOutlineError>(new StatsOutlineError('test failed'), StatsOutlineError));

      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsError);
    });

    it('returns Dead because StatsOutlineQuery returns Dead with NoSuchElementError', async () => {
      expect.assertions(2);

      const statsID: MockStatsID = new MockStatsID();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.dead<StatsOutline, NoSuchElementError>(new NoSuchElementError('test failed'), NoSuchElementError));

      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because StatsItemQuery returns Dead with StatsItemError', async () => {
      expect.assertions(2);

      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.find = stub1;
      stub1.returns(Superposition.alive<StatsOutline, DataSourceError>(outline, DataSourceError));

      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();

      statsItemQuery.findByStatsID = stub2;
      stub2.returns(Superposition.dead<StatsItems, StatsItemError>(new StatsItemError('test failed'), StatsItemError));

      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Stats,
        DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsError);
    });

    it('returns Dead because StatsItemQuery returns Dead with MySQLError', async () => {
      expect.assertions(2);

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
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('returns Dead because LanguageQuery returns Dead with LanguageError', async () => {
      expect.assertions(2);

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
      stub3.returns(Superposition.dead<Language, LanguageError>(new LanguageError('test failed'), LanguageError));
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsError);
    });

    it('returns Dead because LanguageQuery returns Dead with NoSuchElementError', async () => {
      expect.assertions(2);

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
      stub3.returns(Superposition.dead<Language, NoSuchElementError>(new NoSuchElementError('test failed'), NoSuchElementError));
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because RegionQuery returns Dead with RegionError', async () => {
      expect.assertions(2);

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
      stub4.returns(Superposition.dead<Region, RegionError>(new RegionError('test failed'), RegionError));

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsError);
    });

    it('returns Dead because RegionQuery returns Dead with NoSuchElementError', async () => {
      expect.assertions(2);

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
      stub4.returns(Superposition.dead<Region, NoSuchElementError>(new NoSuchElementError('test failed'), NoSuchElementError));

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const schrodinger: Schrodinger<Stats,
        DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead becuase TermID does not exist', async () => {
      expect.assertions(2);

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
      const schrodinger: Schrodinger<Stats, DataSourceError | NoSuchElementError | StatsError> = await statsQuery.findByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsError);
    });
  });
});
