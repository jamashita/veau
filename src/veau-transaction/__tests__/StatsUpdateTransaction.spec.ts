import 'jest';
import moment from 'moment';
import sinon, { SinonSpy } from 'sinon';
import { StatsCommand } from '../../veau-command/MySQL/StatsCommand';
import { StatsItemCommand } from '../../veau-command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../../veau-command/MySQL/StatsValueCommand';
import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsItems } from '../../veau-entity/StatsItems';
import { IQuery } from '../../veau-general/MySQL/IQuery';
import { MockQuery } from '../../veau-general/MySQL/QueryMock';
import { None } from '../../veau-general/Optional/None';
import { AsOf } from '../../veau-vo/AsOf';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { NumericalValue } from '../../veau-vo/NumericalValue';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsName } from '../../veau-vo/StatsName';
import { StatsUnit } from '../../veau-vo/StatsUnit';
import { StatsValue } from '../../veau-vo/StatsValue';
import { StatsValues } from '../../veau-vo/StatsValues';
import { Term } from '../../veau-vo/Term';
import { UpdatedAt } from '../../veau-vo/UpdatedAt';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { StatsUpdateTransaction } from '../StatsUpdateTransaction';

describe('StatsUpdateTransaction', () => {
  describe('with', () => {
    it('normal case', async () => {
      const spy1: SinonSpy = sinon.spy();
      StatsCommand.prototype.deleteByStatsID = spy1;
      const spy2: SinonSpy = sinon.spy();
      StatsItemCommand.prototype.deleteByStatsID = spy2;
      const spy3: SinonSpy = sinon.spy();
      StatsValueCommand.prototype.deleteByStatsID = spy3;
      const spy4: SinonSpy = sinon.spy();
      StatsCommand.prototype.create = spy4;
      const spy5: SinonSpy = sinon.spy();
      StatsItemCommand.prototype.create = spy5;
      const spy6: SinonSpy = sinon.spy();
      StatsValueCommand.prototype.create = spy6;

      const statsID: StatsID = StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.of(moment());
      const items: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('e4acd635-c9bc-4957-ba4d-4d299a08949b').get(), StatsItemName.of('item1'), StatsValues.of([
          StatsValue.of(StatsItemID.of('e4acd635-c9bc-4957-ba4d-4d299a08949b').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
          StatsValue.of(StatsItemID.of('e4acd635-c9bc-4957-ba4d-4d299a08949b').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(2))
        ])),
        StatsItem.of(StatsItemID.of('7680c494-158b-43ec-9846-d37d513cf4d8').get(), StatsItemName.of('item2'), StatsValues.of([
          StatsValue.of(StatsItemID.of('7680c494-158b-43ec-9846-d37d513cf4d8').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(3)),
          StatsValue.of(StatsItemID.of('7680c494-158b-43ec-9846-d37d513cf4d8').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(4)),
          StatsValue.of(StatsItemID.of('7680c494-158b-43ec-9846-d37d513cf4d8').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(5))
        ]))
      ]);

      const stats: Stats = Stats.of(
        statsID,
        language,
        region,
        term,
        name,
        unit,
        updatedAt,
        items,
        None.of<AsOf>()
      );

      const statsUpdateTransaction: StatsUpdateTransaction = StatsUpdateTransaction.of(stats, VeauAccountID.of('601d14d4-fe47-445c-a6aa-6427776ecd85').get());
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
