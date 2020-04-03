import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { Redis } from '../../veau-general/Redis/Redis';
import { RedisString } from '../../veau-general/Redis/RedisString';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { Regions } from '../../veau-vo/Regions';
import { RegionCommand } from '../RegionCommand';

describe('RegionCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionCommand1: RegionCommand = container.get<RegionCommand>(TYPE.RegionCommand);
      const regionCommand2: RegionCommand = container.get<RegionCommand>(TYPE.RegionCommand);

      expect(regionCommand1).toBeInstanceOf(RegionCommand);
      expect(regionCommand1).toBe(regionCommand2);
    });
  });

  describe('insertAll', () => {
    it('normal case', async () => {
      const stub1: SinonStub = sinon.stub();
      RedisString.prototype.set = stub1;
      stub1.resolves();
      const stub2: SinonStub = sinon.stub();
      Redis.prototype.expires = stub2;
      stub2.resolves();

      const regions: Regions = Regions.of([
        Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abc'))
      ]);

      const regionCommand: RegionCommand = container.get<RegionCommand>(TYPE.RegionCommand);
      await regionCommand.insertAll(regions);

      expect(stub1.withArgs('REGIONS', '[{"regionID":2,"name":"region 2","iso3166":"abc"}]').called).toEqual(true);
      expect(stub2.withArgs('REGIONS', 3 * 60 * 60).called).toEqual(true);
    });
  });

  describe('deleteAll', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      Redis.prototype.delete = stub;
      stub.resolves(true);

      const regionCommand: RegionCommand = container.get<RegionCommand>(TYPE.RegionCommand);
      const trial: Try<void, CacheError> = await regionCommand.deleteAll();

      expect(trial.isSuccess()).toEqual(true);
      expect(stub.withArgs('REGIONS').called).toEqual(true);
    });

    it('throws CacheError', async () => {
      const stub: SinonStub = sinon.stub();
      Redis.prototype.delete = stub;
      stub.resolves(false);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionCommand: RegionCommand = container.get<RegionCommand>(TYPE.RegionCommand);
      const trial: Try<void, CacheError> = await regionCommand.deleteAll();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (e: CacheError) => {
        expect(e).toBeInstanceOf(CacheError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
