import sinon, { SinonSpy } from 'sinon';
import { StatsOutlineError } from '../../Error/StatsOutlineError';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { ImmutableSequence } from '../../General/Collection/Sequence/ImmutableSequence';
import { Absent } from '../../General/Quantum/Absent';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Superposition } from '../../General/Superposition/Superposition';
import { Language } from '../Language';
import { MockStatsID } from '../Mock/MockStatsID';
import { MockStatsOutline } from '../Mock/MockStatsOutline';
import { Region } from '../Region';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from '../StatsOutline';
import { StatsOutlines } from '../StatsOutlines';
import { StatsUnit } from '../StatsUnit';
import { Term } from '../Term';
import { UpdatedAt } from '../UpdatedAt';

describe('StatsOutlines', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns empty', () => {
      expect(StatsOutlines.of(ImmutableSequence.empty<MockStatsOutline>())).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const sequence: ImmutableSequence<MockStatsOutline> = ImmutableSequence.of<StatsOutline>([
        new MockStatsOutline(),
        new MockStatsOutline()
      ]);

      const outlines: StatsOutlines = StatsOutlines.of(sequence);

      expect(outlines.size()).toBe(sequence.size());
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(i).get()).toBe(sequence.get(i).get());
      }
    });
  });

  describe('ofSuperposition', () => {
    it('when empty Array given, returns Success, and StatsOutlines.empty()', () => {
      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([]);

      expect(superposition.isSuccess()).toBe(true);
      expect(superposition.get()).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const outlineArray: Array<MockStatsOutline> = [
        new MockStatsOutline(),
        new MockStatsOutline()
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([
        Success.of<StatsOutline, StatsOutlineError>(outlineArray[0]),
        Success.of<StatsOutline, StatsOutlineError>(outlineArray[1])
      ]);

      expect(superposition.isSuccess()).toBe(true);
      const outlines: StatsOutlines = superposition.get();
      expect(outlines.size()).toBe(2);
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(i).get()).toBe(outlineArray[i]);
      }
    });
  });

  it('contains failure', () => {
    const statsOutline1: MockStatsOutline = new MockStatsOutline();

    const spy1: SinonSpy = sinon.spy();
    const spy2: SinonSpy = sinon.spy();

    const superposition1: Superposition<StatsOutline, StatsOutlineError> = Success.of<StatsOutline, StatsOutlineError>(statsOutline1);
    const superposition2: Superposition<StatsOutline, StatsOutlineError> = Failure.of<StatsOutline, StatsOutlineError>(
      new StatsOutlineError('test failed')
    );
    const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([
      superposition1,
      superposition2
    ]);

    expect(superposition.isFailure()).toBe(true);
    superposition.match<void>(() => {
      spy1();
    }, (err: StatsOutlinesError) => {
      spy2();
      expect(err).toBeInstanceOf(StatsOutlinesError);
    });

    expect(spy1.called).toBe(false);
    expect(spy2.called).toBe(true);
  });

  it('contains failure', () => {
    const spy1: SinonSpy = sinon.spy();
    const spy2: SinonSpy = sinon.spy();

    const superposition1: Superposition<StatsOutline, StatsOutlineError> = Failure.of<StatsOutline, StatsOutlineError>(
      new StatsOutlineError('test failed 1')
    );
    const superposition2: Superposition<StatsOutline, StatsOutlineError> = Failure.of<StatsOutline, StatsOutlineError>(
      new StatsOutlineError('test failed 2')
    );
    const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([
      superposition1,
      superposition2
    ]);

    expect(superposition.isFailure()).toBe(true);
    superposition.match<void>(() => {
      spy1();
    }, (err: StatsOutlinesError) => {
      spy2();
      expect(err).toBeInstanceOf(StatsOutlinesError);
    });

    expect(spy1.called).toBe(false);
    expect(spy2.called).toBe(true);
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      const json: Array<StatsOutlineJSON> = [
        {
          statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english name',
            iso639: 'aa'
          },
          region: {
            regionID: 1,
            name: 'region',
            iso3166: 'bb'
          },
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: '15620e91-f63a-4aaa-94b7-2844978fa129',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english name',
            iso639: 'aa'
          },
          region: {
            regionID: 1,
            name: 'region',
            iso3166: 'bb'
          },
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofJSON(json);

      expect(superposition.isSuccess()).toBe(true);
      const outlines: StatsOutlines = superposition.get();
      for (let i: number = 0; i < 2; i++) {
        const outline: StatsOutline = outlines.get(i).get();
        expect(outline.getStatsID().get().get()).toBe(json[i].statsID);
        expect(outline.getLanguage().getLanguageID().get()).toBe(json[i].language.languageID);
        expect(outline.getLanguage().getName().get()).toBe(json[i].language.name);
        expect(outline.getLanguage().getEnglishName().get()).toBe(json[i].language.englishName);
        expect(outline.getLanguage().getISO639().get()).toBe(json[i].language.iso639);
        expect(outline.getRegion().getRegionID().get()).toBe(json[i].region.regionID);
        expect(outline.getRegion().getName().get()).toBe(json[i].region.name);
        expect(outline.getRegion().getISO3166().get()).toBe(json[i].region.iso3166);
        expect(outline.getTerm().getID()).toBe(json[i].termID);
        expect(outline.getName().get()).toBe(json[i].name);
        expect(outline.getUnit().get()).toBe(json[i].unit);
        expect(outline.getUpdatedAt().toString()).toBe(json[i].updatedAt);
      }
    });

    it('has malformat StatsID', () => {
      const json: Array<StatsOutlineJSON> = [
        {
          statsID: 'malformat',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english name',
            iso639: 'aa'
          },
          region: {
            regionID: 1,
            name: 'region',
            iso3166: 'bb'
          },
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: '15620e91-f63a-4aaa-94b7-2844978fa129',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english name',
            iso639: 'aa'
          },
          region: {
            regionID: 1,
            name: 'region',
            iso3166: 'bb'
          },
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofJSON(json);

      expect(superposition.isFailure()).toBe(true);
    });

    it('has malformat UpdatedAt', () => {
      const json: Array<StatsOutlineJSON> = [
        {
          statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english name',
            iso639: 'aa'
          },
          region: {
            regionID: 1,
            name: 'region',
            iso3166: 'bb'
          },
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01'
        },
        {
          statsID: '15620e91-f63a-4aaa-94b7-2844978fa129',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english name',
            iso639: 'aa'
          },
          region: {
            regionID: 1,
            name: 'region',
            iso3166: 'bb'
          },
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofJSON(json);

      expect(superposition.isFailure()).toBe(true);
    });

  });

  describe('ofRow', () => {
    it('normal case', () => {
      const rows: Array<StatsOutlineRow> = [
        {
          statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
          languageID: 1,
          languageName: 'language',
          languageEnglishName: 'english name',
          iso639: 'aa',
          regionID: 1,
          regionName: 'region',
          iso3166: 'bb',
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: '15620e91-f63a-4aaa-94b7-2844978fa129',
          languageID: 1,
          languageName: 'language',
          languageEnglishName: 'english name',
          iso639: 'aa',
          regionID: 1,
          regionName: 'region',
          iso3166: 'bb',
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofRow(rows);

      expect(superposition.isSuccess()).toBe(true);
      const outlines: StatsOutlines = superposition.get();
      for (let i: number = 0; i < 2; i++) {
        const outline: StatsOutline = outlines.get(i).get();
        expect(outline.getStatsID().get().get()).toBe(rows[i].statsID);
        expect(outline.getLanguage().getLanguageID().get()).toBe(rows[i].languageID);
        expect(outline.getLanguage().getName().get()).toBe(rows[i].languageName);
        expect(outline.getLanguage().getEnglishName().get()).toBe(rows[i].languageEnglishName);
        expect(outline.getLanguage().getISO639().get()).toBe(rows[i].iso639);
        expect(outline.getRegion().getRegionID().get()).toBe(rows[i].regionID);
        expect(outline.getRegion().getName().get()).toBe(rows[i].regionName);
        expect(outline.getRegion().getISO3166().get()).toBe(rows[i].iso3166);
        expect(outline.getTerm().getID()).toBe(rows[i].termID);
        expect(outline.getName().get()).toBe(rows[i].name);
        expect(outline.getUnit().get()).toBe(rows[i].unit);
        expect(outline.getUpdatedAt().toString()).toBe(rows[i].updatedAt);
      }
    });

    it('has malformat StatsID', () => {
      const rows: Array<StatsOutlineRow> = [
        {
          statsID: 'malformat',
          languageID: 1,
          languageName: 'language',
          languageEnglishName: 'english name',
          iso639: 'aa',
          regionID: 1,
          regionName: 'region',
          iso3166: 'bb',
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: '15620e91-f63a-4aaa-94b7-2844978fa129',
          languageID: 1,
          languageName: 'language',
          languageEnglishName: 'english name',
          iso639: 'aa',
          regionID: 1,
          regionName: 'region',
          iso3166: 'bb',
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofRow(rows);

      expect(superposition.isFailure()).toBe(true);
    });

    it('has malformat UpdatedAt', () => {
      const rows: Array<StatsOutlineRow> = [
        {
          statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
          languageID: 1,
          languageName: 'language',
          languageEnglishName: 'english name',
          iso639: 'aa',
          regionID: 1,
          regionName: 'region',
          iso3166: 'bb',
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: '15620e91-f63a-4aaa-94b7-2844978fa129',
          languageID: 1,
          languageName: 'language',
          languageEnglishName: 'english name',
          iso639: 'aa',
          regionID: 1,
          regionName: 'region',
          iso3166: 'bb',
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofRow(rows);

      expect(superposition.isFailure()).toBe(true);
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns StatsOutlines.empty()', () => {
      expect(StatsOutlines.ofArray([])).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const outlines: Array<StatsOutline> = [
        new MockStatsOutline(),
        new MockStatsOutline()
      ];

      const statsOutlines: StatsOutlines = StatsOutlines.ofArray(outlines);

      expect(statsOutlines.size()).toBe(outlines.length);
      for (let i: number = 0; i < statsOutlines.size(); i++) {
        expect(statsOutlines.get(i).get()).toBe(outlines[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns StatsOutlines.empty()', () => {
      expect(StatsOutlines.ofSpread()).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const statsOutline1: MockStatsOutline = new MockStatsOutline();
      const statsOutline2: MockStatsOutline = new MockStatsOutline();

      const statsOutlines: StatsOutlines = StatsOutlines.ofSpread(
        statsOutline1,
        statsOutline2
      );

      expect(statsOutlines.size()).toBe(2);
      expect(statsOutlines.get(0).get()).toBe(statsOutline1);
      expect(statsOutlines.get(1).get()).toBe(statsOutline2);
    });
  });

  describe('empty', () => {
    it('generates 0-length StatsOutlines', () => {
      expect(StatsOutlines.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(StatsOutlines.empty()).toBe(StatsOutlines.empty());
    });
  });

  describe('get', () => {
    it('returns StatsOutline of index-th item', () => {
      const os: Array<StatsOutline> = [
        new MockStatsOutline(),
        new MockStatsOutline(),
        new MockStatsOutline()
      ];

      const outlines: StatsOutlines = StatsOutlines.ofArray(os);

      expect(outlines.size()).toBe(3);
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(i).get()).toBe(os[i]);
      }
    });

    it('returns Absent if the index is out of range', () => {
      const outlines: StatsOutlines = StatsOutlines.empty();

      expect(outlines.get(-1)).toBeInstanceOf(Absent);
      expect(outlines.get(0)).toBeInstanceOf(Absent);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists', () => {
      const statsID1: MockStatsID = new MockStatsID();
      const statsID2: MockStatsID = new MockStatsID();
      const statsID3: MockStatsID = new MockStatsID();
      const outline1: MockStatsOutline = new MockStatsOutline({
        statsID: statsID1
      });
      const outline2: MockStatsOutline = new MockStatsOutline({
        statsID: statsID2
      });
      const outline3: MockStatsOutline = new MockStatsOutline({
        statsID: statsID3
      });
      const outline4: MockStatsOutline = new MockStatsOutline({
        statsID: statsID1
      });

      const outlines: StatsOutlines = StatsOutlines.ofArray([
        outline1,
        outline2
      ]);

      expect(outlines.contains(outline1)).toBe(true);
      expect(outlines.contains(outline2)).toBe(true);
      expect(outlines.contains(outline3)).toBe(false);
      expect(outlines.contains(outline4)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const outlines1: StatsOutlines = StatsOutlines.ofArray([]);
      const outlines2: StatsOutlines = StatsOutlines.ofArray([
        new MockStatsOutline(),
        new MockStatsOutline()
      ]);

      expect(outlines1.isEmpty()).toBe(true);
      expect(outlines2.isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if the lengths are different', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const outlines1: StatsOutlines = StatsOutlines.ofArray([
        outline1,
        outline2,
        outline3
      ]);
      const outlines2: StatsOutlines = StatsOutlines.ofArray([
        outline1,
        outline2
      ]);

      expect(outlines1.equals(outlines1)).toBe(true);
      expect(outlines1.equals(outlines2)).toBe(false);
    });

    it('returns false if the sequences are different', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();

      const outlines1: StatsOutlines = StatsOutlines.ofArray([
        outline1,
        outline2
      ]);
      const outlines2: StatsOutlines = StatsOutlines.ofArray([
        outline2,
        outline1
      ]);

      expect(outlines1.equals(outlines1)).toBe(true);
      expect(outlines1.equals(outlines2)).toBe(false);
    });

    it('returns true if the size and the sequence are the same', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();

      const outlines1: StatsOutlines = StatsOutlines.ofArray([
        outline1,
        outline2
      ]);
      const outlines2: StatsOutlines = StatsOutlines.ofArray([
        outline1,
        outline2
      ]);

      expect(outlines1.equals(outlines1)).toBe(true);
      expect(outlines1.equals(outlines2)).toBe(true);
    });
  });

  describe('duplicate', () => {
    it('shallow copies the instance and its own elements', () => {
      const outlines: StatsOutlines = StatsOutlines.ofArray([
        new MockStatsOutline(),
        new MockStatsOutline(),
        new MockStatsOutline()
      ]);
      const duplicated: StatsOutlines = outlines.duplicate();

      expect(outlines).not.toBe(duplicated);
      expect(outlines.equals(duplicated)).toBe(true);
      expect(outlines.size()).toBe(duplicated.size());
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(i).get()).toBe(duplicated.get(i).get());
      }
    });

    it('returns StatsOutlines.empty() when the original is empty', () => {
      const outlines: StatsOutlines = StatsOutlines.ofArray([]);

      expect(outlines.duplicate()).toBe(outlines);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const outline1: StatsOutline = StatsOutline.of(
        StatsID.ofString('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get(),
        Language.empty(), Region.empty(),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );
      const outline2: StatsOutline = StatsOutline.of(
        StatsID.ofString('15620e91-f63a-4aaa-94b7-2844978fa129').get(),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );

      const outlines: StatsOutlines = StatsOutlines.ofArray([
        outline1,
        outline2
      ]);

      expect(outlines.toJSON()).toEqual([
        {
          statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
          language: {
            languageID: 0,
            name: '',
            englishName: '',
            iso639: ''
          },
          region: {
            regionID: 0,
            name: '',
            iso3166: ''
          },
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: '15620e91-f63a-4aaa-94b7-2844978fa129',
          language: {
            languageID: 0,
            name: '',
            englishName: '',
            iso639: ''
          },
          region: {
            regionID: 0,
            name: '',
            iso3166: ''
          },
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ]);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id1: string = 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007';
      const id2: string = '15620e91-f63a-4aaa-94b7-2844978fa129';
      const term: Term = Term.DAILY;
      const name1: string = 'stats name 1';
      const name2: string = 'stats name 2';
      const unit1: string = 'stats unit 1';
      const unit2: string = 'stats unit 2';
      const at: string = '2000-01-01 00:00:00';
      const updatedAt: UpdatedAt = UpdatedAt.ofString(at).get();

      const outlines: StatsOutlines = StatsOutlines.ofArray([
        StatsOutline.of(
          StatsID.ofString(id1).get(),
          Language.empty(),
          Region.empty(),
          term,
          StatsName.of(name1),
          StatsUnit.of(unit1),
          updatedAt
        ),
        StatsOutline.of(
          StatsID.ofString(id2).get(),
          Language.empty(),
          Region.empty(),
          term,
          StatsName.of(name2),
          StatsUnit.of(unit2),
          updatedAt
        )
      ]);

      expect(outlines.toString()).toBe(`${id1} 0    0   ${term.toString()} ${name1} ${unit1} ${updatedAt.toString()}, ${id2} 0    0   ${term.toString()} ${name2} ${unit2} ${at}`);
    });
  });
});
