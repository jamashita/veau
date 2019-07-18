import 'jest';
import * as moment from 'moment';
import * as sinon from 'sinon';
import { SinonSpy } from 'sinon';
import { StatsCommand } from '../../veau-command/StatsCommand';
import { StatsItemCommand } from '../../veau-command/StatsItemCommand';
import { StatsValueCommand } from '../../veau-command/StatsValueCommand';
import { StatsItems } from '../../veau-entity/collection/StatsItems';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { Term } from '../../veau-enum/Term';
import { IQuery } from '../../veau-general/MySQL/IQuery';
import { StatsValues } from '../../veau-vo/collection/StatsValues';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { RegionID } from '../../veau-vo/RegionID';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { StatsUpdateTransaction } from '../StatsUpdateTransaction';
import { QueryMock } from './QueryMock';

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

      const statsID: StatsID = StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94');
      const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.from(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: string = 'stats';
      const unit: string = 'unit';
      const updatedAt: moment.Moment = moment.utc();
      const items: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('e4acd635-c9bc-4957-ba4d-4d299a08949b'), 'item1', StatsValues.of([
          StatsValue.of(moment.utc(), 1),
          StatsValue.of(moment.utc(), 2)
        ])),
        StatsItem.from(StatsItemID.of('7680c494-158b-43ec-9846-d37d513cf4d8'), 'item2', StatsValues.of([
          StatsValue.of(moment.utc(), 3),
          StatsValue.of(moment.utc(), 4),
          StatsValue.of(moment.utc(), 5)
        ]))
      ]);

      const stats: Stats = Stats.from(
        statsID,
        language,
        region,
        term,
        name,
        unit,
        updatedAt,
        items
      );

      const statsUpdateTransaction: StatsUpdateTransaction = StatsUpdateTransaction.getInstance(VeauAccountID.of('601d14d4-fe47-445c-a6aa-6427776ecd85'), stats);
      const query: IQuery = new QueryMock();
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
