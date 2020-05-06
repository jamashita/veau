import { DataSourceError, MockError, MockSQL, MySQLError, Superposition, UUID } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockStats } from '../../../Entity/Mock/MockStats';
import { MockLanguageID } from '../../../VO/Mock/MockLanguageID';
import { MockRegionID } from '../../../VO/Mock/MockRegionID';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { MockStatsName } from '../../../VO/Mock/MockStatsName';
import { MockStatsUnit } from '../../../VO/Mock/MockStatsUnit';
import { MockTerm } from '../../../VO/Mock/MockTerm';
import { MockVeauAccountID } from '../../../VO/Mock/MockVeauAccountID';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const termID: number = 935;
      const statsName: string = 'stats name';
      const statsUnit: string = 'stats unit';
      const stats: MockStats = new MockStats({
        statsID: new MockStatsID(uuid1),
        languageID: new MockLanguageID(uuid2),
        regionID: new MockRegionID(uuid3),
        term: new MockTerm({
          id: termID
        }),
        name: new MockStatsName(statsName),
        unit: new MockStatsUnit(statsUnit)
      });
      const accountID: MockVeauAccountID = new MockVeauAccountID(uuid4);

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;

      const statsCommand: StatsCommand = new StatsCommand(sql);
      const superposition: Superposition<void, DataSourceError> = await statsCommand.create(stats, accountID);

      expect(stub.withArgs(`INSERT INTO stats VALUES (
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      :unit,
      :updatedAt
      );`, {
        statsID: uuid1.get(),
        languageID: uuid2.get(),
        regionID: uuid3.get(),
        termID,
        veauAccountID: uuid4.get(),
        name: statsName,
        unit: statsUnit,
        updatedAt: '2000-01-02 01:02:03'
      }).called).toBe(true);
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
      const superposition: Superposition<void, DataSourceError> = await statsCommand.create(stats, accountID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('throws Error', async () => {
      const stats: MockStats = new MockStats();
      const accountID: MockVeauAccountID = new MockVeauAccountID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MockError());

      const statsCommand: StatsCommand = new StatsCommand(sql);
      await expect(statsCommand.create(stats, accountID)).rejects.toThrow(MockError);
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
      const superposition: Superposition<void, DataSourceError> = await statsCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`, {
        statsID: uuid.get()
      }).called).toBe(true);
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
      const superposition: Superposition<void, DataSourceError> = await statsCommand.deleteByStatsID(statsID);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('throws Error', async () => {
      const statsID: MockStatsID = new MockStatsID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();
      sql.execute = stub;
      stub.rejects(new MockError());

      const statsCommand: StatsCommand = new StatsCommand(sql);
      await expect(statsCommand.deleteByStatsID(statsID)).rejects.toThrow(MockError);
    });
  });
});
