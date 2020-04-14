import sinon, { SinonSpy } from 'sinon';
import { MockStatsCommand } from '../../Command/Mock/MockStatsCommand';
import { MockStatsItemCommand } from '../../Command/Mock/MockStatsItemCommand';
import { MockStatsValueCommand } from '../../Command/Mock/MockStatsValueCommand';
import { MockStats } from '../../Entity/Mock/MockStats';
import { MockStatsItem } from '../../Entity/Mock/MockStatsItem';
import { MockStatsItems } from '../../Entity/Mock/MockStatsItems';
import { MockStatsUpdateFactory } from '../../Factory/Mock/MockStatsUpdateFactory';
import { IQuery } from '../../General/MySQL/Interface/IQuery';
import { MockQuery } from '../../General/MySQL/Mock/MockQuery';
import { MockStatsValue } from '../../VO/Mock/MockStatsValue';
import { MockStatsValues } from '../../VO/Mock/MockStatsValues';
import { MockVeauAccountID } from '../../VO/Mock/MockVeauAccountID';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { StatsUpdateTransaction } from '../StatsUpdateTransaction';

describe('StatsUpdateTransaction', () => {
  describe('with', () => {
    it('normal case', async () => {
      const stats: MockStats = new MockStats({
        items: new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue()
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue(),
              new MockStatsValue(),
              new MockStatsValue()
            )
          })
        )
      });
      const accountID: VeauAccountID = new MockVeauAccountID();

      const statsCommand: MockStatsCommand = new MockStatsCommand();
      const spy1: SinonSpy = sinon.spy();
      statsCommand.deleteByStatsID = spy1;
      const statsItemCommand: MockStatsItemCommand = new MockStatsItemCommand();
      const spy2: SinonSpy = sinon.spy();
      statsItemCommand.deleteByStatsID = spy2;
      const statsValueCommand: MockStatsValueCommand = new MockStatsValueCommand();
      const spy3: SinonSpy = sinon.spy();
      statsValueCommand.deleteByStatsID = spy3;
      const spy4: SinonSpy = sinon.spy();
      statsCommand.create = spy4;
      const spy5: SinonSpy = sinon.spy();
      statsItemCommand.create = spy5;
      const spy6: SinonSpy = sinon.spy();
      statsValueCommand.create = spy6;

      const statsUpdateFactory: MockStatsUpdateFactory = new MockStatsUpdateFactory(
        statsCommand,
        statsItemCommand,
        statsValueCommand
      );

      const statsUpdateTransaction: StatsUpdateTransaction = new StatsUpdateTransaction(
        stats,
        accountID,
        statsUpdateFactory
      );
      const query: IQuery = new MockQuery();
      await statsUpdateTransaction.with(query);

      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(true);
      expect(spy4.callCount).toEqual(1);
      expect(spy5.callCount).toEqual(2);
      expect(spy6.callCount).toEqual(5);
    });
  });
});
