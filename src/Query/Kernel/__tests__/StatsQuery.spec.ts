import 'reflect-metadata';

import { Alive, DataSourceError, Dead, MySQLError, Superposition, UUID } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { Stats } from '../../../Entity/Stats/Stats';
import { MockStatsItems } from '../../../Entity/StatsItem/Mock/MockStatsItems';
import { StatsItems } from '../../../Entity/StatsItem/StatsItems';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { StatsError } from '../../../Entity/Stats/Error/StatsError';
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
import { MockLanguageQuery } from '../../Mock/MockLanguageQuery';
import { MockRegionQuery } from '../../Mock/MockRegionQuery';
import { MockStatsItemQuery } from '../../Mock/MockStatsItemQuery';
import { MockStatsOutlineQuery } from '../../Mock/MockStatsOutlineQuery';
import { StatsQuery } from '../StatsQuery';

describe('StatsQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsQuery1: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsKernelQuery);
      const statsQuery2: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsKernelQuery);

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
      stub1.resolves(Alive.of<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>(outline));
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Alive.of<StatsItems, StatsItemsError | DataSourceError>(items));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();
      languageQuery.find = stub3;
      stub3.resolves(Alive.of<Language, LanguageError | NoSuchElementError | DataSourceError>(language));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub4: SinonStub = sinon.stub();
      regionQuery.find = stub4;
      stub4.resolves(Alive.of<Region, RegionError | NoSuchElementError | DataSourceError>(region));

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isAlive()).toBe(true);
      const stats: Stats = superposition.get();
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
      stub1.resolves(Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('test failed')));
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because StatsOutlineQuery returns Dead with NoSuchElementError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      statsOutlineQuery.find = stub1;
      stub1.resolves(Dead.of<StatsOutline, NoSuchElementError>(new NoSuchElementError('test failed')));
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
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

    it('returns Dead because StatsItemQuery returns Dead with StatsItemsError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      statsOutlineQuery.find = stub1;
      stub1.resolves(Alive.of<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>(outline));
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Dead.of<StatsItems, StatsItemsError | DataSourceError>(new StatsItemsError('test failed')));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because StatsItemQuery returns Dead with MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      statsOutlineQuery.find = stub1;
      stub1.resolves(Alive.of<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>(outline));
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Dead.of<StatsItems, StatsItemsError | DataSourceError>(new MySQLError('test failed')));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because LanguageQuery returns Dead with LanguageError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();
      const items: MockStatsItems = new MockStatsItems();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      statsOutlineQuery.find = stub1;
      stub1.resolves(Alive.of<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>(outline));
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Alive.of<StatsItems, StatsItemsError | DataSourceError>(items));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();
      languageQuery.find = stub3;
      stub3.resolves(
        Dead.of<Language, LanguageError | NoSuchElementError | DataSourceError>(new LanguageError('test failed'))
      );
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because LanguageQuery returns Dead with NoSuchElementError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();
      const items: MockStatsItems = new MockStatsItems();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      statsOutlineQuery.find = stub1;
      stub1.resolves(Alive.of<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>(outline));
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Alive.of<StatsItems, StatsItemsError | DataSourceError>(items));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();
      languageQuery.find = stub3;
      stub3.resolves(
        Dead.of<Language, LanguageError | NoSuchElementError | DataSourceError>(new NoSuchElementError('test failed'))
      );
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
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

    it('returns Dead because RegionQuery returns Dead with RegionError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();
      const items: MockStatsItems = new MockStatsItems();
      const language: MockLanguage = new MockLanguage();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      statsOutlineQuery.find = stub1;
      stub1.resolves(Alive.of<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>(outline));
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Alive.of<StatsItems, StatsItemsError | DataSourceError>(items));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();
      languageQuery.find = stub3;
      stub3.resolves(Alive.of<Language, LanguageError | NoSuchElementError | DataSourceError>(language));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub4: SinonStub = sinon.stub();
      regionQuery.find = stub4;
      stub4.resolves(
        Dead.of<Region, RegionError | NoSuchElementError | DataSourceError>(new RegionError('test failed'))
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because RegionQuery returns Dead with NoSuchElementError', async () => {
      const statsID: MockStatsID = new MockStatsID();
      const outline: MockStatsOutline = new MockStatsOutline();
      const items: MockStatsItems = new MockStatsItems();
      const language: MockLanguage = new MockLanguage();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const stub1: SinonStub = sinon.stub();
      statsOutlineQuery.find = stub1;
      stub1.resolves(Alive.of<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>(outline));
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Alive.of<StatsItems, StatsItemsError | DataSourceError>(items));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();
      languageQuery.find = stub3;
      stub3.resolves(Alive.of<Language, LanguageError | NoSuchElementError | DataSourceError>(language));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub4: SinonStub = sinon.stub();
      regionQuery.find = stub4;
      stub4.resolves(
        Dead.of<Region, RegionError | NoSuchElementError | DataSourceError>(new NoSuchElementError('test failed'))
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
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
      stub1.resolves(Alive.of<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>(outline));
      const statsItemQuery: MockStatsItemQuery = new MockStatsItemQuery();
      const stub2: SinonStub = sinon.stub();
      statsItemQuery.findByStatsID = stub2;
      stub2.resolves(Alive.of<StatsItems, StatsItemsError | DataSourceError>(items));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub3: SinonStub = sinon.stub();
      languageQuery.find = stub3;
      stub3.resolves(Alive.of<Language, LanguageError | NoSuchElementError | DataSourceError>(language));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub4: SinonStub = sinon.stub();
      regionQuery.find = stub4;
      stub4.resolves(Alive.of<Region, RegionError | NoSuchElementError | DataSourceError>(region));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery(statsOutlineQuery, statsItemQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Stats,
        StatsError | NoSuchElementError | DataSourceError
      > = await statsQuery.findByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
