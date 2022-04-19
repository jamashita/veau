import { UUID } from '@jamashita/anden-uuid';
import { LanguageID } from '../../Language/LanguageID';
import { MockLanguage } from '../../Language/mock/MockLanguage';
import { MockLocale } from '../../Locale/mock/MockLocale';
import { MockRegion } from '../../Region/mock/MockRegion';
import { RegionID } from '../../Region/RegionID';
import { MockStatsOutline } from '../../StatsOutline/mock/MockStatsOutline';
import { StatsID } from '../../StatsOutline/StatsID';
import { Term } from '../../Term/Term';
import { TermID } from '../../Term/TermID';
import { Terms } from '../../Term/Terms';
import { StatsListItem } from '../StatsListItem';
import { StatsListItemError } from '../StatsListItemError';

describe('StatsListItem', () => {
  describe('of', () => {
    it('normal case', () => {
      const outline: MockStatsOutline = new MockStatsOutline();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: Term = Term.DAILY;

      const statsListItem: StatsListItem = StatsListItem.of(outline, language, region, term);

      expect(statsListItem.getOutline()).toBe(outline);
      expect(statsListItem.getLanguage()).toBe(language);
      expect(statsListItem.getRegion()).toBe(region);
      expect(statsListItem.getTerm()).toBe(term);
    });
  });

  describe('ofOutline', () => {
    it('normal case', () => {
      const languageID: LanguageID = LanguageID.of(UUID.v4());
      const regionID: RegionID = RegionID.of(UUID.v4());
      const termID: TermID = Term.QUARTERLY.getTermID();
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
      const terms: Terms = Terms.all();

      const statsListItem: StatsListItem = StatsListItem.ofOutline(
        outline,
        locale,
        terms
      );

      expect(statsListItem.getOutline()).toBe(outline);
      expect(statsListItem.getLanguage()).toBe(language);
      expect(statsListItem.getRegion()).toBe(region);
      expect(statsListItem.getTerm()).toBe(Term.QUARTERLY);
    });

    it('no match language', () => {
      const languageID: LanguageID = LanguageID.of(UUID.v4());
      const regionID: RegionID = RegionID.of(UUID.v4());
      const termID: TermID = TermID.of(UUID.v4());
      const outline: MockStatsOutline = new MockStatsOutline({
        languageID,
        regionID,
        termID
      });
      const region: MockRegion = new MockRegion({
        regionID
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
      const terms: Terms = Terms.all();

      expect(() => {
        StatsListItem.ofOutline(
          outline,
          locale,
          terms
        );
      }).toThrow(StatsListItemError);
    });

    it('no match region', () => {
      const languageID: LanguageID = LanguageID.of(UUID.v4());
      const regionID: RegionID = RegionID.of(UUID.v4());
      const termID: TermID = TermID.of(UUID.v4());
      const outline: MockStatsOutline = new MockStatsOutline({
        languageID,
        regionID,
        termID
      });
      const language: MockLanguage = new MockLanguage({
        languageID
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
      const terms: Terms = Terms.all();

      expect(() => {
        StatsListItem.ofOutline(
          outline,
          locale,
          terms
        );
      }).toThrow(StatsListItemError);
    });

    it('no match term', () => {
      const languageID: LanguageID = LanguageID.of(UUID.v4());
      const regionID: RegionID = RegionID.of(UUID.v4());
      const termID: TermID = TermID.of(UUID.v4());
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
      const terms: Terms = Terms.all();

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
    it('returns false if others given', () => {
      const item: StatsListItem = StatsListItem.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        Term.QUARTERLY
      );

      expect(item.equals(null)).toBe(false);
      expect(item.equals(undefined)).toBe(false);
      expect(item.equals('')).toBe(false);
      expect(item.equals('123')).toBe(false);
      expect(item.equals('abcd')).toBe(false);
      expect(item.equals(123)).toBe(false);
      expect(item.equals(0)).toBe(false);
      expect(item.equals(-12)).toBe(false);
      expect(item.equals(0.3)).toBe(false);
      expect(item.equals(false)).toBe(false);
      expect(item.equals(true)).toBe(false);
      expect(item.equals(Symbol('p'))).toBe(false);
      expect(item.equals(20n)).toBe(false);
      expect(item.equals({})).toBe(false);
      expect(item.equals([])).toBe(false);
      expect(item.equals(Object.create(null))).toBe(false);
    });

    it('returns true if all the properties are the same', () => {
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
          statsID: StatsID.of(uuid1),
          languageID: LanguageID.of(uuid3),
          regionID: RegionID.of(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
        }),
        Term.MONTHLY
      );
      const statsListItem2: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: StatsID.of(uuid2),
          languageID: LanguageID.of(uuid3),
          regionID: RegionID.of(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
        }),
        Term.MONTHLY
      );
      const statsListItem3: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: StatsID.of(uuid1),
          languageID: LanguageID.of(uuid4),
          regionID: RegionID.of(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: LanguageID.of(uuid4)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
        }),
        Term.MONTHLY
      );
      const statsListItem4: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: StatsID.of(uuid1),
          languageID: LanguageID.of(uuid3),
          regionID: RegionID.of(uuid6),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid6)
        }),
        Term.MONTHLY
      );
      const statsListItem5: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: StatsID.of(uuid1),
          languageID: LanguageID.of(uuid3),
          regionID: RegionID.of(uuid5),
          termID: TermID.of(uuid8)
        }),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
        }),
        Term.MONTHLY
      );
      const statsListItem6: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: StatsID.of(uuid1),
          languageID: LanguageID.of(uuid3),
          regionID: RegionID.of(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: LanguageID.of(uuid4)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
        }),
        Term.MONTHLY
      );
      const statsListItem7: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: StatsID.of(uuid1),
          languageID: LanguageID.of(uuid3),
          regionID: RegionID.of(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid6)
        }),
        Term.MONTHLY
      );
      const statsListItem8: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: StatsID.of(uuid1),
          languageID: LanguageID.of(uuid3),
          regionID: RegionID.of(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
        }),
        Term.QUARTERLY
      );
      const statsListItem9: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: StatsID.of(uuid1),
          languageID: LanguageID.of(uuid3),
          regionID: RegionID.of(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: LanguageID.of(uuid3)
        }),
        new MockRegion({
          regionID: RegionID.of(uuid5)
        }),
        Term.MONTHLY
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
});
