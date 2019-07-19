import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { StatsItem } from '../../veau-entity/StatsItem';
import { IQuery } from '../../veau-general/MySQL/IQuery';
import { QueryMock } from '../../veau-general/MySQL/QueryMock';
import { StatsValues } from '../../veau-vo/collection/StatsValues';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsItemCommand } from '../StatsItemCommand';

describe('StatsItemCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      QueryMock.prototype.execute = stub;

      const query: IQuery = new QueryMock();
      const statsID: StatsID = StatsID.of('stats id');
      const statsItem: StatsItem = StatsItem.from(
        StatsItemID.of('stats item id'),
        StatsItemName.of('stats item name'),
        StatsValues.of([])
      );

      const statsItemCommand: StatsItemCommand = StatsItemCommand.getInstance(query);

      await statsItemCommand.create(statsID, statsItem, 1);

      expect(stub.withArgs(`INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`, {
        statsItemID: 'stats item id',
        statsID: 'stats id',
        name: 'stats item name',
        seq: 1
      }).called).toEqual(true);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      QueryMock.prototype.execute = stub;

      const query: IQuery = new QueryMock();
      const statsID: StatsID = StatsID.of('stats id');

      const statsItemCommand: StatsItemCommand = StatsItemCommand.getInstance(query);

      await statsItemCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`, {
        statsID: 'stats id'
      }).called).toEqual(true);
    });
  });
});
