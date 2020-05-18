import { UUID } from 'publikum';
import { MockLanguage } from '../Mock/MockLanguage';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockRegion } from '../Mock/MockRegion';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockStatsID } from '../Mock/MockStatsID';
import { MockStatsOutline } from '../Mock/MockStatsOutline';
import { MockTerm } from '../Mock/MockTerm';
import { MockTermID } from '../Mock/MockTermID';
import { StatsListItem } from '../StatsListItem';

describe('StatsListItem', () => {
  describe('of', () => {
    it('normal case', () => {
      const outline: MockStatsOutline = new MockStatsOutline();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: MockTerm = new MockTerm();

      const statsOutline: StatsListItem = StatsListItem.of(outline, language, region, term);

      expect(statsOutline.getOutline()).toBe(outline);
      expect(statsOutline.getLanguage()).toBe(language);
      expect(statsOutline.getRegion()).toBe(region);
      expect(statsOutline.getTerm()).toBe(term);
    });
  });

  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();
      const uuid7: UUID = UUID.v4();
      const uuid8: UUID = UUID.v4();
      const statsOutline1: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        })
      );
      const statsOutline2: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid2),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        })
      );
      const statsOutline3: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid4),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid4)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        })
      );
      const statsOutline4: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid6),
          termID: new MockTermID(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid6)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        })
      );
      const statsOutline5: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid8)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid8)
        })
      );
      const statsOutline6: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        })
      );

      expect(statsOutline1.equals(statsOutline1)).toBe(true);
      expect(statsOutline1.equals(statsOutline2)).toBe(false);
      expect(statsOutline1.equals(statsOutline3)).toBe(false);
      expect(statsOutline1.equals(statsOutline4)).toBe(false);
      expect(statsOutline1.equals(statsOutline5)).toBe(false);
      expect(statsOutline1.equals(statsOutline6)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const statsOutline: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid2),
          regionID: new MockRegionID(uuid3),
          termID: new MockTermID(uuid4)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid2)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid3)
        }),
        new MockTerm({
          termID: new MockTermID(uuid4)
        })
      );

      expect(statsOutline.toString()).toBe(
        `${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${uuid4.get()}   2000-01-02 01:02:03 ${uuid2.get()}    ${uuid3.get()}   ${uuid4.get()} `
      );
    });
  });
});
