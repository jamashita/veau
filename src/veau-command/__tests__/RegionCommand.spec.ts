import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { Regions } from '../../veau-vo/Regions';
import { RegionCommand as RegionRedisCommand } from '../Redis/RegionCommand';
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
      const stub: SinonStub = sinon.stub();
      RegionRedisCommand.prototype.insertAll = stub;
      stub.resolves();

      const regions: Regions = Regions.of([
        Region.of(RegionID.of(2), RegionName.of('region 2'), ISO3166.of('abc'))
      ]);

      const regionCommand: RegionCommand = container.get<RegionCommand>(TYPE.RegionCommand);


      try {
        await regionCommand.insertAll(regions);
      }
      catch (err) {
        fail(err);
      }
    });
  });

  describe('deleteAll', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      RegionRedisCommand.prototype.deleteAll = stub;
      stub.resolves(Success.of<void, CacheError>(undefined));

      const regionCommand: RegionCommand = container.get<RegionCommand>(TYPE.RegionCommand);
      const trial: Try<void, CacheError> = await regionCommand.deleteAll();

      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure, contains CacheError', async () => {
      const stub: SinonStub = sinon.stub();
      RegionRedisCommand.prototype.deleteAll = stub;
      stub.resolves(Failure.of<void, CacheError>(new CacheError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionCommand: RegionCommand = container.get<RegionCommand>(TYPE.RegionCommand);
      const trial: Try<void, CacheError> = await regionCommand.deleteAll();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: CacheError) => {
        expect(err).toBeInstanceOf(CacheError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
