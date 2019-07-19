import 'jest';
import * as moment from 'moment';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { IQuery } from '../../veau-general/MySQL/IQuery';
import { QueryMock } from '../../veau-general/MySQL/QueryMock';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { StatsValueCommand } from '../StatsValueCommand';

describe('StatsValueCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      QueryMock.prototype.execute = stub;

      const query: IQuery = new QueryMock();
      const statsItemID: StatsItemID = StatsItemID.of('stats item id');
      const statsValue: StatsValue = StatsValue.of(moment('2000-01-01'), 1);

      const statsValueCommand: StatsValueCommand = StatsValueCommand.getInstance(query);

      await statsValueCommand.create(statsItemID, statsValue);

      expect(stub.withArgs(`INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`, {
        statsItemID: 'stats item id',
        asOf: '2000-01-01',
        value: 1
      }).called).toEqual(true);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      QueryMock.prototype.execute = stub;

      const query: IQuery = new QueryMock();
      const statsID: StatsID = StatsID.of('stats id');

      const statsValueCommand: StatsValueCommand = StatsValueCommand.getInstance(query);

      await statsValueCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`, {
        statsID: 'stats id'
      }).called).toEqual(true);
    });
  });
});
