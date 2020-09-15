import { ImmutableProject, MockProject } from '@jamashita/publikum-collection';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';
import sinon, { SinonSpy } from 'sinon';
import { ISO3166 } from '../ISO3166';
import { MockISO3166 } from '../Mock/MockISO3166';
import { MockRegion } from '../Mock/MockRegion';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockRegionName } from '../Mock/MockRegionName';
import { MockRegions } from '../Mock/MockRegions';
import { Region, RegionJSON, RegionRow } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { Regions } from '../Regions';

describe('Regions', () => {
  describe('of', () => {
    it('when the ImmutableProject is zero size, returns Regions.empty()', () => {
      expect.assertions(1);

      const regions: Regions = Regions.of(ImmutableProject.empty<RegionID, Region>());

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const array: Array<MockRegion> = [new MockRegion(), new MockRegion()];

      const regions: Regions = Regions.ofArray(array);

      expect(regions.size()).toBe(array.length);
      for (let i: number = 0; i < regions.size(); i++) {
        const mock: MockRegion = array[i];

        expect(regions.get(mock.getRegionID())).toBe(mock);
      }
    });
  });

  describe('ofJSON', () => {
    it('when empty Array given, returns Regions.empty()', () => {
      expect.assertions(1);

      const regions: Regions = Regions.ofJSON([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      expect.assertions(4);

      const json: Array<RegionJSON> = [
        {
          regionID: UUID.v4().get(),
          name: 'region 1',
          iso3166: 'abc'
        }
      ];

      const regions: Regions = Regions.ofJSON(json);

      expect(regions.size()).toBe(json.length);
      for (let i: number = 0; i < regions.size(); i++) {
        const regionID: RegionID = RegionID.ofString(json[i].regionID);
        const region: Nullable<Region> = regions.get(regionID);

        expect(region?.getRegionID().get().get()).toBe(json[i].regionID);
        expect(region?.getName().get()).toBe(json[i].name);
        expect(region?.getISO3166().get()).toBe(json[i].iso3166);
      }
    });
  });

  describe('ofRow', () => {
    it('when empty Array given, returns Regions.empty()', () => {
      expect.assertions(1);

      const regions: Regions = Regions.ofRow([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      expect.assertions(4);

      const rows: Array<RegionRow> = [
        {
          regionID: UUID.v4().get(),
          name: 'region 1',
          iso3166: 'abc'
        }
      ];

      const regions: Regions = Regions.ofRow(rows);

      expect(regions.size()).toBe(rows.length);
      for (let i: number = 0; i < regions.size(); i++) {
        const regionID: RegionID = RegionID.ofString(rows[i].regionID);
        const region: Nullable<Region> = regions.get(regionID);

        expect(region?.getRegionID().get().get()).toBe(rows[i].regionID);
        expect(region?.getName().get()).toBe(rows[i].name);
        expect(region?.getISO3166().get()).toBe(rows[i].iso3166);
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns Regions.empty()', () => {
      expect.assertions(1);

      const regions: Regions = Regions.ofArray([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

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
      expect.assertions(1);

      const regions: Regions = Regions.ofSpread();

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

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
      expect.assertions(1);

      expect(Regions.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(Regions.empty()).toBe(Regions.empty());
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.get = spy;

      const regions: Regions = Regions.of(project);

      regions.get(new MockRegionID());

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.contains = spy;

      const regions: Regions = Regions.of(project);

      regions.contains(region1);

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.size = spy;

      const regions: Regions = Regions.of(project);

      regions.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.forEach = spy;

      const regions: Regions = Regions.of(project);

      regions.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('normal case', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const regions: Regions = Regions.of(project);

      const arr: Array<ISO3166> = regions.map<ISO3166>((region: Region) => {
        return region.getISO3166();
      });

      expect(arr).toHaveLength(3);
    });
  });

  describe('find', () => {
    it('returns Region if the element exists', () => {
      expect.assertions(4);

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
      ).toBe(region1);
      expect(
        regions.find((region: Region) => {
          return region4.equals(region);
        })
      ).toBeNull();
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.isEmpty = spy;

      const regions: Regions = Regions.of(project);

      regions.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('same instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion({
        name: new MockRegionName('region'),
        iso3166: new MockISO3166('abd')
      });

      const regions: Regions = Regions.ofArray([region1, region2]);

      expect(regions.equals(regions)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.equals = spy;

      const regions: Regions = Regions.of(project);

      regions.equals(new MockRegions());

      expect(spy.called).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(uuid), RegionName.of('region 1'), ISO3166.of('abc'))
      ]);

      expect(regions.toJSON()).toStrictEqual([
        {
          regionID: uuid.get(),
          name: 'region 1',
          iso3166: 'abc'
        }
      ]);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.toString = spy;

      const regions: Regions = Regions.of(project);

      regions.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      expect.assertions(3);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const arr: Array<MockRegion> = [region1, region2, region3];

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const regions: Regions = Regions.of(project);
      let i: number = 0;

      for (const pair of regions) {
        expect(pair.getValue()).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.every = spy;

      const regions: Regions = Regions.of(project);

      regions.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.some = spy;

      const regions: Regions = Regions.of(project);

      regions.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});
