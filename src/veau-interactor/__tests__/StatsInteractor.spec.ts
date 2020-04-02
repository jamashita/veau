import 'jest';
import moment from 'moment';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsItems } from '../../veau-entity/StatsItems';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { None } from '../../veau-general/Optional/None';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { StatsOutlineQuery } from '../../veau-query/StatsOutlineQuery';
import { StatsQuery } from '../../veau-query/StatsQuery';
import { AsOf } from '../../veau-vo/AsOf';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { Page } from '../../veau-vo/Page';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsName } from '../../veau-vo/StatsName';
import { StatsOutline } from '../../veau-vo/StatsOutline';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';
import { StatsUnit } from '../../veau-vo/StatsUnit';
import { StatsValues } from '../../veau-vo/StatsValues';
import { Term } from '../../veau-vo/Term';
import { UpdatedAt } from '../../veau-vo/UpdatedAt';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { StatsInteractor } from '../StatsInteractor';

describe('StatsInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsInteractor1: StatsInteractor = container.get<StatsInteractor>(TYPE.StatsInteractor);
      const statsInteractor2: StatsInteractor = container.get<StatsInteractor>(TYPE.StatsInteractor);

      expect(statsInteractor1).toBeInstanceOf(StatsInteractor);
      expect(statsInteractor1).toBe(statsInteractor2)
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94');
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.of(moment());
      const items: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('e4acd635-c9bc-4957-ba4d-4d299a08949b'), StatsItemName.of('item1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('7680c494-158b-43ec-9846-d37d513cf4d8'), StatsItemName.of('item2'), StatsValues.empty())
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

      const stub: SinonStub = sinon.stub();
      StatsQuery.prototype.findByStatsID = stub;
      stub.resolves(Success.of<Stats, NotFoundError>(stats));
      const spy: SinonSpy = sinon.spy();

      const statsInteractor: StatsInteractor = container.get<StatsInteractor>(TYPE.StatsInteractor);
      const trial: Try<Stats, NotFoundError> = await statsInteractor.findByStatsID(StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94'));

      trial.complete<void>((stats: Stats) => {
        expect(stats.getStatsID()).toEqual(statsID);
        expect(stats.getLanguage()).toEqual(language);
        expect(stats.getRegion()).toEqual(region);
        expect(stats.getTerm()).toEqual(term);
        expect(stats.getName()).toEqual(name);
        expect(stats.getUnit()).toEqual(unit);
        expect(stats.getUpdatedAt()).toEqual(updatedAt);
        expect(stats.getItems()).toEqual(items);
        spy();
      });

      expect(spy.called).toEqual(true);
    });

    it('thrown NoSuchElementError', async () => {
      const stub: SinonStub = sinon.stub();
      StatsQuery.prototype.findByStatsID = stub;
      stub.resolves(Failure.of<Stats, NoSuchElementError>(new NoSuchElementError('')));
      const spy: SinonSpy = sinon.spy();

      const statsInteractor: StatsInteractor = container.get<StatsInteractor>(TYPE.StatsInteractor);
      const trial: Try<Stats, NotFoundError> = await statsInteractor.findByStatsID(StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94'));

      trial.recover<Error>((e: NotFoundError) => {
        expect(e).toBeInstanceOf(NotFoundError);
        spy();
        return e;
      });

      expect(spy.called).toEqual(true);
    });

    it('thrown Error', async () => {
      const stub: SinonStub = sinon.stub();
      StatsQuery.prototype.findByStatsID = stub;
      stub.rejects(new Error());

      const statsInteractor: StatsInteractor = container.get<StatsInteractor>(TYPE.StatsInteractor);

      await expect(statsInteractor.findByStatsID(StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94'))).rejects.toThrow(Error);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94');
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.of(moment());

      const stub: SinonStub = sinon.stub();
      StatsOutlineQuery.prototype.findByVeauAccountID = stub;
      stub.resolves(StatsOutlines.of([
        StatsOutline.of(
          statsID,
          language,
          region,
          term,
          name,
          unit,
          updatedAt
        )
      ]));

      const statsInteractor: StatsInteractor = container.get<StatsInteractor>(TYPE.StatsInteractor);
      const statsOutlines: StatsOutlines =  await statsInteractor.findByVeauAccountID(VeauAccountID.of('cfd6a7f1-b583-443e-9831-bdfc7621b0d2'), Page.of(1));

      expect(statsOutlines.size()).toEqual(1);
      expect(statsOutlines.get(0).getStatsID()).toEqual(statsID);
      expect(statsOutlines.get(0).getLanguage()).toEqual(language);
      expect(statsOutlines.get(0).getRegion()).toEqual(region);
      expect(statsOutlines.get(0).getTerm()).toEqual(term);
      expect(statsOutlines.get(0).getName()).toEqual(name);
      expect(statsOutlines.get(0).getUnit()).toEqual(unit);
      expect(statsOutlines.get(0).getUpdatedAt()).toEqual(updatedAt);
    });
  });

  describe('save', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.of('9016f5d7-654e-4903-bfc9-a89c40919e94');
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.of(moment());
      const items: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('e4acd635-c9bc-4957-ba4d-4d299a08949b'), StatsItemName.of('item1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('7680c494-158b-43ec-9846-d37d513cf4d8'), StatsItemName.of('item2'), StatsValues.empty())
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

      const spy: SinonSpy = sinon.spy();
      MySQL.prototype.transact = spy;

      const statsInteractor: StatsInteractor = container.get<StatsInteractor>(TYPE.StatsInteractor);
      await statsInteractor.save(stats, VeauAccountID.of('cfd6a7f1-b583-443e-9831-bdfc7621b0d2'));

      expect(spy.called).toEqual(true);
    });
  });
});
