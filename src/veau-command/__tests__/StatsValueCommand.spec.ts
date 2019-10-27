import 'jest';
import sinon, { SinonStub } from 'sinon';
import { IQuery } from '../../veau-general/MySQL/IQuery';
import { QueryMock } from '../../veau-general/MySQL/QueryMock';
import { AsOf } from '../../veau-vo/AsOf';
import { NumericalValue } from '../../veau-vo/NumericalValue';
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
      const statsItemID: StatsItemID = StatsItemID.of('6c3f54e0-bfe5-4b4b-9227-2175604ab739');
      const statsValue: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1));

      const statsValueCommand: StatsValueCommand = StatsValueCommand.of(query);

      await statsValueCommand.create(statsValue);

      expect(stub.withArgs(`INSERT INTO stats_values VALUES (
      :statsItemID,
      :asOf,
      :value
      );`, {
        statsItemID: '6c3f54e0-bfe5-4b4b-9227-2175604ab739',
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
      const statsID: StatsID = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd');

      const statsValueCommand: StatsValueCommand = StatsValueCommand.of(query);

      await statsValueCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      INNER JOIN stats R3
      USING(stats_id)
      WHERE R3.stats_id = :statsID;`, {
        statsID: '59915b56-b930-426c-a146-3b1dde8054cd'
      }).called).toEqual(true);
    });
  });
});
