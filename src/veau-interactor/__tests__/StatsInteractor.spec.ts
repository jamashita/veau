import 'jest';
import * as moment from 'moment';
import * as sinon from 'sinon';
import { SinonSpy, SinonStub } from 'sinon';
import { StatsItems } from '../../veau-entity/collection/StatsItems';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsOutline } from '../../veau-entity/StatsOutline';
import { Term } from '../../veau-enum/Term';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { StatsQuery } from '../../veau-query/StatsQuery';
import { StatsValues } from '../../veau-vo/collection/StatsValues';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsName } from '../../veau-vo/StatsName';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { StatsInteractor } from '../StatsInteractor';

describe('StatsInteractor', () => {
  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94');
      const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: StatsName = StatsName.of('stats');
      const unit: string = 'unit';
      const updatedAt: moment.Moment = moment.utc();
      const items: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('e4acd635-c9bc-4957-ba4d-4d299a08949b'), 'item1', StatsValues.of([])),
        StatsItem.from(StatsItemID.of('7680c494-158b-43ec-9846-d37d513cf4d8'), 'item2', StatsValues.of([]))
      ]);

      const stub: SinonStub = sinon.stub();
      StatsQuery.prototype.findByStatsID = stub;
      stub.resolves(Stats.from(
        statsID,
        language,
        region,
        term,
        name,
        unit,
        updatedAt,
        items
      ));

      const statsInteractor: StatsInteractor = StatsInteractor.getInstance();
      const stats: Stats = await statsInteractor.findByStatsID(StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94'));

      expect(stats.getStatsID()).toEqual(statsID);
      expect(stats.getLanguage()).toEqual(language);
      expect(stats.getRegion()).toEqual(region);
      expect(stats.getTerm()).toEqual(term);
      expect(stats.getName()).toEqual(name);
      expect(stats.getUnit()).toEqual(unit);
      expect(stats.getUpdatedAt()).toEqual(updatedAt);
      expect(stats.getItems()).toEqual(items);
    });

    it('thrown NoSuchElementError', () => {
      const stub: SinonStub = sinon.stub();
      StatsQuery.prototype.findByStatsID = stub;
      stub.rejects(new NoSuchElementError(''));

      const statsInteractor: StatsInteractor = StatsInteractor.getInstance();

      expect(statsInteractor.findByStatsID(StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94'))).rejects.toThrow(NotFoundError);
    });

    it('thrown Error', () => {
      const stub: SinonStub = sinon.stub();
      StatsQuery.prototype.findByStatsID = stub;
      stub.rejects(new Error());

      const statsInteractor: StatsInteractor = StatsInteractor.getInstance();

      expect(statsInteractor.findByStatsID(StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94'))).rejects.toThrow(Error);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94');
      const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: string = 'stats';
      const unit: string = 'unit';
      const updatedAt: moment.Moment = moment.utc();

      const stub: SinonStub = sinon.stub();
      StatsQuery.prototype.findByVeauAccountID = stub;
      stub.resolves([
        StatsOutline.from(
          statsID,
          language,
          region,
          term,
          name,
          unit,
          updatedAt
        )
      ]);

      const statsInteractor: StatsInteractor = StatsInteractor.getInstance();
      const statsOutlines: Array<StatsOutline> =  await statsInteractor.findByVeauAccountID(VeauAccountID.of('cfd6a7f1-b583-443e-9831-bdfc7621b0d2'), 1);

      expect(statsOutlines.length).toEqual(1);
      expect(statsOutlines[0].getStatsID()).toEqual(statsID);
      expect(statsOutlines[0].getLanguage()).toEqual(language);
      expect(statsOutlines[0].getRegion()).toEqual(region);
      expect(statsOutlines[0].getTerm()).toEqual(term);
      expect(statsOutlines[0].getName()).toEqual(name);
      expect(statsOutlines[0].getUnit()).toEqual(unit);
      expect(statsOutlines[0].getUpdatedAt()).toEqual(updatedAt);
    });
  });

  describe('save', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94');
      const language: Language = Language.from(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: StatsName = StatsName.of('stats');
      const unit: string = 'unit';
      const updatedAt: moment.Moment = moment.utc();
      const items: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('e4acd635-c9bc-4957-ba4d-4d299a08949b'), 'item1', StatsValues.of([])),
        StatsItem.from(StatsItemID.of('7680c494-158b-43ec-9846-d37d513cf4d8'), 'item2', StatsValues.of([]))
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

      const spy: SinonSpy = sinon.spy();
      MySQL.prototype.transact = spy;

      const statsInteractor: StatsInteractor = StatsInteractor.getInstance();
      await statsInteractor.save(VeauAccountID.of('cfd6a7f1-b583-443e-9831-bdfc7621b0d2'), stats);

      expect(spy.called).toEqual(true);
    });
  });
});
