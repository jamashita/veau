import { Absent, ImmutableSequence, UUID } from 'publikum';
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
import { MockStatsListItem } from '../Mock/MockStatsListItem';
import { MockStatsOutline } from '../Mock/MockStatsOutline';
import { MockTerm } from '../Mock/MockTerm';
import { MockTermID } from '../Mock/MockTermID';
import { Region } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { StatsID } from '../StatsID';
import { StatsListItem } from '../StatsListItem';
import { StatsListItems } from '../StatsListItems';
import { StatsName } from '../StatsName';
import { StatsOutline } from '../StatsOutline';
import { StatsUnit } from '../StatsUnit';
import { Term } from '../Term';
import { TermID } from '../TermID';
import { UpdatedAt } from '../UpdatedAt';

describe('StatsListItems', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns empty', () => {
      expect(StatsListItems.of(ImmutableSequence.empty<StatsListItem>())).toBe(StatsListItems.empty());
    });

    it('normal case', () => {
      const sequence: ImmutableSequence<MockStatsListItem> = ImmutableSequence.of<MockStatsListItem>([
        new MockStatsListItem(),
        new MockStatsListItem()
      ]);

      const items: StatsListItems = StatsListItems.of(sequence);

      expect(items.size()).toBe(sequence.size());
      for (let i: number = 0; i < items.size(); i++) {
        expect(items.get(i).get()).toBe(sequence.get(i).get());
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns StatsListItems.empty()', () => {
      expect(StatsListItems.ofArray([])).toBe(StatsListItems.empty());
    });

    it('normal case', () => {
      const is: Array<StatsListItem> = [
        new MockStatsListItem(),
        new MockStatsListItem()
      ];

      const items: StatsListItems = StatsListItems.ofArray(is);

      expect(items.size()).toBe(is.length);
      for (let i: number = 0; i < items.size(); i++) {
        expect(items.get(i).get()).toBe(is[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns StatsListItems.empty()', () => {
      expect(StatsListItems.ofSpread()).toBe(StatsListItems.empty());
    });

    it('normal case', () => {
      const statsListItem1: MockStatsListItem = new MockStatsListItem();
      const statsListItem2: MockStatsListItem = new MockStatsListItem();

      const statsListItems: StatsListItems = StatsListItems.ofSpread(
        statsListItem1,
        statsListItem2
      );

      expect(statsListItems.size()).toBe(2);
      expect(statsListItems.get(0).get()).toBe(statsListItem1);
      expect(statsListItems.get(1).get()).toBe(statsListItem2);
    });
  });

  describe('empty', () => {
    it('generates 0-length StatsListItems', () => {
      expect(StatsListItems.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(StatsListItems.empty()).toBe(StatsListItems.empty());
    });
  });

  describe('get', () => {
    it('returns StatsListItem of index-th item', () => {
      const is: Array<StatsListItem> = [
        new MockStatsListItem(),
        new MockStatsListItem(),
        new MockStatsListItem()
      ];

      const items: StatsListItems = StatsListItems.ofArray(is);

      expect(items.size()).toBe(3);
      for (let i: number = 0; i < items.size(); i++) {
        expect(items.get(i).get()).toBe(is[i]);
      }
    });

    it('returns Absent if the index is out of range', () => {
      const items: StatsListItems = StatsListItems.ofSpread();

      expect(items.get(-1)).toBeInstanceOf(Absent);
      expect(items.get(0)).toBeInstanceOf(Absent);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();
      const item1: MockStatsListItem = new MockStatsListItem({
        outline: new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid4),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid6)
        }),
        language: new MockLanguage({
          languageID: new MockLanguageID(uuid4)
        }),
        region: new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        term: new MockTerm({
          termID: new MockTermID(uuid6)
        })
      });
      const item2: MockStatsListItem = new MockStatsListItem({
        outline: new MockStatsOutline({
          statsID: new MockStatsID(uuid2),
          languageID: new MockLanguageID(uuid4),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid6)
        }),
        language: new MockLanguage({
          languageID: new MockLanguageID(uuid4)
        }),
        region: new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        term: new MockTerm({
          termID: new MockTermID(uuid6)
        })
      });
      const item3: MockStatsListItem = new MockStatsListItem({
        outline: new MockStatsOutline({
          statsID: new MockStatsID(uuid3),
          languageID: new MockLanguageID(uuid4),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid6)
        }),
        language: new MockLanguage({
          languageID: new MockLanguageID(uuid4)
        }),
        region: new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        term: new MockTerm({
          termID: new MockTermID(uuid6)
        })
      });
      const item4: MockStatsListItem = new MockStatsListItem({
        outline: new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid4),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid6)
        }),
        language: new MockLanguage({
          languageID: new MockLanguageID(uuid4)
        }),
        region: new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        term: new MockTerm({
          termID: new MockTermID(uuid6)
        })
      });

      const items: StatsListItems = StatsListItems.ofArray([
        item1,
        item2
      ]);

      expect(items.contains(item1)).toBe(true);
      expect(items.contains(item2)).toBe(true);
      expect(items.contains(item3)).toBe(false);
      expect(items.contains(item4)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const items1: StatsListItems = StatsListItems.ofArray([]);
      const items2: StatsListItems = StatsListItems.ofArray([
        new MockStatsListItem(),
        new MockStatsListItem()
      ]);

      expect(items1.isEmpty()).toBe(true);
      expect(items2.isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if the lengths are different', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const items1: StatsListItems = StatsListItems.ofArray([
        item1,
        item2,
        item3
      ]);
      const items2: StatsListItems = StatsListItems.ofArray([
        item1,
        item2
      ]);

      expect(items1.equals(items1)).toBe(true);
      expect(items1.equals(items2)).toBe(false);
    });

    it('returns false if the sequences are different', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();

      const items1: StatsListItems = StatsListItems.ofArray([
        item1,
        item2
      ]);
      const items2: StatsListItems = StatsListItems.ofArray([
        item2,
        item1
      ]);

      expect(items1.equals(items1)).toBe(true);
      expect(items1.equals(items2)).toBe(false);
    });

    it('returns true if the size and the sequence are the same', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();

      const items1: StatsListItems = StatsListItems.ofArray([
        item1,
        item2
      ]);
      const items2: StatsListItems = StatsListItems.ofArray([
        item1,
        item2
      ]);

      expect(items1.equals(items1)).toBe(true);
      expect(items1.equals(items2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();
      const uuid7: UUID = UUID.v4();
      const uuid8: UUID = UUID.v4();
      const name1: string = 'stats name 1';
      const name2: string = 'stats name 2';
      const unit1: string = 'stats unit 1';
      const unit2: string = 'stats unit 2';
      const at: string = '2000-01-01 00:00:00';
      const updatedAt: UpdatedAt = UpdatedAt.ofString(at).get();
      const languageName1: string = 'language1';
      const languageName2: string = 'language2';
      const languageName3: string = 'language3';
      const languageName4: string = 'language4';
      const iso6391: string = 'AA';
      const iso6392: string = 'AB';
      const regionName1: string = 'region1';
      const regionName2: string = 'region2';
      const iso31661: string = 'AAA';
      const iso31662: string = 'BAA';

      const items: StatsListItems = StatsListItems.ofArray([
        StatsListItem.of(
          StatsOutline.of(
            StatsID.of(uuid1),
            LanguageID.of(uuid2),
            RegionID.of(uuid3),
            TermID.of(uuid4),
            StatsName.of(name1),
            StatsUnit.of(unit1),
            updatedAt
          ),
          Language.of(
            LanguageID.of(uuid2),
            LanguageName.of(languageName1),
            LanguageName.of(languageName2),
            ISO639.of(iso6391)
          ),
          Region.of(
            RegionID.of(uuid3),
            RegionName.of(regionName1),
            ISO3166.of(iso31661)
          ),
          Term.DAILY
        ),
        StatsListItem.of(
          StatsOutline.of(
            StatsID.of(uuid5),
            LanguageID.of(uuid6),
            RegionID.of(uuid7),
            TermID.of(uuid8),
            StatsName.of(name2),
            StatsUnit.of(unit2),
            updatedAt
          ),
          Language.of(
            LanguageID.of(uuid6),
            LanguageName.of(languageName3),
            LanguageName.of(languageName4),
            ISO639.of(iso6392)
          ),
          Region.of(
            RegionID.of(uuid7),
            RegionName.of(regionName2),
            ISO3166.of(iso31662)
          ),
          Term.DAILY
        )
      ]);

      expect(items.toString()).toBe(`${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${uuid4.get()} ${name1} ${unit1} ${updatedAt.toString()} ${uuid2.get()} ${languageName1} ${languageName2} ${iso6391} ${uuid3.get()} ${regionName1} ${iso31661} ${Term.DAILY.toString()}, ${uuid5.get()} ${uuid6.get()} ${uuid7.get()} ${uuid8.get()} ${name2} ${unit2} ${updatedAt.toString()} ${uuid6.get()} ${languageName3} ${languageName4} ${iso6392} ${uuid7.get()} ${regionName2} ${iso31662} ${Term.DAILY.toString()}`);
    });
  });
});
