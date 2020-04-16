import sinon, { SinonSpy } from 'sinon';
import { StatsOutlineError } from '../../Error/StatsOutlineError';
import { Superposition } from '../../General/Superposition/Superposition';
import { ISO3166 } from '../ISO3166';
import { ISO639 } from '../ISO639';
import { Language } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { MockLanguage } from '../Mock/MockLanguage';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockRegion } from '../Mock/MockRegion';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockStatsID } from '../Mock/MockStatsID';
import { MockStatsName } from '../Mock/MockStatsName';
import { MockStatsUnit } from '../Mock/MockStatsUnit';
import { MockTerm } from '../Mock/MockTerm';
import { MockUpdatedAt } from '../Mock/MockUpdatedAt';
import { Region } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from '../StatsOutline';
import { StatsUnit } from '../StatsUnit';
import { Term } from '../Term';
import { UpdatedAt } from '../UpdatedAt';

// DONE
describe('StatsOutline', () => {
  describe('of', () => {
    it('normal case', () => {
      const statsID: MockStatsID = new MockStatsID();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: MockTerm = new MockTerm();
      const name: MockStatsName = new MockStatsName();
      const unit: MockStatsUnit = new MockStatsUnit();
      const updatedAt: MockUpdatedAt = new MockUpdatedAt();

      const statsOutline: StatsOutline = StatsOutline.of(
        statsID,
        language,
        region,
        term,
        name,
        unit,
        updatedAt
      );

      expect(statsOutline.getStatsID()).toBe(statsID);
      expect(statsOutline.getLanguage()).toBe(language);
      expect(statsOutline.getRegion()).toBe(region);
      expect(statsOutline.getTerm()).toBe(term);
      expect(statsOutline.getName()).toBe(name);
      expect(statsOutline.getUnit()).toBe(unit);
      expect(statsOutline.getUpdatedAt()).toBe(updatedAt);
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

      const superposition: Superposition<StatsOutline, StatsOutlineError> = StatsOutline.ofJSON(json);

      expect(superposition.isSuccess()).toEqual(true);
      const statsOutline: StatsOutline = superposition.get();
      expect(statsOutline.getStatsID().get().get()).toEqual(json.statsID);
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsOutline, StatsOutlineError> = StatsOutline.ofJSON(json);

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsOutlineError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlineError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains malformat termID', () => {
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
        termID: -1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsOutline, StatsOutlineError> = StatsOutline.ofJSON(json);

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsOutlineError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlineError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains malformat updatedAt', () => {
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsOutline, StatsOutlineError> = StatsOutline.ofJSON(json);

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsOutlineError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlineError);
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

      const superposition: Superposition<StatsOutline, StatsOutlineError> = StatsOutline.ofRow(row);

      expect(superposition.isSuccess()).toEqual(true);
      const statsOutline: StatsOutline = superposition.get();
      expect(statsOutline.getStatsID().get().get()).toEqual(row.statsID);
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsOutline, StatsOutlineError> = StatsOutline.ofRow(row);

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsOutlineError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlineError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains malformat termID', () => {
      const row: StatsOutlineRow = {
        statsID: '0ec47089-24d3-4035-a27d-b636bd7a5170',
        languageID: 1,
        languageName: 'language1',
        languageEnglishName: 'englishLanguage1',
        iso639: 'lang1',
        regionID: 2,
        regionName: 'region1',
        iso3166: 'regn1',
        termID: -1,
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      };

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsOutline, StatsOutlineError> = StatsOutline.ofRow(row);

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsOutlineError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlineError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains malformat updatedAt', () => {
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsOutline, StatsOutlineError> = StatsOutline.ofRow(row);

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsOutlineError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlineError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      const statsID1: MockStatsID = new MockStatsID();
      const statsID2: MockStatsID = new MockStatsID();
      const statsOutline1: StatsOutline = StatsOutline.of(
        statsID1,
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline2: StatsOutline = StatsOutline.of(
        statsID2,
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline3: StatsOutline = StatsOutline.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion(),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline4: StatsOutline = StatsOutline.of(
        statsID1,
        new MockLanguage(),
        new MockRegion({
          regionID: new MockRegionID(2)
        }),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline5: StatsOutline = StatsOutline.of(
        statsID1,
        new MockLanguage(),
        new MockRegion(),
        new MockTerm({
          id: 8
        }),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline6: StatsOutline = StatsOutline.of(
        statsID1,
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsName('NO TOFU'),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline7: StatsOutline = StatsOutline.of(
        statsID1,
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit('NO TOFU'),
        new MockUpdatedAt()
      );
      const statsOutline8: StatsOutline = StatsOutline.of(
        statsID1,
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt({
          year: 2070
        })
      );
      const statsOutline9: StatsOutline = StatsOutline.of(
        statsID1,
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
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
      const statsOutline: StatsOutline = StatsOutline.of(
        StatsID.ofString('bfb0ebff-fc8c-450e-9265-82fa4938ae94').get(),
        Language.of(
          LanguageID.of(1),
          LanguageName.of('language1'),
          LanguageName.of('englishname1'),
          ISO639.of('lang1')
        ),
        Region.of(
          RegionID.of(1),
          RegionName.of('region1'),
          ISO3166.of('regn1')
        ),
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
      const at: string = '2000-01-01 00:00:00';
      const updatedAt: UpdatedAt = UpdatedAt.ofString(at).get();
      const statsOutline: StatsOutline = StatsOutline.of(
        StatsID.ofString(id1).get(),
        Language.of(
          LanguageID.of(id2),
          LanguageName.of(name1),
          LanguageName.of(name2),
          ISO639.of(iso639)
        ),
        Region.of(
          RegionID.of(id3),
          RegionName.of(name3),
          ISO3166.of(iso3166)
        ),
        term,
        StatsName.of(name4),
        StatsUnit.of(unit),
        updatedAt
      );

      expect(statsOutline.toString()).toEqual(`${id1} ${id2} ${name1} ${name2} ${iso639} ${id3} ${name3} ${iso3166} ${term.toString()} ${name4} ${unit} ${at}`);
    });
  });

  describe('isFilled', () => {
    it('returns true is language, region, name and unit are filled', () => {
      const statsOutline1: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline2: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion(),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline3: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion({
          regionID: new MockRegionID(3)
        }),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline4: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(4)
        }),
        new MockRegion({
          regionID: new MockRegionID(3)
        }),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline5: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(4)
        }),
        new MockRegion({
          regionID: new MockRegionID(3)
        }),
        new MockTerm(),
        new MockStatsName('stats name'),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline6: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(4)
        }),
        new MockRegion({
          regionID: new MockRegionID(3)
        }),
        new MockTerm(),
        new MockStatsName(),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt()
      );
      const statsOutline7: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(4)
        }),
        new MockRegion({
          regionID: new MockRegionID(3)
        }),
        new MockTerm(),
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt()
      );

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
      const statsID: MockStatsID = new MockStatsID();
      const language: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(10)
      });
      const region: MockRegion = new MockRegion({
        regionID: new MockRegionID(30)
      });
      const term: MockTerm = new MockTerm();
      const name: MockStatsName = new MockStatsName();
      const unit: MockStatsUnit = new MockStatsUnit();
      const updatedAt: MockUpdatedAt = new MockUpdatedAt();

      const statsOutline: StatsOutline = StatsOutline.of(statsID, language, region, term, name, unit, updatedAt);
      const copy: StatsOutline = statsOutline.copy();

      expect(statsOutline).not.toBe(copy);
      expect(statsOutline.getStatsID()).toBe(statsID);
      expect(statsOutline.getLanguage()).toBe(language);
      expect(statsOutline.getRegion()).toBe(region);
      expect(statsOutline.getTerm()).toBe(term);
      expect(statsOutline.getName()).toBe(name);
      expect(statsOutline.getUnit()).toBe(unit);
      expect(statsOutline.getUpdatedAt()).toBe(updatedAt);
    });
  });
});
