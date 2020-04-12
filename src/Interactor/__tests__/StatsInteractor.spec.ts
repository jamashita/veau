import moment from 'moment';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../Container/Container';
import { TYPE } from '../../Container/Types';
import { Stats } from '../../Entity/Stats';
import { StatsItem } from '../../Entity/StatsItem';
import { StatsItems } from '../../Entity/StatsItems';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { DataSourceError } from '../../General/DataSourceError';
import { MySQL } from '../../General/MySQL/MySQL';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
import { StatsOutlineQuery } from '../../Query/MySQL/StatsOutlineQuery';
import { StatsQuery } from '../../Query/MySQL/StatsQuery';
import { ISO3166 } from '../../VO/ISO3166';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { LanguageID } from '../../VO/LanguageID';
import { LanguageName } from '../../VO/LanguageName';
import { Page } from '../../VO/Page';
import { Region } from '../../VO/Region';
import { RegionID } from '../../VO/RegionID';
import { RegionName } from '../../VO/RegionName';
import { StatsID } from '../../VO/StatsID';
import { StatsItemID } from '../../VO/StatsItemID';
import { StatsItemName } from '../../VO/StatsItemName';
import { StatsName } from '../../VO/StatsName';
import { StatsOutline } from '../../VO/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { StatsUnit } from '../../VO/StatsUnit';
import { StatsValues } from '../../VO/StatsValues';
import { Term } from '../../VO/Term';
import { UpdatedAt } from '../../VO/UpdatedAt';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { StatsInteractor } from '../StatsInteractor';

describe('StatsInteractor', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsInteractor1: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const statsInteractor2: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);

      expect(statsInteractor1).toBeInstanceOf(StatsInteractor);
      expect(statsInteractor1).toBe(statsInteractor2)
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.ofString('9016f5d7-654e-4903-bfc9-a89c40919e94').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.of(moment());
      const items: StatsItems = StatsItems.ofArray([
        StatsItem.of(StatsItemID.ofString('e4acd635-c9bc-4957-ba4d-4d299a08949b').get(), StatsItemName.of('item1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.ofString('7680c494-158b-43ec-9846-d37d513cf4d8').get(), StatsItemName.of('item2'), StatsValues.empty())
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

      const stub: SinonStub = sinon.stub();
      StatsQuery.prototype.findByStatsID = stub;
      stub.resolves(Success.of<Stats, NoSuchElementError>(stats));

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const trial: Try<Stats, NoSuchElementError | StatsError | DataSourceError> = await statsInteractor.findByStatsID(StatsID.ofString('9016f5d7-654e-4903-bfc9-a89c40919e94').get());

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get().equals(stats)).toEqual(true);
    });

    it('returns Failure when StatsQuery.findByStatsID throws NoSuchElementError', async () => {
      const stub: SinonStub = sinon.stub();
      StatsQuery.prototype.findByStatsID = stub;
      stub.resolves(Failure.of<Stats, NoSuchElementError>(new NoSuchElementError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const trial: Try<Stats, NoSuchElementError | StatsError | DataSourceError> = await statsInteractor.findByStatsID(StatsID.ofString('9016f5d7-654e-4903-bfc9-a89c40919e94').get());

      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | StatsError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when StatsQuery.findByStatsID returns Failure<Stats, StatsError>', async () => {
      const stub: SinonStub = sinon.stub();
      StatsQuery.prototype.findByStatsID = stub;
      stub.resolves(Failure.of<Stats, NoSuchElementError | StatsError>(new StatsError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const trial: Try<Stats, NoSuchElementError | StatsError | DataSourceError> = await statsInteractor.findByStatsID(StatsID.ofString('9016f5d7-654e-4903-bfc9-a89c40919e94').get());

      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | StatsError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.ofString('9016f5d7-654e-4903-bfc9-a89c40919e94').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.of(moment());

      const stub: SinonStub = sinon.stub();
      StatsOutlineQuery.prototype.findByVeauAccountID = stub;
      const outlines: StatsOutlines = StatsOutlines.ofArray([
        StatsOutline.of(
          statsID,
          language,
          region,
          term,
          name,
          unit,
          updatedAt
        )
      ]);
      stub.resolves(Success.of<StatsOutlines, StatsOutlinesError>(outlines));

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      const trial: Try<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsInteractor.findByVeauAccountID(VeauAccountID.ofString('cfd6a7f1-b583-443e-9831-bdfc7621b0d2').get(), Page.of(1).get());

      expect(trial.get()).toEqual(outlines);
    });
  });

  describe('save', () => {
    it('normal case', async () => {
      const statsID: StatsID = StatsID.ofString('9016f5d7-654e-4903-bfc9-a89c40919e94').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const term: Term = Term.MONTHLY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.of(moment());
      const items: StatsItems = StatsItems.ofArray([
        StatsItem.of(StatsItemID.ofString('e4acd635-c9bc-4957-ba4d-4d299a08949b').get(), StatsItemName.of('item1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.ofString('7680c494-158b-43ec-9846-d37d513cf4d8').get(), StatsItemName.of('item2'), StatsValues.empty())
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

      const spy: SinonSpy = sinon.spy();
      MySQL.prototype.transact = spy;

      const statsInteractor: StatsInteractor = kernel.get<StatsInteractor>(TYPE.StatsInteractor);
      await statsInteractor.save(stats, VeauAccountID.ofString('cfd6a7f1-b583-443e-9831-bdfc7621b0d2').get());

      expect(spy.called).toEqual(true);
    });
  });
});
