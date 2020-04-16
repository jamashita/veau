import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { MockStats } from '../../Entity/Mock/MockStats';
import { MockStatsItem } from '../../Entity/Mock/MockStatsItem';
import { MockStatsItems } from '../../Entity/Mock/MockStatsItems';
import { Stats } from '../../Entity/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { DataSourceError } from '../../General/DataSourceError';
import { MockMySQL } from '../../General/MySQL/Mock/MockMySQL';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Try } from '../../General/Superposition/Try';
import { UUID } from '../../General/UUID/UUID';
import { MockStatsOutlineQuery } from '../../Query/Mock/MockStatsOutlineQuery';
import { MockStatsQuery } from '../../Query/Mock/MockStatsQuery';
import { MockISO3166 } from '../../VO/Mock/MockISO3166';
import { MockISO639 } from '../../VO/Mock/MockISO639';
import { MockLanguage } from '../../VO/Mock/MockLanguage';
import { MockLanguageID } from '../../VO/Mock/MockLanguageID';
import { MockLanguageName } from '../../VO/Mock/MockLanguageName';
import { MockPage } from '../../VO/Mock/MockPage';
import { MockRegion } from '../../VO/Mock/MockRegion';
import { MockRegionID } from '../../VO/Mock/MockRegionID';
import { MockRegionName } from '../../VO/Mock/MockRegionName';
import { MockStatsID } from '../../VO/Mock/MockStatsID';
import { MockStatsItemID } from '../../VO/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../VO/Mock/MockStatsItemName';
import { MockStatsName } from '../../VO/Mock/MockStatsName';
import { MockStatsOutline } from '../../VO/Mock/MockStatsOutline';
import { MockStatsOutlines } from '../../VO/Mock/MockStatsOutlines';
import { MockStatsUnit } from '../../VO/Mock/MockStatsUnit';
import { MockTerm } from '../../VO/Mock/MockTerm';
import { MockUpdatedAt } from '../../VO/Mock/MockUpdatedAt';
import { MockVeauAccountID } from '../../VO/Mock/MockVeauAccountID';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { StatsInteractor } from '../StatsInteractor';

// DONE
describe('StatsInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsInteractor1: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const statsInteractor2: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);

      expect(statsInteractor1).toBeInstanceOf(StatsInteractor);
      expect(statsInteractor1).toBe(statsInteractor2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const stats: MockStats = new MockStats({
        statsID: new MockStatsID(uuid1),
        language: new MockLanguage({
          languageID: new MockLanguageID(1),
          name: new MockLanguageName('аҧсуа бызшәа'),
          englishName: new MockLanguageName('Abkhazian'),
          iso639: new MockISO639('ab')
        }),
        region: new MockRegion({
          regionID: new MockRegionID(1),
          name: new MockRegionName('Afghanistan'),
          iso3166: new MockISO3166('AFG')
        }),
        term: new MockTerm({
          id: 566
        }),
        name: new MockStatsName('stats'),
        unit: new MockStatsUnit('unit'),
        updatedAt: new MockUpdatedAt({
          day: 15
        }),
        items: new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid2),
            name: new MockStatsItemName('item1')
          }),
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item2')
          })
        )
      });

      const mysql: MockMySQL = new MockMySQL();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const stub: SinonStub = sinon.stub();
      statsQuery.findByStatsID = stub;
      stub.resolves(Success.of<Stats, NoSuchElementError>(stats));

      const statsInteractor: StatsInteractor = new StatsInteractor(
        mysql,
        statsQuery,
        statsOutlineQuery
      );
      const trial: Try<Stats, NoSuchElementError | StatsError | DataSourceError> = await statsInteractor.findByStatsID(
        new MockStatsID(uuid1)
      );

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get().equals(stats)).toEqual(true);
    });

    it('returns Failure when StatsQuery.findByStatsID throws NoSuchElementError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const stub: SinonStub = sinon.stub();
      statsQuery.findByStatsID = stub;
      stub.resolves(Failure.of<Stats, NoSuchElementError>(new NoSuchElementError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsInteractor: StatsInteractor = new StatsInteractor(
        mysql,
        statsQuery,
        statsOutlineQuery
      );
      const trial: Try<Stats, NoSuchElementError | StatsError | DataSourceError> = await statsInteractor.findByStatsID(
        new MockStatsID()
      );

      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | StatsError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when StatsQuery.findByStatsID returns Failure<Stats, StatsError>', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const stub: SinonStub = sinon.stub();
      statsQuery.findByStatsID = stub;
      stub.resolves(Failure.of<Stats, StatsError>(new StatsError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsInteractor: StatsInteractor = new StatsInteractor(
        mysql,
        statsQuery,
        statsOutlineQuery
      );
      const trial: Try<Stats, NoSuchElementError | StatsError | DataSourceError> = await statsInteractor.findByStatsID(
        new MockStatsID()
      );

      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | StatsError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();
      const outlines: MockStatsOutlines = new MockStatsOutlines(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid),
          language: new MockLanguage({
            languageID: new MockLanguageID(1),
            name: new MockLanguageName('аҧсуа бызшәа'),
            englishName: new MockLanguageName('Abkhazian'),
            iso639: new MockISO639('ab')
          }),
          region: new MockRegion({
            regionID: new MockRegionID(1),
            name: new MockRegionName('Afghanistan'),
            iso3166: new MockISO3166('AFG')
          }),
          term: new MockTerm({
            id: 566
          }),
          name: new MockStatsName('stats'),
          unit: new MockStatsUnit('unit'),
          updatedAt: new MockUpdatedAt({
            day: 15
          })
        })
      );

      const mysql: MockMySQL = new MockMySQL();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const stub: SinonStub = sinon.stub();
      statsOutlineQuery.findByVeauAccountID = stub;
      stub.resolves(Success.of<StatsOutlines, StatsOutlinesError>(outlines));

      const statsInteractor: StatsInteractor = new StatsInteractor(
        mysql,
        statsQuery,
        statsOutlineQuery
      );
      const trial: Try<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsInteractor.findByVeauAccountID(
        new MockVeauAccountID(),
        new MockPage()
      );

      expect(trial.get()).toEqual(outlines);
    });
  });

  describe('save', () => {
    it('normal case', async () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const stats: MockStats = new MockStats({
        statsID: new MockStatsID(uuid1),
        language: new MockLanguage({
          languageID: new MockLanguageID(1),
          name: new MockLanguageName('аҧсуа бызшәа'),
          englishName: new MockLanguageName('Abkhazian'),
          iso639: new MockISO639('ab')
        }),
        region: new MockRegion({
          regionID: new MockRegionID(1),
          name: new MockRegionName('Afghanistan'),
          iso3166: new MockISO3166('AFG')
        }),
        term: new MockTerm({
          id: 566
        }),
        name: new MockStatsName('stats'),
        unit: new MockStatsUnit('unit'),
        updatedAt: new MockUpdatedAt({
          day: 15
        }),
        items: new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid2),
            name: new MockStatsItemName('item1')
          }),
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item2')
          })
        )
      });

      const mysql: MockMySQL = new MockMySQL();
      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const statsQuery: MockStatsQuery = new MockStatsQuery();
      const spy: SinonSpy = sinon.spy();
      mysql.transact = spy;

      const statsInteractor: StatsInteractor = new StatsInteractor(
        mysql,
        statsQuery,
        statsOutlineQuery
      );
      await statsInteractor.save(
        stats,
        new MockVeauAccountID()
      );

      expect(spy.called).toEqual(true);
    });
  });
});
