import moment from 'moment';
import sinon, { SinonSpy } from 'sinon';
import { StatsCommand } from '../../Command/MySQL/StatsCommand';
import { StatsItemCommand } from '../../Command/MySQL/StatsItemCommand';
import { StatsValueCommand } from '../../Command/MySQL/StatsValueCommand';
import { Stats } from '../../Entity/Stats';
import { StatsItem } from '../../Entity/StatsItem';
import { StatsItems } from '../../Entity/StatsItems';
import { IQuery } from '../../General/MySQL/Interface/IQuery';
import { MockQuery } from '../../General/MySQL/Mock/MockQuery';
import { AsOf } from '../../VO/AsOf';
import { ISO3166 } from '../../VO/ISO3166';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { LanguageID } from '../../VO/LanguageID';
import { LanguageName } from '../../VO/LanguageName';
import { NumericalValue } from '../../VO/NumericalValue';
import { Region } from '../../VO/Region';
import { RegionID } from '../../VO/RegionID';
import { RegionName } from '../../VO/RegionName';
import { StatsID } from '../../VO/StatsID';
import { StatsItemID } from '../../VO/StatsItemID';
import { StatsItemName } from '../../VO/StatsItemName';
import { StatsName } from '../../VO/StatsName';
import { StatsUnit } from '../../VO/StatsUnit';
import { StatsValue } from '../../VO/StatsValue';
import { StatsValues } from '../../VO/StatsValues';
import { Term } from '../../VO/Term';
import { UpdatedAt } from '../../VO/UpdatedAt';
import { VeauAccountID } from '../../VO/VeauAccountID';
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

      const statsID: StatsID = StatsID.ofString('9016f5d7-654e-4903-bfc9-a89c40919e94').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.of(moment());
      const items: StatsItems = StatsItems.ofArray([
        StatsItem.of(StatsItemID.ofString('e4acd635-c9bc-4957-ba4d-4d299a08949b').get(), StatsItemName.of('item1'), StatsValues.ofArray([
          StatsValue.of(StatsItemID.ofString('e4acd635-c9bc-4957-ba4d-4d299a08949b').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
          StatsValue.of(StatsItemID.ofString('e4acd635-c9bc-4957-ba4d-4d299a08949b').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(2))
        ])),
        StatsItem.of(StatsItemID.ofString('7680c494-158b-43ec-9846-d37d513cf4d8').get(), StatsItemName.of('item2'), StatsValues.ofArray([
          StatsValue.of(StatsItemID.ofString('7680c494-158b-43ec-9846-d37d513cf4d8').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(3)),
          StatsValue.of(StatsItemID.ofString('7680c494-158b-43ec-9846-d37d513cf4d8').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(4)),
          StatsValue.of(StatsItemID.ofString('7680c494-158b-43ec-9846-d37d513cf4d8').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(5))
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
        items
      );

      const statsUpdateTransaction: StatsUpdateTransaction = StatsUpdateTransaction.of(stats, VeauAccountID.ofString('601d14d4-fe47-445c-a6aa-6427776ecd85').get());
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
