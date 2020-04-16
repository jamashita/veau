import sinon, { SinonSpy } from 'sinon';
import { StatsOutlineError } from '../../Error/StatsOutlineError';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { ImmutableSequence } from '../../General/Collection/Sequence/ImmutableSequence';
import { None } from '../../General/Quantum/None';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
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

// DONE
describe('StatsOutlines', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns empty', () => {
      const outlines: StatsOutlines = StatsOutlines.of(ImmutableSequence.empty<MockStatsOutline>());

      expect(outlines).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const sequence: ImmutableSequence<MockStatsOutline> = ImmutableSequence.of<StatsOutline>([
        outline1,
        outline2
      ]);

      const outlines: StatsOutlines = StatsOutlines.of(sequence);

      expect(outlines.size()).toEqual(sequence.size());
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(i).get()).toBe(sequence.get(i).get());
      }
    });
  });

  describe('ofTry', () => {
    it('when empty Array given, returns Success, and StatsOutlines.empty()', () => {
      const trial: Try<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofTry([]);

      expect(trial.isSuccess()).toBe(true);
      expect(trial.get()).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const statsOutline1: MockStatsOutline = new MockStatsOutline();
      const statsOutline2: MockStatsOutline = new MockStatsOutline();

      const trial1: Try<StatsOutline, StatsOutlineError> = Success.of<StatsOutline, StatsOutlineError>(statsOutline1);
      const trial2: Try<StatsOutline, StatsOutlineError> = Success.of<StatsOutline, StatsOutlineError>(statsOutline2);
      const trial: Try<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofTry([
        trial1,
        trial2
      ]);

      expect(trial.isSuccess()).toEqual(true);
      const outlines: StatsOutlines = trial.get();
      expect(outlines.size()).toEqual(2);
      expect(outlines.get(0).get()).toBe(statsOutline1);
      expect(outlines.get(1).get()).toBe(statsOutline2);
    });
  });

  it('contains failure', () => {
    const statsOutline1: MockStatsOutline = new MockStatsOutline();

    const spy1: SinonSpy = sinon.spy();
    const spy2: SinonSpy = sinon.spy();

    const trial1: Try<StatsOutline, StatsOutlineError> = Success.of<StatsOutline, StatsOutlineError>(statsOutline1);
    const trial2: Try<StatsOutline, StatsOutlineError> = Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('test failed'));
    const trial: Try<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofTry([
      trial1,
      trial2
    ]);

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

  it('contains failure', () => {
    const spy1: SinonSpy = sinon.spy();
    const spy2: SinonSpy = sinon.spy();

    const trial1: Try<StatsOutline, StatsOutlineError> = Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('test failed 1'));
    const trial2: Try<StatsOutline, StatsOutlineError> = Failure.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('test failed 2'));
    const trial: Try<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofTry([
      trial1,
      trial2
    ]);

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

      const trial: Try<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofJSON(json);

      expect(trial.isSuccess()).toEqual(true);
      const outlines: StatsOutlines = trial.get();
      for (let i: number = 0; i < 2; i++) {
        const outline: StatsOutline = outlines.get(i).get();
        expect(outline.getStatsID().get().get()).toEqual(json[i].statsID);
        expect(outline.getLanguage().getLanguageID().get()).toEqual(json[i].language.languageID);
        expect(outline.getLanguage().getName().get()).toEqual(json[i].language.name);
        expect(outline.getLanguage().getEnglishName().get()).toEqual(json[i].language.englishName);
        expect(outline.getLanguage().getISO639().get()).toEqual(json[i].language.iso639);
        expect(outline.getRegion().getRegionID().get()).toEqual(json[i].region.regionID);
        expect(outline.getRegion().getName().get()).toEqual(json[i].region.name);
        expect(outline.getRegion().getISO3166().get()).toEqual(json[i].region.iso3166);
        expect(outline.getTerm().getID()).toEqual(json[i].termID);
        expect(outline.getName().get()).toEqual(json[i].name);
        expect(outline.getUnit().get()).toEqual(json[i].unit);
        expect(outline.getUpdatedAt().toString()).toEqual(json[i].updatedAt);
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

      const trial: Try<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofJSON(json);

      expect(trial.isFailure()).toEqual(true);
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

      const trial: Try<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofJSON(json);

      expect(trial.isFailure()).toEqual(true);
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

      const trial: Try<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofRow(rows);

      expect(trial.isSuccess()).toEqual(true);
      const outlines: StatsOutlines = trial.get();
      for (let i: number = 0; i < 2; i++) {
        const outline: StatsOutline = outlines.get(i).get();
        expect(outline.getStatsID().get().get()).toEqual(rows[i].statsID);
        expect(outline.getLanguage().getLanguageID().get()).toEqual(rows[i].languageID);
        expect(outline.getLanguage().getName().get()).toEqual(rows[i].languageName);
        expect(outline.getLanguage().getEnglishName().get()).toEqual(rows[i].languageEnglishName);
        expect(outline.getLanguage().getISO639().get()).toEqual(rows[i].iso639);
        expect(outline.getRegion().getRegionID().get()).toEqual(rows[i].regionID);
        expect(outline.getRegion().getName().get()).toEqual(rows[i].regionName);
        expect(outline.getRegion().getISO3166().get()).toEqual(rows[i].iso3166);
        expect(outline.getTerm().getID()).toEqual(rows[i].termID);
        expect(outline.getName().get()).toEqual(rows[i].name);
        expect(outline.getUnit().get()).toEqual(rows[i].unit);
        expect(outline.getUpdatedAt().toString()).toEqual(rows[i].updatedAt);
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

      const trial: Try<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofRow(rows);

      expect(trial.isFailure()).toEqual(true);
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

      const trial: Try<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofRow(rows);

      expect(trial.isFailure()).toEqual(true);
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns StatsOutlines.empty()', () => {
      const outlines: StatsOutlines = StatsOutlines.ofArray([]);

      expect(outlines).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const statsOutline1: MockStatsOutline = new MockStatsOutline();
      const statsOutline2: MockStatsOutline = new MockStatsOutline();
      const outlines: Array<StatsOutline> = [
        statsOutline1,
        statsOutline2
      ];

      const statsOutlines: StatsOutlines = StatsOutlines.ofArray(outlines);

      expect(statsOutlines.size()).toEqual(outlines.length);
      for (let i: number = 0; i < statsOutlines.size(); i++) {
        expect(statsOutlines.get(i).get()).toBe(outlines[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns StatsOutlines.empty()', () => {
      const outlines: StatsOutlines = StatsOutlines.ofSpread();

      expect(outlines).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const statsOutline1: MockStatsOutline = new MockStatsOutline();
      const statsOutline2: MockStatsOutline = new MockStatsOutline();
      const outlines: Array<StatsOutline> = [
        statsOutline1,
        statsOutline2
      ];

      const statsOutlines: StatsOutlines = StatsOutlines.ofSpread(
        statsOutline1,
        statsOutline2
      );

      expect(statsOutlines.size()).toEqual(outlines.length);
      for (let i: number = 0; i < statsOutlines.size(); i++) {
        expect(statsOutlines.get(i).get()).toBe(outlines[i]);
      }
    });
  });

  describe('empty', () => {
    it('generates 0-length StatsOutlines', () => {
      expect(StatsOutlines.empty().size()).toEqual(0);
    });

    it('returns singleton instance', () => {
      expect(StatsOutlines.empty()).toBe(StatsOutlines.empty());
    });
  });

  describe('get', () => {
    it('returns StatsOutline of index-th item', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const outlines: StatsOutlines = StatsOutlines.ofSpread(
        outline1,
        outline2,
        outline3
      );

      expect(outlines.size()).toEqual(3);
      expect(outlines.get(0).get()).toBe(outline1);
      expect(outlines.get(1).get()).toBe(outline2);
      expect(outlines.get(2).get()).toBe(outline3);
    });

    it('returns None if the index is out of range', () => {
      const outlines: StatsOutlines = StatsOutlines.empty();

      expect(outlines.get(-1)).toBeInstanceOf(None);
      expect(outlines.get(0)).toBeInstanceOf(None);
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

      const outlines: StatsOutlines = StatsOutlines.ofSpread(
        outline1,
        outline2
      );

      expect(outlines.contains(outline1)).toEqual(true);
      expect(outlines.contains(outline2)).toEqual(true);
      expect(outlines.contains(outline3)).toEqual(false);
      expect(outlines.contains(outline4)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();

      const outlines1: StatsOutlines = StatsOutlines.ofSpread();
      const outlines2: StatsOutlines = StatsOutlines.ofSpread(
        outline1,
        outline2
      );

      expect(outlines1.isEmpty()).toEqual(true);
      expect(outlines2.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns false if the lengths are different', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const outlines1: StatsOutlines = StatsOutlines.ofSpread(
        outline1,
        outline2,
        outline3
      );
      const outlines2: StatsOutlines = StatsOutlines.ofSpread(
        outline1,
        outline2
      );

      expect(outlines1.equals(outlines1)).toEqual(true);
      expect(outlines1.equals(outlines2)).toEqual(false);
    });

    it('returns false if the sequences are different', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();

      const outlines1: StatsOutlines = StatsOutlines.ofSpread(
        outline1,
        outline2
      );
      const outlines2: StatsOutlines = StatsOutlines.ofSpread(
        outline2,
        outline1
      );

      expect(outlines1.equals(outlines1)).toEqual(true);
      expect(outlines1.equals(outlines2)).toEqual(false);
    });

    it('returns true if the size and the sequence are the same', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();

      const outlines1: StatsOutlines = StatsOutlines.ofSpread(
        outline1,
        outline2
      );
      const outlines2: StatsOutlines = StatsOutlines.ofSpread(
        outline1,
        outline2
      );

      expect(outlines1.equals(outlines1)).toEqual(true);
      expect(outlines1.equals(outlines2)).toEqual(true);
    });
  });

  describe('copy', () => {
    it('shallow copies the instance and its own elements', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const outlines: StatsOutlines = StatsOutlines.ofSpread(
        outline1,
        outline2,
        outline3
      );
      const copied: StatsOutlines = outlines.copy();

      expect(outlines).not.toBe(copied);
      expect(outlines.equals(copied)).toEqual(true);
      expect(outlines.size()).toEqual(copied.size());
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(i).get()).toBe(copied.get(i).get());
      }
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

      const outlines: StatsOutlines = StatsOutlines.ofSpread(
        outline1,
        outline2
      );

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

      const outline1: StatsOutline = StatsOutline.of(
        StatsID.ofString(id1).get(),
        Language.empty(),
        Region.empty(),
        term,
        StatsName.of(name1),
        StatsUnit.of(unit1),
        updatedAt
      );
      const outline2: StatsOutline = StatsOutline.of(
        StatsID.ofString(id2).get(),
        Language.empty(),
        Region.empty(),
        term,
        StatsName.of(name2),
        StatsUnit.of(unit2),
        updatedAt
      );
      const outlines: StatsOutlines = StatsOutlines.ofArray([
        outline1,
        outline2
      ]);

      expect(outlines.toString()).toEqual(`${id1} 0    0   ${term.toString()} ${name1} ${unit1} ${updatedAt.toString()}, ${id2} 0    0   ${term.toString()} ${name2} ${unit2} ${at}`);
    });
  });
});
