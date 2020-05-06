import { BAD_REQUEST, CREATED } from 'http-status';
import { AJAXError, DataSourceError, MockAJAX, Superposition, UUID } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { MockStats } from '../../../Entity/Mock/MockStats';
import { MockLanguageID } from '../../../VO/Mock/MockLanguageID';
import { MockRegionID } from '../../../VO/Mock/MockRegionID';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { MockStatsName } from '../../../VO/Mock/MockStatsName';
import { MockStatsUnit } from '../../../VO/Mock/MockStatsUnit';
import { MockTerm } from '../../../VO/Mock/MockTerm';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsCommand1: StatsCommand = vault.get<StatsCommand>(TYPE.StatsAJAXCommand);
      const statsCommand2: StatsCommand = vault.get<StatsCommand>(TYPE.StatsAJAXCommand);

      expect(statsCommand1).toBeInstanceOf(StatsCommand);
      expect(statsCommand1).toBe(statsCommand2);
    });
  });

  describe('create', () => {
    it('normal case', async () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const stats: MockStats = new MockStats({
        statsID: new MockStatsID(uuid1),
        languageID: new MockLanguageID(uuid2),
        regionID: new MockRegionID(uuid3),
        term: new MockTerm({
          id: 8
        }),
        name: new MockStatsName('stats name'),
        unit: new MockStatsUnit('stats unit')
      });

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.post = stub;
      stub.resolves({
        status: CREATED,
        body: {}
      });

      const statsCommand: StatsCommand = new StatsCommand(ajax);
      const superposition: Superposition<void, DataSourceError> = await statsCommand.create(stats);

      expect(stub.withArgs('/api/stats', {
        statsID: uuid1.get(),
        languageID: uuid2.get(),
        regionID: uuid3.get(),
        termID: 8,
        name: 'stats name',
        unit: 'stats unit',
        updatedAt: '2000-01-02 01:02:03',
        items: []
      }).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
    });

    it('throws AJAXError', async () => {
      const stats: MockStats = new MockStats();

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.post = stub;
      stub.resolves({
        status: BAD_REQUEST,
        body: {}
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsCommand: StatsCommand = new StatsCommand(ajax);
      const superposition: Superposition<void, DataSourceError> = await statsCommand.create(stats);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
