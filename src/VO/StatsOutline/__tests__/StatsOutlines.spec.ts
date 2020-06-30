import sinon, { SinonSpy } from 'sinon';

import { ImmutableProject } from '@jamashita/publikum-collection';
import { Alive, Dead, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';

import { LanguageID } from '../../Language/LanguageID';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { RegionID } from '../../Region/RegionID';
import { MockTermID } from '../../Term/Mock/MockTermID';
import { TermID } from '../../Term/TermID';
import { StatsOutlineError } from '../Error/StatsOutlineError';
import { StatsOutlinesError } from '../Error/StatsOutlinesError';
import { MockStatsID } from '../Mock/MockStatsID';
import { MockStatsOutline } from '../Mock/MockStatsOutline';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from '../StatsOutline';
import { StatsOutlines } from '../StatsOutlines';
import { StatsUnit } from '../StatsUnit';
import { UpdatedAt } from '../UpdatedAt';

describe('StatsOutlines', () => {
  describe('of', () => {
    it('when the ImmutableProject is zero size, returns empty', () => {
      expect(StatsOutlines.of(ImmutableProject.empty<MockStatsID, MockStatsOutline>())).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const array: Array<MockStatsOutline> = [new MockStatsOutline(), new MockStatsOutline()];

      const outlines: StatsOutlines = StatsOutlines.ofArray(array);

      expect(outlines.size()).toBe(array.length);
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(array[i].getStatsID())).toBe(array[i]);
      }
    });
  });

  describe('ofSuperposition', () => {
    it('when empty Array given, returns Alive, and StatsOutlines.empty()', async () => {
      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([]);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(StatsOutlines.empty());
    });

    it('normal case', async () => {
      const array: Array<MockStatsOutline> = [new MockStatsOutline(), new MockStatsOutline()];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([
        Superposition.ofSchrodinger<StatsOutline, StatsOutlineError>(Alive.of<StatsOutline, StatsOutlineError>(array[0])),
        Superposition.ofSchrodinger<StatsOutline, StatsOutlineError>(Alive.of<StatsOutline, StatsOutlineError>(array[1]))
      ]);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const outlines: StatsOutlines = schrodinger.get();

      expect(outlines.size()).toBe(2);
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(array[i].getStatsID())).toBe(array[i]);
      }
    });

    it('contains failure', async () => {
      const statsOutline1: MockStatsOutline = new MockStatsOutline();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition1: Superposition<StatsOutline, StatsOutlineError> = Superposition.ofSchrodinger<
        StatsOutline,
        StatsOutlineError
      >(Alive.of<StatsOutline, StatsOutlineError>(statsOutline1));
      const superposition2: Superposition<StatsOutline, StatsOutlineError> = Superposition.ofSchrodinger<
        StatsOutline,
        StatsOutlineError
      >(Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('test failed')));
      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([
        superposition1,
        superposition2
      ]);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      await superposition
        .transform<void>(
          () => {
            spy1();
          },
          (err: StatsOutlinesError) => {
            spy2();
            expect(err).toBeInstanceOf(StatsOutlinesError);
          }
        )
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains 2 failures', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition1: Superposition<StatsOutline, StatsOutlineError> = Superposition.ofSchrodinger<
        StatsOutline,
        StatsOutlineError
      >(Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('test failed 1')));
      const superposition2: Superposition<StatsOutline, StatsOutlineError> = Superposition.ofSchrodinger<
        StatsOutline,
        StatsOutlineError
      >(Dead.of<StatsOutline, StatsOutlineError>(new StatsOutlineError('test failed 2')));
      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([
        superposition1,
        superposition2
      ]);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      await superposition
        .transform<void>(
          () => {
            spy1();
          },
          (err: StatsOutlinesError) => {
            spy2();
            expect(err).toBeInstanceOf(StatsOutlinesError);
          }
        )
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('ofJSON', () => {
    it('normal case', async () => {
      const json: Array<StatsOutlineJSON> = [
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofJSON(json);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const outlines: StatsOutlines = schrodinger.get();

      for (let i: number = 0; i < 2; i++) {
        const outline: Nullable<StatsOutline> = outlines.get(await StatsID.ofString(json[i].statsID).get());

        if (outline === null) {
          fail();

          return;
        }

        expect(outline.getStatsID().get().get()).toBe(json[i].statsID);
        expect(outline.getLanguageID().get().get()).toBe(json[i].languageID);
        expect(outline.getRegionID().get().get()).toBe(json[i].regionID);
        expect(outline.getTermID().get().get()).toBe(json[i].termID);
        expect(outline.getName().get()).toBe(json[i].name);
        expect(outline.getUnit().get()).toBe(json[i].unit);
        expect(outline.getUpdatedAt().toString()).toBe(json[i].updatedAt);
      }
    });

    it('has malformat StatsID', async () => {
      const json: Array<StatsOutlineJSON> = [
        {
          statsID: 'malformat',
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofJSON(json);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
    });
  });

  describe('ofRow', () => {
    it('normal case', async () => {
      const rows: Array<StatsOutlineRow> = [
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofRow(rows);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const outlines: StatsOutlines = schrodinger.get();

      for (let i: number = 0; i < 2; i++) {
        const outline: Nullable<StatsOutline> = outlines.get(await StatsID.ofString(rows[i].statsID).get());

        if (outline === null) {
          fail();

          return;
        }

        expect(outline.getStatsID().get().get()).toBe(rows[i].statsID);
        expect(outline.getLanguageID().get().get()).toBe(rows[i].languageID);
        expect(outline.getRegionID().get().get()).toBe(rows[i].regionID);
        expect(outline.getTermID().get().get()).toBe(rows[i].termID);
        expect(outline.getName().get()).toBe(rows[i].name);
        expect(outline.getUnit().get()).toBe(rows[i].unit);
        expect(outline.getUpdatedAt().toString()).toBe(rows[i].updatedAt);
      }
    });

    it('has malformat StatsID', async () => {
      const rows: Array<StatsOutlineRow> = [
        {
          statsID: 'malformat',
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofRow(rows);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns StatsOutlines.empty()', () => {
      expect(StatsOutlines.ofArray([])).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const outlines: Array<StatsOutline> = [new MockStatsOutline(), new MockStatsOutline()];

      const statsOutlines: StatsOutlines = StatsOutlines.ofArray(outlines);

      expect(statsOutlines.size()).toBe(outlines.length);
      for (let i: number = 0; i < statsOutlines.size(); i++) {
        expect(statsOutlines.get(outlines[i].getStatsID())).toBe(outlines[i]);
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

      const statsOutlines: StatsOutlines = StatsOutlines.ofSpread(statsOutline1, statsOutline2);

      expect(statsOutlines.size()).toBe(2);
      expect(statsOutlines.get(statsOutline1.getStatsID())).toBe(statsOutline1);
      expect(statsOutlines.get(statsOutline2.getStatsID())).toBe(statsOutline2);
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
      const array: Array<StatsOutline> = [new MockStatsOutline(), new MockStatsOutline(), new MockStatsOutline()];

      const outlines: StatsOutlines = StatsOutlines.ofArray(array);

      expect(outlines.size()).toBe(3);
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(array[i].getStatsID())).toBe(array[i]);
      }
    });

    it('returns null if the index is out of range', () => {
      const outlines: StatsOutlines = StatsOutlines.empty();

      expect(outlines.get(new MockStatsID())).toBe(null);
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
      const outline1: MockStatsOutline = new MockStatsOutline({
        statsID: new MockStatsID(uuid1),
        languageID: new MockLanguageID(uuid4),
        regionID: new MockRegionID(uuid5),
        termID: new MockTermID(uuid6)
      });
      const outline2: MockStatsOutline = new MockStatsOutline({
        statsID: new MockStatsID(uuid2),
        languageID: new MockLanguageID(uuid4),
        regionID: new MockRegionID(uuid5),
        termID: new MockTermID(uuid6)
      });
      const outline3: MockStatsOutline = new MockStatsOutline({
        statsID: new MockStatsID(uuid3),
        languageID: new MockLanguageID(uuid4),
        regionID: new MockRegionID(uuid5),
        termID: new MockTermID(uuid6)
      });
      const outline4: MockStatsOutline = new MockStatsOutline({
        statsID: new MockStatsID(uuid1),
        languageID: new MockLanguageID(uuid4),
        regionID: new MockRegionID(uuid5),
        termID: new MockTermID(uuid6)
      });

      const outlines: StatsOutlines = StatsOutlines.ofArray([outline1, outline2]);

      expect(outlines.contains(outline1)).toBe(true);
      expect(outlines.contains(outline2)).toBe(true);
      expect(outlines.contains(outline3)).toBe(false);
      expect(outlines.contains(outline4)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const outlines1: StatsOutlines = StatsOutlines.ofArray([]);
      const outlines2: StatsOutlines = StatsOutlines.ofArray([new MockStatsOutline(), new MockStatsOutline()]);

      expect(outlines1.isEmpty()).toBe(true);
      expect(outlines2.isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if the lengths are different', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const outlines1: StatsOutlines = StatsOutlines.ofArray([outline1, outline2, outline3]);
      const outlines2: StatsOutlines = StatsOutlines.ofArray([outline1, outline2]);

      expect(outlines1.equals(outlines1)).toBe(true);
      expect(outlines1.equals(outlines2)).toBe(false);
    });

    it('returns true even if the sequences are different', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();

      const outlines1: StatsOutlines = StatsOutlines.ofArray([outline1, outline2]);
      const outlines2: StatsOutlines = StatsOutlines.ofArray([outline2, outline1]);

      expect(outlines1.equals(outlines1)).toBe(true);
      expect(outlines1.equals(outlines2)).toBe(true);
    });

    it('returns true if the size and the sequence are the same', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();

      const outlines1: StatsOutlines = StatsOutlines.ofArray([outline1, outline2]);
      const outlines2: StatsOutlines = StatsOutlines.ofArray([outline1, outline2]);

      expect(outlines1.equals(outlines1)).toBe(true);
      expect(outlines1.equals(outlines2)).toBe(true);
    });
  });

  describe('duplicate', () => {
    it('shallow copies the instance and its own elements', () => {
      const array: Array<MockStatsOutline> = [new MockStatsOutline(), new MockStatsOutline(), new MockStatsOutline()];
      const outlines: StatsOutlines = StatsOutlines.ofArray(array);
      const duplicated: StatsOutlines = outlines.duplicate();

      expect(outlines).not.toBe(duplicated);
      expect(outlines.equals(duplicated)).toBe(true);
      expect(outlines.size()).toBe(duplicated.size());
      for (let i: number = 0; i < outlines.size(); i++) {
        const statsID: StatsID = array[i].getStatsID();
        const o: Nullable<StatsOutline> = outlines.get(statsID);
        const d: Nullable<StatsOutline> = duplicated.get(statsID);

        if (o === null) {
          fail();

          return;
        }
        if (d === null) {
          fail();

          return;
        }

        expect(o).toBe(d);
      }
    });

    it('returns StatsOutlines.empty() when the original is empty', () => {
      const outlines: StatsOutlines = StatsOutlines.ofArray([]);

      expect(outlines.duplicate()).toBe(outlines);
    });
  });

  describe('toJSON', () => {
    it('normal case', async () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();
      const uuid7: UUID = UUID.v4();
      const uuid8: UUID = UUID.v4();
      const outline1: StatsOutline = StatsOutline.of(
        StatsID.of(uuid1),
        LanguageID.of(uuid2),
        RegionID.of(uuid3),
        TermID.of(uuid4),
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        await UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );
      const outline2: StatsOutline = StatsOutline.of(
        StatsID.of(uuid5),
        LanguageID.of(uuid6),
        RegionID.of(uuid7),
        TermID.of(uuid8),
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        await UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );

      const outlines: StatsOutlines = StatsOutlines.ofArray([outline1, outline2]);

      expect(outlines.toJSON()).toEqual([
        {
          statsID: uuid1.get(),
          languageID: uuid2.get(),
          regionID: uuid3.get(),
          termID: uuid4.get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: uuid5.get(),
          languageID: uuid6.get(),
          regionID: uuid7.get(),
          termID: uuid8.get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ]);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
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
      const updatedAt: UpdatedAt = await UpdatedAt.ofString(at).get();

      const outlines: StatsOutlines = StatsOutlines.ofArray([
        StatsOutline.of(
          StatsID.of(uuid1),
          LanguageID.of(uuid2),
          RegionID.of(uuid3),
          TermID.of(uuid4),
          StatsName.of(name1),
          StatsUnit.of(unit1),
          updatedAt
        ),
        StatsOutline.of(
          StatsID.of(uuid5),
          LanguageID.of(uuid6),
          RegionID.of(uuid7),
          TermID.of(uuid8),
          StatsName.of(name2),
          StatsUnit.of(unit2),
          updatedAt
        )
      ]);

      expect(outlines.toString()).toBe(
        `{${uuid1.get()}: ${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${uuid4.get()} ${name1} ${unit1} ${at}}, {${uuid5.get()}: ${uuid5.get()} ${uuid6.get()} ${uuid7.get()} ${uuid8.get()} ${name2} ${unit2} ${at}}`
      );
    });
  });
});
