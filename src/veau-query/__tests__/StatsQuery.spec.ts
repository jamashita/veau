import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsItems } from '../../veau-entity/StatsItems';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { StatsError } from '../../veau-error/StatsError';
import { None } from '../../veau-general/Optional/None';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
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
import { StatsQuery as StatsMySQLQuery } from '../MySQL/StatsQuery';
import { StatsQuery } from '../StatsQuery';

describe('StatsQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsQuery1: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsQuery);
      const statsQuery2: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsQuery);

      expect(statsQuery1).toBeInstanceOf(StatsQuery);
      expect(statsQuery1).toBe(statsQuery2);
    });
  });

  describe('findByStatsID', () => {
    it('normal case', async () => {
      const stats: Stats = Stats.of(
        StatsID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307').get(),
        Language.of(
          LanguageID.of(1),
          LanguageName.of('language1'),
          LanguageName.of('englishLanguage1'),
          ISO639.of('lang1')
        ),
        Region.of(
          RegionID.of(2),
          RegionName.of('region1'),
          ISO3166.of('regn1')
        ),
        Term.MONTHLY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.of('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
            StatsItemName.of('name1'),
            StatsValues.of([
              StatsValue.of(
                StatsItemID.of('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
                AsOf.ofString('2000-01-01').get(),
                NumericalValue.of(1)
              ),
              StatsValue.of(
                StatsItemID.of('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
                AsOf.ofString('2000-01-02').get(),
                NumericalValue.of(2)
              ),
              StatsValue.of(
                StatsItemID.of('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
                AsOf.ofString('2000-01-03').get(),
                NumericalValue.of(3)
              )
            ])
          ),
          StatsItem.of(
            StatsItemID.of('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
            StatsItemName.of('name2'),
            StatsValues.of([
              StatsValue.of(
                StatsItemID.of('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
                AsOf.ofString('2001-01-01').get(),
                NumericalValue.of(11)
              ),
              StatsValue.of(
                StatsItemID.of('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c').get(),
                AsOf.ofString('2001-01-02').get(),
                NumericalValue.of(12)
              )
            ])
          ),
          StatsItem.of(
            StatsItemID.of('2ac64841-5267-48bc-8952-ba9ad1cb12d7').get(),
            StatsItemName.of('name3'),
            StatsValues.of([
            ])
          )
        ]),
        None.of<AsOf>()
      );
      const stub: SinonStub = sinon.stub();
      StatsMySQLQuery.prototype.findByStatsID = stub;
      stub.resolves(Success.of<Stats, NoSuchElementError | StatsError>(stats));

      const statsQuery: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsQuery);
      const trial: Try<Stats, NoSuchElementError | StatsError> = await statsQuery.findByStatsID(StatsID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307').get());

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get().equals(stats)).toEqual(true);
    });

    it('returns Failure when statsID is malformat', async () => {
      const stub: SinonStub = sinon.stub();
      StatsMySQLQuery.prototype.findByStatsID = stub;
      stub.resolves(Failure.of<Stats, NoSuchElementError | StatsError>(new StatsError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsQuery);
      const trial: Try<Stats, NoSuchElementError | StatsError> = await statsQuery.findByStatsID(StatsID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307').get());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | StatsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when there is no results', async () => {
      const stub: SinonStub = sinon.stub();
      StatsMySQLQuery.prototype.findByStatsID = stub;
      stub.resolves(Failure.of<Stats, NoSuchElementError | StatsError>(new NoSuchElementError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = kernel.get<StatsQuery>(TYPE.StatsQuery);
      const trial: Try<Stats, NoSuchElementError | StatsError> = await statsQuery.findByStatsID(StatsID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307').get());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | StatsError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
