import 'jest';
import sinon, { SinonStub } from 'sinon';
import { Regions } from '../../veau-entity/collection/Regions';
import { Region } from '../../veau-entity/Region';
import { CacheError } from '../../veau-error/CacheError';
import { Redis } from '../../veau-general/Redis/Redis';
import { RedisString } from '../../veau-general/Redis/RedisString';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { RegionCommand } from '../RegionCommand';

describe('RegionCommand', () => {
  describe('insertAll', () => {
    it('normal case', async () => {
      const stub1: SinonStub = sinon.stub();
      RedisString.prototype.set = stub1;
      stub1.resolves();
      const stub2: SinonStub = sinon.stub();
      Redis.prototype.expires = stub2;
      stub2.resolves();

      const regions: Regions = Regions.from([
        Region.from(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abc'))
      ]);

      const regionCommand: RegionCommand = RegionCommand.getInstance();
      await regionCommand.insertAll(regions);

      expect(stub1.withArgs('REGIONS', '[{"regionID":2,"name":"region 2","iso3166":"abc"}]').called).toEqual(true);
      expect(stub2.withArgs('REGIONS', 3 * 60 * 60).called).toEqual(true);
    });
  });

  describe('deleteAll', () => {
    it('normal case', () => {
      const stub: SinonStub = sinon.stub();
      Redis.prototype.delete = stub;
      stub.resolves(true);

      const regionCommand: RegionCommand = RegionCommand.getInstance();

      expect(regionCommand.deleteAll()).rejects.not.toThrow(CacheError);
      expect(stub.withArgs('REGIONS').called).toEqual(true);
    });

    it('throws error', async () => {
      const stub: SinonStub = sinon.stub();
      Redis.prototype.delete = stub;
      stub.resolves(false);

      const regionCommand: RegionCommand = RegionCommand.getInstance();

      await expect(regionCommand.deleteAll()).rejects.toThrow(CacheError);
    });
  });
});
