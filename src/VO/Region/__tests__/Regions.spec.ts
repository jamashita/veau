import sinon, { SinonSpy } from 'sinon';

import { ImmutableProject } from '@jamashita/publikum-collection';
import { Alive, Dead, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';

import { RegionError } from '../Error/RegionError';
import { RegionsError } from '../Error/RegionsError';
import { ISO3166 } from '../ISO3166';
import { MockISO3166 } from '../Mock/MockISO3166';
import { MockRegion } from '../Mock/MockRegion';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockRegionName } from '../Mock/MockRegionName';
import { Region, RegionJSON, RegionRow } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { Regions } from '../Regions';

describe('Regions', () => {
  describe('of', () => {
    it('when the ImmutableProject is zero size, returns Regions.empty()', () => {
      const regions: Regions = Regions.of(ImmutableProject.empty<RegionID, Region>());

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      const array: Array<MockRegion> = [new MockRegion(), new MockRegion()];

      const regions: Regions = Regions.ofArray(array);

      expect(regions.size()).toBe(array.length);
      for (let i: number = 0; i < regions.size(); i++) {
        const mock: MockRegion = array[i];

        expect(regions.get(mock.getRegionID())).toBe(mock);
      }
    });
  });

  describe('ofSuperposition', () => {
    it('when empty Array given, returns Alive, and Regions.empty()', async () => {
      const superposition: Superposition<Regions, RegionsError> = Regions.ofSuperposition([]);
      const schrodinger: Schrodinger<Regions, RegionsError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(Regions.empty());
    });

    it('normal case', async () => {
      const regionArray: Array<MockRegion> = [new MockRegion(), new MockRegion()];

      const superposition: Superposition<Regions, RegionsError> = Regions.ofSuperposition([
        Superposition.ofSchrodinger<Region, RegionError>(Alive.of<Region, RegionError>(regionArray[0])),
        Superposition.ofSchrodinger<Region, RegionError>(Alive.of<Region, RegionError>(regionArray[1]))
      ]);
      const schrodinger: Schrodinger<Regions, RegionsError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const regions: Regions = schrodinger.get();

      expect(regions.size()).toBe(regionArray.length);
      for (let i: number = 0; i < regions.size(); i++) {
        expect(regions.get(regionArray[i].getRegionID())).toBe(regionArray[i]);
      }
    });

    it('contains failure', async () => {
      const region1: MockRegion = new MockRegion();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition1: Superposition<Region, RegionError> = Superposition.ofSchrodinger<Region, RegionError>(
        Alive.of<Region, RegionError>(region1)
      );
      const superposition2: Superposition<Region, RegionError> = Superposition.ofSchrodinger<Region, RegionError>(
        Dead.of<Region, RegionError>(new RegionError('test failed'))
      );
      const superposition: Superposition<Regions, RegionsError> = Regions.ofSuperposition([
        superposition1,
        superposition2
      ]);
      const schrodinger: Schrodinger<Regions, RegionsError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      await superposition
        .transform<void>(
          () => {
            spy1();
          },
          (err: RegionsError) => {
            spy2();
            expect(err).toBeInstanceOf(RegionsError);
          }
        )
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains 2 failures', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition1: Superposition<Region, RegionError> = Superposition.ofSchrodinger<Region, RegionError>(
        Dead.of<Region, RegionError>(new RegionError('test failed 1'))
      );
      const superposition2: Superposition<Region, RegionError> = Superposition.ofSchrodinger<Region, RegionError>(
        Dead.of<Region, RegionError>(new RegionError('test failed 2'))
      );
      const superposition: Superposition<Regions, RegionsError> = Regions.ofSuperposition([
        superposition1,
        superposition2
      ]);
      const schrodinger: Schrodinger<Regions, RegionsError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      await superposition
        .transform<void>(
          () => {
            spy1();
          },
          (err: RegionsError) => {
            spy2();
            expect(err).toBeInstanceOf(RegionsError);
          }
        )
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('ofJSON', () => {
    it('when empty Array given, returns Regions.empty()', async () => {
      const superposition: Superposition<Regions, RegionsError> = Regions.ofJSON([]);
      const schrodinger: Schrodinger<Regions, RegionsError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const regions: Regions = schrodinger.get();

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', async () => {
      const json: Array<RegionJSON> = [
        {
          regionID: UUID.v4().get(),
          name: 'region 1',
          iso3166: 'abc'
        }
      ];

      const superposition: Superposition<Regions, RegionsError> = Regions.ofJSON(json);
      const schrodinger: Schrodinger<Regions, RegionsError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const regions: Regions = schrodinger.get();

      expect(regions.size()).toBe(json.length);
      for (let i: number = 0; i < regions.size(); i++) {
        // eslint-disable-next-line no-await-in-loop
        const regionID: RegionID = await RegionID.ofString(json[i].regionID).get();
        const region: Nullable<Region> = regions.get(regionID);

        if (region === null) {
          fail();
          return;
        }

        expect(region.getRegionID().get().get()).toBe(json[i].regionID);
        expect(region.getName().get()).toBe(json[i].name);
        expect(region.getISO3166().get()).toBe(json[i].iso3166);
      }
    });
  });

  describe('ofRow', () => {
    it('when empty Array given, returns Regions.empty()', async () => {
      const superposition: Superposition<Regions, RegionsError> = Regions.ofRow([]);
      const schrodinger: Schrodinger<Regions, RegionsError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const regions: Regions = schrodinger.get();

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', async () => {
      const rows: Array<RegionRow> = [
        {
          regionID: UUID.v4().get(),
          name: 'region 1',
          iso3166: 'abc'
        }
      ];

      const superposition: Superposition<Regions, RegionsError> = Regions.ofRow(rows);
      const schrodinger: Schrodinger<Regions, RegionsError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const regions: Regions = schrodinger.get();

      expect(regions.size()).toBe(rows.length);
      for (let i: number = 0; i < regions.size(); i++) {
        // eslint-disable-next-line no-await-in-loop
        const regionID: RegionID = await RegionID.ofString(rows[i].regionID).get();
        const region: Nullable<Region> = regions.get(regionID);

        if (region === null) {
          fail();
          return;
        }

        expect(region.getRegionID().get().get()).toBe(rows[i].regionID);
        expect(region.getName().get()).toBe(rows[i].name);
        expect(region.getISO3166().get()).toBe(rows[i].iso3166);
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns Regions.empty()', () => {
      const regions: Regions = Regions.ofArray([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      const regs: Array<MockRegion> = [new MockRegion(), new MockRegion()];

      const regions: Regions = Regions.ofArray(regs);

      expect(regions.size()).toBe(regs.length);
      for (let i: number = 0; i < regions.size(); i++) {
        expect(regions.get(regs[i].getRegionID())).toBe(regs[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns Regions.empty()', () => {
      const regions: Regions = Regions.ofSpread();

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const regs: Array<MockRegion> = [region1, region2];

      const regions: Regions = Regions.ofSpread(region1, region2);

      expect(regions.size()).toBe(regs.length);
      for (let i: number = 0; i < regions.size(); i++) {
        expect(regions.get(regs[i].getRegionID())).toBe(regs[i]);
      }
    });
  });

  describe('empty', () => {
    it('generates 0-length Regions', () => {
      expect(Regions.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(Regions.empty()).toBe(Regions.empty());
    });
  });

  describe('get', () => {
    it('returns Region instance at the correct index', () => {
      const regs: Array<MockRegion> = [new MockRegion(), new MockRegion(), new MockRegion()];

      const regions: Regions = Regions.ofArray(regs);

      expect(regions.size()).toBe(regs.length);
      for (let i: number = 0; i < regions.size(); i++) {
        expect(regions.get(regs[i].getRegionID())).toBe(regs[i]);
      }
    });

    it('returns null when the index is out of range', () => {
      const regions: Regions = Regions.empty();

      expect(regions.get(new MockRegionID())).toBe(null);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const region1: MockRegion = new MockRegion({
        regionID: new MockRegionID(uuid1)
      });
      const region2: MockRegion = new MockRegion({
        regionID: new MockRegionID(uuid2)
      });
      const region3: MockRegion = new MockRegion({
        regionID: new MockRegionID(uuid1)
      });
      const region4: MockRegion = new MockRegion({
        regionID: new MockRegionID(uuid3)
      });

      const regions: Regions = Regions.ofArray([region1, region2]);

      expect(regions.contains(region1)).toBe(true);
      expect(regions.contains(region2)).toBe(true);
      expect(regions.contains(region3)).toBe(true);
      expect(regions.contains(region4)).toBe(false);
    });
  });

  describe('find', () => {
    it('returns Present if the element exists', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const region1: MockRegion = new MockRegion({
        regionID: new MockRegionID(uuid1)
      });
      const region2: MockRegion = new MockRegion({
        regionID: new MockRegionID(uuid2)
      });
      const region3: MockRegion = new MockRegion({
        regionID: new MockRegionID(uuid1)
      });
      const region4: MockRegion = new MockRegion({
        regionID: new MockRegionID(uuid3)
      });

      const regions: Regions = Regions.ofArray([region1, region2]);

      expect(
        regions.find((region: Region) => {
          return region1.equals(region);
        })
      ).toBe(region1);
      expect(
        regions.find((region: Region) => {
          return region2.equals(region);
        })
      ).toBe(region2);
      expect(
        regions.find((region: Region) => {
          return region3.equals(region);
        })
      ).toBe(region3);
      expect(
        regions.find((region: Region) => {
          return region4.equals(region);
        })
      ).toBe(null);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const regions1: Regions = Regions.empty();
      const regions2: Regions = Regions.ofArray([
        new MockRegion(),
        new MockRegion({
          name: new MockRegionName('region'),
          iso3166: new MockISO3166('abd')
        })
      ]);

      expect(regions1.isEmpty()).toBe(true);
      expect(regions2.isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion({
        name: new MockRegionName('region'),
        iso3166: new MockISO3166('abd')
      });

      const regions1: Regions = Regions.ofArray([region1, region2]);
      const regions2: Regions = Regions.ofArray([region1]);

      expect(regions1.equals(regions1)).toBe(true);
      expect(regions1.equals(regions2)).toBe(false);
    });

    it('returns true even if the sequence is different', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion({
        name: new MockRegionName('region'),
        iso3166: new MockISO3166('abd')
      });

      const regions1: Regions = Regions.ofArray([region1, region2]);
      const regions2: Regions = Regions.ofArray([region2, region1]);

      expect(regions1.equals(regions1)).toBe(true);
      expect(regions1.equals(regions2)).toBe(true);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion({
        name: new MockRegionName('region'),
        iso3166: new MockISO3166('abd')
      });

      const regions1: Regions = Regions.ofArray([region1, region2]);
      const regions2: Regions = Regions.ofArray([region1, region2]);

      expect(regions1.equals(regions1)).toBe(true);
      expect(regions1.equals(regions2)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(uuid), RegionName.of('region 1'), ISO3166.of('abc'))
      ]);

      expect(regions.toJSON()).toEqual([
        {
          regionID: uuid.get(),
          name: 'region 1',
          iso3166: 'abc'
        }
      ]);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const name1: string = 'region 1';
      const name2: string = 'region 2';
      const iso31661: string = 'abc';
      const iso31662: string = 'abd';

      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(uuid1), RegionName.of(name1), ISO3166.of(iso31661)),
        Region.of(RegionID.of(uuid2), RegionName.of(name2), ISO3166.of(iso31662))
      ]);

      expect(regions.toString()).toBe(
        `{${uuid1.get()}: ${uuid1.get()} ${name1} ${iso31661}}, {${uuid2.get()}: ${uuid2.get()} ${name2} ${iso31662}}`
      );
    });
  });
});
