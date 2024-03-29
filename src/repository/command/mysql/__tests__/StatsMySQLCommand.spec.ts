import { UUID } from '@jamashita/anden-uuid';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MockSQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import sinon, { SinonStub } from 'sinon';
import { MockStats } from '../../../../domain/entity/Stats/mock/MockStats.js';
import { MockLanguage } from '../../../../domain/vo/Language/mock/MockLanguage.js';
import { MockLanguageID } from '../../../../domain/vo/Language/mock/MockLanguageID.js';
import { MockRegion } from '../../../../domain/vo/Region/mock/MockRegion.js';
import { MockRegionID } from '../../../../domain/vo/Region/mock/MockRegionID.js';
import { MockStatsID } from '../../../../domain/vo/StatsOutline/mock/MockStatsID.js';
import { MockStatsOutline } from '../../../../domain/vo/StatsOutline/mock/MockStatsOutline.js';
import { StatsName } from '../../../../domain/vo/StatsOutline/StatsName.js';
import { StatsUnit } from '../../../../domain/vo/StatsOutline/StatsUnit.js';
import { Term } from '../../../../domain/vo/Term/Term.js';
import { MockVeauAccountID } from '../../../../domain/vo/VeauAccount/mock/MockVeauAccountID.js';
import { StatsMySQLCommand } from '../StatsMySQLCommand.js';

describe('StatsMySQLCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const statsName: string = 'stats name';
      const statsUnit: string = 'stats unit';
      const stats: MockStats = new MockStats({
        outline: new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          name: StatsName.of(statsName),
          unit: StatsUnit.of(statsUnit)
        }),
        language: new MockLanguage({
          languageID: new MockLanguageID(uuid2)
        }),
        region: new MockRegion({
          regionID: new MockRegionID(uuid3)
        }),
        term: Term.QUARTERLY
      });
      const accountID: MockVeauAccountID = new MockVeauAccountID(uuid4);

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();

      sql.execute = stub;

      const statsCommand: StatsMySQLCommand = new StatsMySQLCommand(sql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsCommand.create(stats, accountID).terminate();

      expect(stub.withArgs(
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
          termID: Term.QUARTERLY.getTermID().get().get(),
          veauAccountID: uuid4.get(),
          name: statsName,
          unit: statsUnit,
          updatedAt: '2000-01-02 01:02:03'
        }
      ).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const stats: MockStats = new MockStats();
      const accountID: MockVeauAccountID = new MockVeauAccountID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();

      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));

      const statsCommand: StatsMySQLCommand = new StatsMySQLCommand(sql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsCommand.create(stats, accountID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const uuid: UUID = UUID.v4();
      const statsID: MockStatsID = new MockStatsID(uuid);

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();

      sql.execute = stub;

      const statsCommand: StatsMySQLCommand = new StatsMySQLCommand(sql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsCommand.deleteByStatsID(statsID).terminate();

      expect(stub.withArgs(
        `DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`,
        {
          statsID: uuid.get()
        }
      ).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const statsID: MockStatsID = new MockStatsID();

      const sql: MockSQL = new MockSQL();
      const stub: SinonStub = sinon.stub();

      sql.execute = stub;
      stub.rejects(new MySQLError('test failed'));

      const statsCommand: StatsMySQLCommand = new StatsMySQLCommand(sql);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsCommand.deleteByStatsID(statsID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
