import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { StatsOutlineError } from '../../veau-error/StatsOutlineError';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../ISO3166';
import { ISO639 } from '../ISO639';
import { Language } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { Region } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from '../StatsOutline';
import { StatsUnit } from '../StatsUnit';
import { Term } from '../Term';
import { UpdatedAt } from '../UpdatedAt';

describe('StatsOutline', () => {
  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      const statsOutline1: StatsOutline = StatsOutline.of(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );
      const statsOutline2: StatsOutline = StatsOutline.of(
        StatsID.of('f19bca43-511f-4d8c-bd12-af27bf0cd429').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );
      const statsOutline3: StatsOutline = StatsOutline.of(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(2), LanguageName.of('language2'), LanguageName.of('LANGUAGE2'), ISO639.of('lang2')),
        Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );
      const statsOutline4: StatsOutline = StatsOutline.of(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.of(RegionID.of(2), RegionName.of('region2'), ISO3166.of('REGION2')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );
      const statsOutline5: StatsOutline = StatsOutline.of(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.WEEKLY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );
      const statsOutline6: StatsOutline = StatsOutline.of(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name2'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );
      const statsOutline7: StatsOutline = StatsOutline.of(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit2'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );
      const statsOutline8: StatsOutline = StatsOutline.of(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-02 00:00:00').get()
      );
      const statsOutline9: StatsOutline = StatsOutline.of(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );

      expect(statsOutline1.equals(statsOutline1)).toEqual(true);
      expect(statsOutline1.equals(statsOutline2)).toEqual(false);
      expect(statsOutline1.equals(statsOutline3)).toEqual(false);
      expect(statsOutline1.equals(statsOutline4)).toEqual(false);
      expect(statsOutline1.equals(statsOutline5)).toEqual(false);
      expect(statsOutline1.equals(statsOutline6)).toEqual(false);
      expect(statsOutline1.equals(statsOutline7)).toEqual(false);
      expect(statsOutline1.equals(statsOutline8)).toEqual(false);
      expect(statsOutline1.equals(statsOutline9)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.of('bfb0ebff-fc8c-450e-9265-82fa4938ae94').get();
      const statsOutline: StatsOutline = StatsOutline.of(
        statsID,
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('englishname1'), ISO639.of('lang1')),
        Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('regn1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );

      expect(statsOutline.toJSON()).toEqual({
        statsID: 'bfb0ebff-fc8c-450e-9265-82fa4938ae94',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'englishname1',
          iso639: 'lang1'
        },
        region: {
          regionID: 1,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 1,
        name: 'name1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      });
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id1: string = 'bfb0ebff-fc8c-450e-9265-82fa4938ae94';
      const id2: number = 1;
      const id3: number = 3;
      const name1: string = 'language1';
      const name2: string = 'englishname1';
      const name3: string = 'region1';
      const name4: string = 'name1';
      const iso639: string = 'lang1';
      const iso3166: string = 'regn1';
      const term: Term = Term.DAILY;
      const unit: string = 'unit1';
      const at: UpdatedAt = UpdatedAt.ofString('2000-01-01 00:00:00').get();
      const statsOutline: StatsOutline = StatsOutline.of(
        StatsID.of(id1).get(),
        Language.of(LanguageID.of(id2), LanguageName.of(name1), LanguageName.of(name2), ISO639.of(iso639)),
        Region.of(RegionID.of(id3), RegionName.of(name3), ISO3166.of(iso3166)),
        term,
        StatsName.of(name4),
        StatsUnit.of(unit),
        at
      );

      expect(statsOutline.toString()).toEqual(`${id1} ${id2} ${name1} ${name2} ${iso639} ${id3} ${name3} ${iso3166} ${term.toString()} ${name4} ${unit} ${at.toString()}`);
    });
  });

  describe('isFilled', () => {
    it('returns true is language, region, name and unit are filled', () => {
      const statsOutline1: StatsOutline = StatsOutline.of(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.default(), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get());
      const statsOutline2: StatsOutline = StatsOutline.of(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get());
      const statsOutline3: StatsOutline = StatsOutline.of(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.default(), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get());
      const statsOutline4: StatsOutline = StatsOutline.of(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get());
      const statsOutline5: StatsOutline = StatsOutline.of(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get());
      const statsOutline6: StatsOutline = StatsOutline.of(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 00:00:00').get());
      const statsOutline7: StatsOutline = StatsOutline.of(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 00:00:00').get());

      expect(statsOutline1.isFilled()).toEqual(false);
      expect(statsOutline2.isFilled()).toEqual(false);
      expect(statsOutline3.isFilled()).toEqual(false);
      expect(statsOutline4.isFilled()).toEqual(false);
      expect(statsOutline5.isFilled()).toEqual(false);
      expect(statsOutline6.isFilled()).toEqual(false);
      expect(statsOutline7.isFilled()).toEqual(true);
    });
  });

  describe('copy', () => {
    it('every properties are copied', () => {
      const statsID: StatsID = StatsID.of('f330c618-6127-46d1-ba10-a9f6af458b4c').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(2), RegionName.of('region'), ISO3166.of('AFG'));
      const term: Term = Term.DAILY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01 00:00:00').get();

      const statsOutline: StatsOutline = StatsOutline.of(statsID, language, region, term, name, unit, updatedAt);
      const copy: StatsOutline = statsOutline.copy();

      expect(statsOutline).not.toBe(copy);
      expect(statsOutline.getStatsID()).toEqual(statsID);
      expect(statsOutline.getLanguage()).toEqual(language);
      expect(statsOutline.getRegion()).toEqual(region);
      expect(statsOutline.getTerm()).toEqual(term);
      expect(statsOutline.getName()).toEqual(name);
      expect(statsOutline.getUnit()).toEqual(unit);
      expect(statsOutline.getUpdatedAt()).toEqual(updatedAt);
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.of('af272303-df5d-4d34-8604-398920b7d2bb').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language english name 1'), ISO639.of('lang1'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('regn1'));
      const term: Term = Term.ANNUAL;
      const name: StatsName = StatsName.of('name1');
      const unit: StatsUnit = StatsUnit.of('unit1');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01 00:00:00').get();

      const statsOutline: StatsOutline = StatsOutline.of(statsID, language, region, term, name, unit, updatedAt);

      expect(statsOutline.getStatsID()).toEqual(statsID);
      expect(statsOutline.getLanguage()).toEqual(language);
      expect(statsOutline.getRegion()).toEqual(region);
      expect(statsOutline.getTerm()).toEqual(term);
      expect(statsOutline.getName()).toEqual(name);
      expect(statsOutline.getUnit()).toEqual(unit);
      expect(statsOutline.getUpdatedAt()).toEqual(updatedAt);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      const json: StatsOutlineJSON = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'english name 1',
          iso639: 'lang1'
        },
        region: {
          regionID: 1,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      };

      const trial: Try<StatsOutline, StatsOutlineError> = StatsOutline.ofJSON(json);

      expect(trial.isSuccess()).toEqual(true);
      const statsOutline: StatsOutline = trial.get();
      expect(statsOutline.getStatsID().get()).toEqual(json.statsID);
      expect(statsOutline.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
      expect(statsOutline.getLanguage().getName().get()).toEqual(json.language.name);
      expect(statsOutline.getLanguage().getEnglishName().get()).toEqual(json.language.englishName);
      expect(statsOutline.getLanguage().getISO639().get()).toEqual(json.language.iso639);
      expect(statsOutline.getRegion().getRegionID().get()).toEqual(json.region.regionID);
      expect(statsOutline.getRegion().getName().get()).toEqual(json.region.name);
      expect(statsOutline.getRegion().getISO3166().get()).toEqual(json.region.iso3166);
      expect(statsOutline.getTerm().getID()).toEqual(json.termID);
      expect(statsOutline.getName().get()).toEqual(json.name);
      expect(statsOutline.getUnit().get()).toEqual(json.unit);
      expect(statsOutline.getUpdatedAt().toString()).toEqual(json.updatedAt);
    });

    it('contains malformat statsID', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const json: StatsOutlineJSON = {
        statsID: 'illegal uuid',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'english name 1',
          iso639: 'lang1'
        },
        region: {
          regionID: 1,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      };

      const trial: Try<StatsOutline, StatsOutlineError> = StatsOutline.ofJSON(json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsOutlineError) => {
        expect(err).toBeInstanceOf(StatsOutlineError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains malformat asOf', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const json: StatsOutlineJSON = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'english name 1',
          iso639: 'lang1'
        },
        region: {
          regionID: 1,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01'
      };

      const trial: Try<StatsOutline, StatsOutlineError> = StatsOutline.ofJSON(json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsOutlineError) => {
        expect(err).toBeInstanceOf(StatsOutlineError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: StatsOutlineRow = {
        statsID: '0ec47089-24d3-4035-a27d-b636bd7a5170',
        languageID: 1,
        languageName: 'language1',
        languageEnglishName: 'englishLanguage1',
        iso639: 'lang1',
        regionID: 2,
        regionName: 'region1',
        iso3166: 'regn1',
        termID: 3,
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      };

      const trial: Try<StatsOutline, StatsOutlineError> = StatsOutline.ofRow(row);

      expect(trial.isSuccess()).toEqual(true);
      const statsOutline: StatsOutline = trial.get();
      expect(statsOutline.getStatsID().get()).toEqual(row.statsID);
      expect(statsOutline.getLanguage().getLanguageID().get()).toEqual(row.languageID);
      expect(statsOutline.getLanguage().getName().get()).toEqual(row.languageName);
      expect(statsOutline.getLanguage().getEnglishName().get()).toEqual(row.languageEnglishName);
      expect(statsOutline.getLanguage().getISO639().get()).toEqual(row.iso639);
      expect(statsOutline.getRegion().getRegionID().get()).toEqual(row.regionID);
      expect(statsOutline.getRegion().getName().get()).toEqual(row.regionName);
      expect(statsOutline.getRegion().getISO3166().get()).toEqual(row.iso3166);
      expect(statsOutline.getTerm().getID()).toEqual(row.termID);
      expect(statsOutline.getName().get()).toEqual(row.name);
      expect(statsOutline.getUnit().get()).toEqual(row.unit);
      expect(statsOutline.getUpdatedAt().toString()).toEqual(row.updatedAt);
    });

    it('contains malformat statsID', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const row: StatsOutlineRow = {
        statsID: 'illegal uuid',
        languageID: 1,
        languageName: 'language1',
        languageEnglishName: 'englishLanguage1',
        iso639: 'lang1',
        regionID: 2,
        regionName: 'region1',
        iso3166: 'regn1',
        termID: 3,
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      };

      const trial: Try<StatsOutline, StatsOutlineError> = StatsOutline.ofRow(row);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsOutlineError) => {
        expect(err).toBeInstanceOf(StatsOutlineError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains malformat asOf', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const row: StatsOutlineRow = {
        statsID: '0ec47089-24d3-4035-a27d-b636bd7a5170',
        languageID: 1,
        languageName: 'language1',
        languageEnglishName: 'englishLanguage1',
        iso639: 'lang1',
        regionID: 2,
        regionName: 'region1',
        iso3166: 'regn1',
        termID: 3,
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01'
      };

      const trial: Try<StatsOutline, StatsOutlineError> = StatsOutline.ofRow(row);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsOutlineError) => {
        expect(err).toBeInstanceOf(StatsOutlineError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
