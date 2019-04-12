/* tslint:disable */
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { StatsValues } from '../../veau-collection/StatsValues';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { StatsID } from '../../veau-vo/StatsID';
import { UUID } from '../../veau-vo/UUID';
import { StatsValueMySQLQuery } from '../StatsValueMySQLQuery';

describe('StatsValueMySQLQuery', () => {
  it('findByStatsID', async () => {
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.withArgs(
      `SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`,
      [
        {
          statsID: 'd4703058-a6ff-420b-95b2-4475beba9027'
        }
      ]
    ).resolves([
      {
        statsItemID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
        asOf: '2000-01-01',
        value: 1
      },
      {
        statsItemID: '5318ad74-f15f-4835-9fd7-890be4cce933',
        asOf: '2001-01-01',
        value: 11
      },
      {
        statsItemID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
        asOf: '2000-01-02',
        value: 2
      },
      {
        statsItemID: '5318ad74-f15f-4835-9fd7-890be4cce933',
        asOf: '2001-01-02',
        value: 12
      },
      {
        statsItemID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
        asOf: '2000-01-03',
        value: 3
      }
    ]);

    const statsValueQuery: StatsValueMySQLQuery = StatsValueMySQLQuery.getInstance();
    const values: Map<string, StatsValues> = await statsValueQuery.findByStatsID(StatsID.of(UUID.of('d4703058-a6ff-420b-95b2-4475beba9027')));

    const year2001: StatsValues | undefined = values.get('5318ad74-f15f-4835-9fd7-890be4cce933');

    if (year2001) {
      expect(year2001.length()).toEqual(2);
      expect(year2001.get(0).getAsOfAsString()).toEqual('2001-01-01');
      expect(year2001.get(0).getValue()).toEqual(11);
      expect(year2001.get(1).getAsOfAsString()).toEqual('2001-01-02');
      expect(year2001.get(1).getValue()).toEqual(12);
    }
    else {
      fail();
    }

    const year2000: StatsValues | undefined = values.get('98d1e9b5-6b18-44de-b615-d8016f49977d');

    if (year2000) {
      expect(year2000.length()).toEqual(3);
      expect(year2000.get(0).getAsOfAsString()).toEqual('2000-01-01');
      expect(year2000.get(0).getValue()).toEqual(1);
      expect(year2000.get(1).getAsOfAsString()).toEqual('2000-01-02');
      expect(year2000.get(1).getValue()).toEqual(2);
      expect(year2000.get(2).getAsOfAsString()).toEqual('2000-01-03');
      expect(year2000.get(2).getValue()).toEqual(3);
    }
    else {
      fail();
    }
  });
});
