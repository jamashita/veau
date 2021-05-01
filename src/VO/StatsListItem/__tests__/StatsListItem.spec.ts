import { UUID } from '@jamashita/anden-uuid';
import { MockLanguage } from '../../Language/Mock/MockLanguage';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockLocale } from '../../Locale/Mock/MockLocale';
import { MockRegion } from '../../Region/Mock/MockRegion';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { MockStatsID } from '../../StatsOutline/Mock/MockStatsID';
import { MockStatsOutline } from '../../StatsOutline/Mock/MockStatsOutline';
import { Term } from '../../Term/Term';
import { TermID } from '../../Term/TermID';
import { Terms } from '../../Term/Terms';
import { StatsListItemError } from '../Error/StatsListItemError';
import { StatsListItem } from '../StatsListItem';

describe('StatsListItem', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(4);

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
      expect.assertions(4);

      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
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
      expect.assertions(1);

      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
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
      expect.assertions(1);

      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
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
      expect.assertions(1);

      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
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
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        Term.MONTHLY
      );
      const statsListItem2: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid2),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        Term.MONTHLY
      );
      const statsListItem3: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid4),
          regionID: new MockRegionID(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid4)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        Term.MONTHLY
      );
      const statsListItem4: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid6),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid6)
        }),
        Term.MONTHLY
      );
      const statsListItem5: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: TermID.of(uuid8)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        Term.MONTHLY
      );
      const statsListItem6: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid4)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        Term.MONTHLY
      );
      const statsListItem7: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid6)
        }),
        Term.MONTHLY
      );
      const statsListItem8: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        Term.QUARTERLY
      );
      const statsListItem9: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: TermID.of(uuid7)
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
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

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const statsListItem: StatsListItem = StatsListItem.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid2),
          regionID: new MockRegionID(uuid3),
          termID: Term.DAILY.getTermID()
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid2)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid3)
        }),
        Term.DAILY
      );

      expect(statsListItem.toString()).toBe(
        `${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${Term.DAILY.getTermID().get()}   2000-01-02 01:02:03 ${uuid2.get()}    ${uuid3.get()}   ${Term.DAILY.toString()}`
      );
    });
  });
});
