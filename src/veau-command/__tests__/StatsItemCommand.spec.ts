import 'jest';
import sinon, { SinonStub } from 'sinon';
import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsIDError } from '../../veau-error/StatsIDError';
import { IQuery } from '../../veau-general/MySQL/IQuery';
import { QueryMock } from '../../veau-general/MySQL/QueryMock';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsValues } from '../../veau-vo/StatsValues';
import { StatsItemCommand } from '../StatsItemCommand';

describe('StatsItemCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      QueryMock.prototype.execute = stub;

      const query: IQuery = new QueryMock();
      const statsID: Try<StatsID, StatsIDError> = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd');
      const statsItem: StatsItem = StatsItem.of(
        StatsItemID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        StatsItemName.of('stats item name'),
        StatsValues.empty()
      );

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);

      await statsItemCommand.create(statsID.get(), statsItem, 1);

      expect(stub.withArgs(`INSERT INTO stats_items VALUES (
      :statsItemID,
      :statsID,
      :name,
      :seq
      );`, {
        statsItemID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
        statsID: '59915b56-b930-426c-a146-3b1dde8054cd',
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
      const statsID: Try<StatsID, StatsIDError> = StatsID.of('59915b56-b930-426c-a146-3b1dde8054cd');

      const statsItemCommand: StatsItemCommand = StatsItemCommand.of(query);

      await statsItemCommand.deleteByStatsID(statsID.get());

      expect(stub.withArgs(`DELETE R1
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.stats_id = :statsID;`, {
        statsID: '59915b56-b930-426c-a146-3b1dde8054cd'
      }).called).toEqual(true);
    });
  });
});
