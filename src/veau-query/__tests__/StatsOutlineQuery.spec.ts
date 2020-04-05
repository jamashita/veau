import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { StatsOutlinesError } from '../../veau-error/StatsOutlinesError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { Limit } from '../../veau-vo/Limit';
import { Offset } from '../../veau-vo/Offset';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsName } from '../../veau-vo/StatsName';
import { StatsOutline } from '../../veau-vo/StatsOutline';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';
import { StatsUnit } from '../../veau-vo/StatsUnit';
import { Term } from '../../veau-vo/Term';
import { UpdatedAt } from '../../veau-vo/UpdatedAt';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { StatsOutlineQuery as StatsOutlineMySQLQuery } from '../MySQL/StatsOutlineQuery';
import { StatsOutlineQuery } from '../StatsOutlineQuery';

describe('StatsOutlineQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsOutlineQuery1: StatsOutlineQuery = container.get<StatsOutlineQuery>(TYPE.StatsOutlineQuery);
      const statsOutlineQuery2: StatsOutlineQuery = container.get<StatsOutlineQuery>(TYPE.StatsOutlineQuery);

      expect(statsOutlineQuery1).toBeInstanceOf(StatsOutlineQuery);
      expect(statsOutlineQuery1).toBe(statsOutlineQuery2);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      const outlines: StatsOutlines = StatsOutlines.of([
        StatsOutline.of(
          StatsID.of('c0e18d31-d026-4a84-af4f-d5d26c520600').get(),
          Language.of(
            LanguageID.of(1),
            LanguageName.of('lang1'),
            LanguageName.of('lang1'),
            ISO639.of('l1')
          ),
          Region.of(
            RegionID.of(2),
            RegionName.of('regn2'),
            ISO3166.of('r2')
          ),
          Term.DAILY,
          StatsName.of('stats1'),
          StatsUnit.of('unit1'),
          UpdatedAt.ofString('2000-01-01 00:00:00').get()
        ),
        StatsOutline.of(
          StatsID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307').get(),
          Language.of(
            LanguageID.of(2),
            LanguageName.of('lang2'),
            LanguageName.of('lang2'),
            ISO639.of('l2')
          ),
          Region.of(
            RegionID.of(3),
            RegionName.of('regn3'),
            ISO3166.of('r3')
          ),
          Term.WEEKLY,
          StatsName.of('stats2'),
          StatsUnit.of('unit2'),
          UpdatedAt.ofString('2001-01-01 00:00:00').get()
        )
      ]);
      const stub: SinonStub = sinon.stub();
      StatsOutlineMySQLQuery.prototype.findByVeauAccountID = stub;
      stub.resolves(Success.of<StatsOutlines, StatsOutlinesError>(outlines));

      const statsOutlineQuery: StatsOutlineQuery = container.get<StatsOutlineQuery>(TYPE.StatsOutlineQuery);
      const trial: Try<StatsOutlines, StatsOutlinesError> = await statsOutlineQuery.findByVeauAccountID(VeauAccountID.of('2ac64841-5267-48bc-8952-ba9ad1cb12d7').get(), Limit.of(2).get(), Offset.of(0).get());

      expect(trial.isSuccess()).toEqual(true);
      const statsOutlines: StatsOutlines = trial.get();

      expect(statsOutlines.size()).toEqual(2);
      for (let i: number = 0; i < statsOutlines.size(); i++) {
        const statsOutline: StatsOutline = statsOutlines.get(i).get();
        expect(statsOutline.getStatsID()).toEqual(outlines.get(i).get().getStatsID());
        expect(statsOutline.getLanguage().getLanguageID()).toEqual(outlines.get(i).get().getLanguage().getLanguageID());
        expect(statsOutline.getLanguage().getName()).toEqual(outlines.get(i).get().getLanguage().getName());
        expect(statsOutline.getLanguage().getEnglishName()).toEqual( outlines.get(i).get().getLanguage().getEnglishName());
        expect(statsOutline.getLanguage().getISO639()).toEqual(outlines.get(i).get().getLanguage().getISO639());
        expect(statsOutline.getRegion().getRegionID()).toEqual(outlines.get(i).get().getRegion().getRegionID());
        expect(statsOutline.getRegion().getName()).toEqual(outlines.get(i).get().getRegion().getName());
        expect(statsOutline.getRegion().getISO3166()).toEqual(outlines.get(i).get().getRegion().getISO3166());
        expect(statsOutline.getTerm()).toEqual(outlines.get(i).get().getTerm());
        expect(statsOutline.getName()).toEqual(outlines.get(i).get().getName());
        expect(statsOutline.getUnit()).toEqual(outlines.get(i).get().getUnit());
        expect(statsOutline.getUpdatedAt()).toEqual(outlines.get(i).get().getUpdatedAt());
      }
    });

    it('returns Failure when statsID is malformat', async () => {
      const stub: SinonStub = sinon.stub();
      StatsOutlineMySQLQuery.prototype.findByVeauAccountID = stub;
      stub.resolves(Failure.of<StatsOutlines, StatsOutlinesError>(new StatsOutlinesError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsOutlineQuery: StatsOutlineQuery = container.get<StatsOutlineQuery>(TYPE.StatsOutlineQuery);
      const trial: Try<StatsOutlines, StatsOutlinesError> = await statsOutlineQuery.findByVeauAccountID(VeauAccountID.of('2ac64841-5267-48bc-8952-ba9ad1cb12d7').get(), Limit.of(2).get(), Offset.of(0).get());

      expect(trial.isFailure()).toEqual(true);

      trial.match<void>(() => {
        spy1();
      }, (err: StatsOutlinesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlinesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
