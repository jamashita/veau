import { DataSourceError, MockError, MockSQL, MySQLError, Superposition, UUID } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { MockStats } from '../../../Entity/Stats/Mock/MockStats';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Language/Mock/MockLanguageID';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Region/Mock/MockRegionID';
import { MockStatsID } from '../../../VO/StatsOutline/Mock/MockStatsID';
import { MockStatsName } from '../../../VO/StatsOutline/Mock/MockStatsName';
import { MockStatsOutline } from '../../../VO/StatsOutline/Mock/MockStatsOutline';
import { MockStatsUnit } from '../../../VO/StatsOutline/Mock/MockStatsUnit';
import { MockTerm } from '../../../VO/Term/Mock/MockTerm';
import { MockTermID } from '../../../VO/Term/Mock/MockTermID';
import { MockVeauAccountID } from '../../../VO/VeauAccount/Mock/MockVeauAccountID';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const statsName: string = 'stats name';
      const statsUnit: string = 'stats unit';
      const stats: MockStats = new MockStats({
        outline: new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          name: new MockStatsName(statsName),
          unit: new MockStatsUnit(statsUnit)
        }),
        language: new MockLanguage({
          languageID: new MockLanguageID(uuid2)
        }),
        region: new MockRegion({
          regionID: new MockRegionID(uuid3)
        }),
        term: new MockTerm({
          termID: new MockTermID(uuid4)
        })
      });
      const accountID: MockVeauAccountID = new MockVeauAccountID(uuid5);

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;

      const statsCommand: StatsCommand = new StatsCommand(sql);
      const superposition: Superposition<unknown, DataSourceError> = await statsCommand.create(stats, accountID);

      expect(
        stub.withArgs(
          `INSERT INTO stats VALUES (
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      :unit,
      :updatedAt
      );`,
          {
            statsID: uuid1.get(),
            languageID: uuid2.get(),
            regionID: uuid3.get(),
            termID: uuid4.get(),
            veauAccountID: uuid5.get(),
            name: statsName,
            unit: statsUnit,
            updatedAt: '2000-01-02 01:02:03'
          }
        ).called
      ).toBe(true);
      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const stats: MockStats = new MockStats();
      const accountID: MockVeauAccountID = new MockVeauAccountID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsCommand: StatsCommand = new StatsCommand(sql);
      const superposition: Superposition<unknown, DataSourceError> = await statsCommand.create(stats, accountID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();
      const statsID: MockStatsID = new MockStatsID(uuid);

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;

      const statsCommand: StatsCommand = new StatsCommand(sql);
      const superposition: Superposition<unknown, DataSourceError> = await statsCommand.deleteByStatsID(statsID);

      expect(
        stub.withArgs(
          `DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`,
          {
            statsID: uuid.get()
          }
        ).called
      ).toBe(true);
      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsCommand: StatsCommand = new StatsCommand(sql);
      const superposition: Superposition<unknown, DataSourceError> = await statsCommand.deleteByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
