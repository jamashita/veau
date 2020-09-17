import { UUID } from '@jamashita/publikum-uuid';
import { MockLanguage } from '../../Language/Mock/MockLanguage';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockLocale } from '../../Locale/Mock/MockLocale';
import { MockRegion } from '../../Region/Mock/MockRegion';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { MockStatsID } from '../../StatsOutline/Mock/MockStatsID';
import { MockStatsOutline } from '../../StatsOutline/Mock/MockStatsOutline';
import { MockTerm } from '../../Term/Mock/MockTerm';
import { MockTermID } from '../../Term/Mock/MockTermID';
import { MockTerms } from '../../Term/Mock/MockTerms';
import { StatsListItemError } from '../Error/StatsListItemError';
import { StatsListItem } from '../StatsListItem';

describe('StatsListItem', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(4);

      const outline: MockStatsOutline = new MockStatsOutline();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: MockTerm = new MockTerm();

      const statsListItem: StatsListItem = StatsListItem.of(outline, language, region, term);

      expect(statsListItem.getOutline()).toBe(outline);
      expect(statsListItem.getLanguage()).toBe(language);
      expect(statsListItem.getRegion()).toBe(region);
      expect(statsListItem.getTerm()).toBe(term);
    });
  });

  describe('ofOutline', () => {
    it('normal case', () => {
      expect.assertions(4);

      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
      const termID: MockTermID = new MockTermID();
      const outline: MockStatsOutline = new MockStatsOutline({
        languageID,
        regionID,
        termID
      });
      const language: MockLanguage = new MockLanguage({
        languageID
      });
      const region: MockRegion = new MockRegion({
        regionID
      });
      const term: MockTerm = new MockTerm({
        termID
      });
      const locale: MockLocale = new MockLocale({
        languages: [
          new MockLanguage(),
          new MockLanguage(),
          language,
          new MockLanguage(),
          new MockLanguage(),
          new MockLanguage()
        ],
        regions: [
          new MockRegion(),
          new MockRegion(),
          new MockRegion(),
          new MockRegion(),
          region,
          new MockRegion(),
          new MockRegion()
        ]
      });
      const terms: MockTerms = new MockTerms(
        new MockTerm(),
        term,
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm()
      );

      const statsListItem: StatsListItem = StatsListItem.ofOutline(
        outline,
        locale,
        terms
      );

      expect(statsListItem.getOutline()).toBe(outline);
      expect(statsListItem.getLanguage()).toBe(language);
      expect(statsListItem.getRegion()).toBe(region);
      expect(statsListItem.getTerm()).toBe(term);
    });

    it('no match language', () => {
      expect.assertions(1);

      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
      const termID: MockTermID = new MockTermID();
      const outline: MockStatsOutline = new MockStatsOutline({
        languageID,
        regionID,
        termID
      });
      const region: MockRegion = new MockRegion({
        regionID
      });
      const term: MockTerm = new MockTerm({
        termID
      });
      const locale: MockLocale = new MockLocale({
        languages: [new MockLanguage(), new MockLanguage(), new MockLanguage(), new MockLanguage(), new MockLanguage()],
        regions: [
          new MockRegion(),
          new MockRegion(),
          new MockRegion(),
          new MockRegion(),
          region,
          new MockRegion(),
          new MockRegion()
        ]
      });
      const terms: MockTerms = new MockTerms(
        new MockTerm(),
        term,
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm()
      );

      expect(() => {
        StatsListItem.ofOutline(
          outline,
          locale,
          terms
        );
      }).toThrow(StatsListItemError);
    });

    it('no match region', () => {
      expect.assertions(1);

      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
      const termID: MockTermID = new MockTermID();
      const outline: MockStatsOutline = new MockStatsOutline({
        languageID,
        regionID,
        termID
      });
      const language: MockLanguage = new MockLanguage({
        languageID
      });
      const term: MockTerm = new MockTerm({
        termID
      });
      const locale: MockLocale = new MockLocale({
        languages: [
          new MockLanguage(),
          new MockLanguage(),
          language,
          new MockLanguage(),
          new MockLanguage(),
          new MockLanguage()
        ],
        regions: [
          new MockRegion(),
          new MockRegion(),
          new MockRegion(),
          new MockRegion(),
          new MockRegion(),
          new MockRegion()
        ]
      });
      const terms: MockTerms = new MockTerms(
        new MockTerm(),
        term,
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm()
      );

      expect(() => {
        StatsListItem.ofOutline(
          outline,
          locale,
          terms
        );
      }).toThrow(StatsListItemError);
    });

    it('no match term', () => {
      expect.assertions(1);

      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
      const termID: MockTermID = new MockTermID();
      const outline: MockStatsOutline = new MockStatsOutline({
        languageID,
        regionID,
        termID
      });
      const language: MockLanguage = new MockLanguage({
        languageID
      });
      const region: MockRegion = new MockRegion({
        regionID
      });
      const locale: MockLocale = new MockLocale({
        languages: [
          new MockLanguage(),
          new MockLanguage(),
          language,
          new MockLanguage(),
          new MockLanguage(),
          new MockLanguage()
        ],
        regions: [
          new MockRegion(),
          new MockRegion(),
          new MockRegion(),
          new MockRegion(),
          region,
          new MockRegion(),
          new MockRegion()
        ]
      });
      const terms: MockTerms = new MockTerms(
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm(),
        new MockTerm()
      );

      expect(() => {
        StatsListItem.ofOutline(
          outline,
          locale,
          terms
        );
      }).toThrow(StatsListItemError);
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
      const statsListItem1: StatsListItem = StatsListItem.of(
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
      const statsListItem2: StatsListItem = StatsListItem.of(
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
      const statsListItem3: StatsListItem = StatsListItem.of(
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
      const statsListItem4: StatsListItem = StatsListItem.of(
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
      const statsListItem5: StatsListItem = StatsListItem.of(
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
      const statsListItem6: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid3),
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
      const statsListItem7: StatsListItem = StatsListItem.of(
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
          regionID: new MockRegionID(uuid6)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        })
      );
      const statsListItem8: StatsListItem = StatsListItem.of(
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
          termID: new MockTermID(uuid8)
        })
      );
      const statsListItem9: StatsListItem = StatsListItem.of(
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

      expect(statsListItem1.equals(statsListItem1)).toBe(true);
      expect(statsListItem1.equals(statsListItem2)).toBe(false);
      expect(statsListItem1.equals(statsListItem3)).toBe(false);
      expect(statsListItem1.equals(statsListItem4)).toBe(false);
      expect(statsListItem1.equals(statsListItem5)).toBe(false);
      expect(statsListItem1.equals(statsListItem6)).toBe(false);
      expect(statsListItem1.equals(statsListItem7)).toBe(false);
      expect(statsListItem1.equals(statsListItem8)).toBe(false);
      expect(statsListItem1.equals(statsListItem9)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const statsListItem: StatsListItem = StatsListItem.of(
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

      expect(statsListItem.toString()).toBe(
        `${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${uuid4.get()}   2000-01-02 01:02:03 ${uuid2.get()}    ${uuid3.get()}   ${uuid4.get()} `
      );
    });
  });
});
