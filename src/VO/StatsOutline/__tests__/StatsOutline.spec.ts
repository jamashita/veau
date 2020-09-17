import { UUID } from '@jamashita/publikum-uuid';
import { LanguageID } from '../../Language/LanguageID';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { RegionID } from '../../Region/RegionID';
import { MockTermID } from '../../Term/Mock/MockTermID';
import { Term } from '../../Term/Term';
import { TermID } from '../../Term/TermID';
import { StatsOutlineError } from '../Error/StatsOutlineError';
import { MockStatsID } from '../Mock/MockStatsID';
import { MockStatsName } from '../Mock/MockStatsName';
import { MockStatsUnit } from '../Mock/MockStatsUnit';
import { MockUpdatedAt } from '../Mock/MockUpdatedAt';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from '../StatsOutline';
import { StatsUnit } from '../StatsUnit';
import { UpdatedAt } from '../UpdatedAt';

describe('StatsOutline', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(7);

      const statsID: MockStatsID = new MockStatsID();
      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
      const termID: MockTermID = new MockTermID();
      const name: MockStatsName = new MockStatsName();
      const unit: MockStatsUnit = new MockStatsUnit();
      const updatedAt: MockUpdatedAt = new MockUpdatedAt();

      const statsOutline: StatsOutline = StatsOutline.of(statsID, languageID, regionID, termID, name, unit, updatedAt);

      expect(statsOutline.getStatsID()).toBe(statsID);
      expect(statsOutline.getLanguageID()).toBe(languageID);
      expect(statsOutline.getRegionID()).toBe(regionID);
      expect(statsOutline.getTermID()).toBe(termID);
      expect(statsOutline.getName()).toBe(name);
      expect(statsOutline.getUnit()).toBe(unit);
      expect(statsOutline.getUpdatedAt()).toBe(updatedAt);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      expect.assertions(7);

      const json: StatsOutlineJSON = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: UUID.v4().get(),
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      };

      const statsOutline: StatsOutline = StatsOutline.ofJSON(json);

      expect(statsOutline.getStatsID().get().get()).toBe(json.statsID);
      expect(statsOutline.getLanguageID().get().get()).toBe(json.languageID);
      expect(statsOutline.getRegionID().get().get()).toBe(json.regionID);
      expect(statsOutline.getTermID().get().get()).toBe(json.termID);
      expect(statsOutline.getName().get()).toBe(json.name);
      expect(statsOutline.getUnit().get()).toBe(json.unit);
      expect(statsOutline.getUpdatedAt().toString()).toBe(json.updatedAt);
    });

    it('contains malformat statsID', () => {
      expect.assertions(1);

      const json: StatsOutlineJSON = {
        statsID: 'illegal uuid',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: UUID.v4().get(),
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      };

      expect(() => {
        StatsOutline.ofJSON(json);
      }).toThrow(StatsOutlineError);
    });

    it('contains malformat languageID', () => {
      expect.assertions(1);

      const json: StatsOutlineJSON = {
        statsID: UUID.v4().get(),
        languageID: 'illegal uuid',
        regionID: UUID.v4().get(),
        termID: UUID.v4().get(),
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      };

      expect(() => {
        StatsOutline.ofJSON(json);
      }).toThrow(StatsOutlineError);
    });

    it('contains malformat regionID', () => {
      expect.assertions(1);

      const json: StatsOutlineJSON = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: 'illegal uuid',
        termID: UUID.v4().get(),
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      };

      expect(() => {
        StatsOutline.ofJSON(json);
      }).toThrow(StatsOutlineError);
    });

    it('contains malformat termID', () => {
      expect.assertions(1);

      const json: StatsOutlineJSON = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 'illegal uuid',
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      };

      expect(() => {
        StatsOutline.ofJSON(json);
      }).toThrow(StatsOutlineError);
    });

    it('contains malformat updatedAt', () => {
      expect.assertions(1);

      const json: StatsOutlineJSON = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: UUID.v4().get(),
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01'
      };

      expect(() => {
        StatsOutline.ofJSON(json);
      }).toThrow(StatsOutlineError);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      expect.assertions(7);

      const row: StatsOutlineRow = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: UUID.v4().get(),
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      };

      const statsOutline: StatsOutline = StatsOutline.ofRow(row);

      expect(statsOutline.getStatsID().get().get()).toBe(row.statsID);
      expect(statsOutline.getLanguageID().get().get()).toBe(row.languageID);
      expect(statsOutline.getRegionID().get().get()).toBe(row.regionID);
      expect(statsOutline.getTermID().get().get()).toBe(row.termID);
      expect(statsOutline.getName().get()).toBe(row.name);
      expect(statsOutline.getUnit().get()).toBe(row.unit);
      expect(statsOutline.getUpdatedAt().toString()).toBe(row.updatedAt);
    });

    it('contains malformat statsID', () => {
      expect.assertions(1);

      const row: StatsOutlineRow = {
        statsID: 'illegal uuid',
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: UUID.v4().get(),
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      };

      expect(() => {
        StatsOutline.ofRow(row);
      }).toThrow(StatsOutlineError);
    });

    it('contains malformat languageID', () => {
      expect.assertions(1);

      const row: StatsOutlineRow = {
        statsID: UUID.v4().get(),
        languageID: 'illegal uuid',
        regionID: UUID.v4().get(),
        termID: UUID.v4().get(),
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      };

      expect(() => {
        StatsOutline.ofRow(row);
      }).toThrow(StatsOutlineError);
    });

    it('contains malformat regionID', () => {
      expect.assertions(1);

      const row: StatsOutlineRow = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: 'illegal uuid',
        termID: UUID.v4().get(),
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      };

      expect(() => {
        StatsOutline.ofRow(row);
      }).toThrow(StatsOutlineError);
    });

    it('contains malformat termID', () => {
      expect.assertions(1);

      const row: StatsOutlineRow = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 'illegal uuid',
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      };

      expect(() => {
        StatsOutline.ofRow(row);
      }).toThrow(StatsOutlineError);
    });

    it('contains malformat updatedAt', () => {
      expect.assertions(1);

      const row: StatsOutlineRow = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: UUID.v4().get(),
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01'
      };

      expect(() => {
        StatsOutline.ofRow(row);
      }).toThrow(StatsOutlineError);
    });
  });

  describe('default', () => {
    it('id will be generated, data are empty', () => {
      expect.assertions(6);

      const outline: StatsOutline = StatsOutline.default();

      expect(outline.getStatsID().get().get()).toHaveLength(UUID.size());
      expect(outline.getLanguageID()).toBe(LanguageID.empty());
      expect(outline.getRegionID()).toBe(RegionID.empty());
      expect(outline.getTermID()).toBe(Term.DAILY.getTermID());
      expect(outline.getName()).toBe(StatsName.empty());
      expect(outline.getUnit()).toBe(StatsUnit.empty());
    });
  });

  describe('validate', () => {
    it('normal case', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        languageID: 'miaow',
        regionID: 'moin',
        termID: 'doodle',
        name: 'off',
        unit: 'on',
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect.assertions(5);

      expect(StatsOutline.validate(null)).toBe(false);
      expect(StatsOutline.validate(undefined)).toBe(false);
      expect(StatsOutline.validate(56)).toBe(false);
      expect(StatsOutline.validate('fjafsd')).toBe(false);
      expect(StatsOutline.validate(false)).toBe(false);
    });

    it('returns false because statsID is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        languageID: 'miaow',
        regionID: 'moin',
        termID: 'doodle',
        name: 'off',
        unit: 'on',
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because statsID is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 1,
        languageID: 'miaow',
        regionID: 'moin',
        termID: 'doodle',
        name: 'off',
        unit: 'on',
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because languageID is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        regionID: 'moin',
        termID: 'doodle',
        name: 'off',
        unit: 'on',
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because languageID is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        languageID: 1,
        regionID: 'moin',
        termID: 'doodle',
        name: 'off',
        unit: 'on',
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because regionID is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        languageID: 'miaow',
        termID: 'doodle',
        name: 'off',
        unit: 'on',
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because regionID is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        languageID: 'miaow',
        regionID: 1,
        termID: 'doodle',
        name: 'off',
        unit: 'on',
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because termID is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        languageID: 'miaow',
        regionID: 'moin',
        name: 'off',
        unit: 'on',
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because name is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        languageID: 'miaow',
        regionID: 'moin',
        termID: 'doodle',
        unit: 'on',
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because name is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        languageID: 'miaow',
        regionID: 'moin',
        termID: 'doodle',
        name: 1,
        unit: 'on',
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because unit is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        languageID: 'miaow',
        regionID: 'moin',
        termID: 'doodle',
        name: 'off',
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because unit is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        languageID: 'miaow',
        regionID: 'moin',
        termID: 'doodle',
        name: 'off',
        unit: 1,
        updatedAt: 'today'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because updatedAt is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        languageID: 'miaow',
        regionID: 'moin',
        termID: 'doodle',
        name: 'off',
        unit: 'on'
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });

    it('returns false because updatedAt is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        statsID: 'oink',
        languageID: 'miaow',
        regionID: 'moin',
        termID: 'doodle',
        name: 'off',
        unit: 'on',
        updatedAt: 1
      };

      expect(StatsOutline.validate(n)).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      expect.assertions(9);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();
      const uuid7: UUID = UUID.v4();
      const uuid8: UUID = UUID.v4();
      const statsOutline1: StatsOutline = StatsOutline.of(
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
        new MockTermID(uuid7),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline2: StatsOutline = StatsOutline.of(
        new MockStatsID(uuid2),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
        new MockTermID(uuid7),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline3: StatsOutline = StatsOutline.of(
        new MockStatsID(uuid1),
        new MockLanguageID(uuid4),
        new MockRegionID(uuid5),
        new MockTermID(uuid7),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline4: StatsOutline = StatsOutline.of(
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid6),
        new MockTermID(uuid7),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline5: StatsOutline = StatsOutline.of(
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
        new MockTermID(uuid8),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline6: StatsOutline = StatsOutline.of(
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
        new MockTermID(uuid7),
        new MockStatsName('NO TOFU'),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline7: StatsOutline = StatsOutline.of(
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
        new MockTermID(uuid7),
        new MockStatsName(),
        new MockStatsUnit('NO TOFU'),
        new MockUpdatedAt()
      );
      const statsOutline8: StatsOutline = StatsOutline.of(
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
        new MockTermID(uuid7),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt({
          year: 2070
        })
      );
      const statsOutline9: StatsOutline = StatsOutline.of(
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
        new MockTermID(uuid7),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );

      expect(statsOutline1.equals(statsOutline1)).toBe(true);
      expect(statsOutline1.equals(statsOutline2)).toBe(false);
      expect(statsOutline1.equals(statsOutline3)).toBe(false);
      expect(statsOutline1.equals(statsOutline4)).toBe(false);
      expect(statsOutline1.equals(statsOutline5)).toBe(false);
      expect(statsOutline1.equals(statsOutline6)).toBe(false);
      expect(statsOutline1.equals(statsOutline7)).toBe(false);
      expect(statsOutline1.equals(statsOutline8)).toBe(false);
      expect(statsOutline1.equals(statsOutline9)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const asOf: string = '2000-01-01 00:00:00';
      const statsOutline: StatsOutline = StatsOutline.of(
        StatsID.of(uuid1),
        LanguageID.of(uuid2),
        RegionID.of(uuid3),
        TermID.of(uuid4),
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString(asOf)
      );

      expect(statsOutline.toJSON()).toStrictEqual({
        statsID: uuid1.get(),
        languageID: uuid2.get(),
        regionID: uuid3.get(),
        termID: uuid4.get(),
        name: 'name1',
        unit: 'unit1',
        updatedAt: asOf
      });
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const name: string = 'name4';
      const unit: string = 'unit1';
      const asOf: string = '2000-01-01 00:00:00';
      const statsOutline: StatsOutline = StatsOutline.of(
        StatsID.of(uuid1),
        LanguageID.of(uuid2),
        RegionID.of(uuid3),
        TermID.of(uuid4),
        StatsName.of(name),
        StatsUnit.of(unit),
        UpdatedAt.ofString(asOf)
      );

      expect(statsOutline.toString()).toBe(
        `${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${uuid4.get()} ${name} ${unit} ${asOf}`
      );
    });
  });

  describe('isFilled', () => {
    it('returns true is language, region, name and unit are filled', () => {
      expect.assertions(7);

      const statsOutline1: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        LanguageID.empty(),
        RegionID.empty(),
        new MockTermID(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline2: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguageID(),
        RegionID.empty(),
        new MockTermID(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline3: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        LanguageID.empty(),
        new MockRegionID(),
        new MockTermID(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline4: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
        new MockTermID(),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline5: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
        new MockTermID(),
        new MockStatsName('stats name'),
        new MockStatsUnit(),
        new MockUpdatedAt()
      );
      const statsOutline6: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
        new MockTermID(),
        new MockStatsName(),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt()
      );
      const statsOutline7: StatsOutline = StatsOutline.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
        new MockTermID(),
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt()
      );

      expect(statsOutline1.isFilled()).toBe(false);
      expect(statsOutline2.isFilled()).toBe(false);
      expect(statsOutline3.isFilled()).toBe(false);
      expect(statsOutline4.isFilled()).toBe(false);
      expect(statsOutline5.isFilled()).toBe(false);
      expect(statsOutline6.isFilled()).toBe(false);
      expect(statsOutline7.isFilled()).toBe(true);
    });
  });
});
