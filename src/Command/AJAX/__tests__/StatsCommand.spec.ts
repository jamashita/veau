import { BAD_REQUEST, CREATED } from 'http-status';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { MockStats } from '../../../Entity/Mock/MockStats';
import { AJAXError } from '../../../General/AJAX/AJAXError';
import { MockAJAX } from '../../../General/AJAX/Mock/MockAJAX';
import { DataSourceError } from '../../../General/DataSourceError';
import { Try } from '../../../General/Superposition/Try';
import { UUID } from '../../../General/UUID/UUID';
import { MockISO3166 } from '../../../VO/Mock/MockISO3166';
import { MockISO639 } from '../../../VO/Mock/MockISO639';
import { MockLanguage } from '../../../VO/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Mock/MockLanguageID';
import { MockLanguageName } from '../../../VO/Mock/MockLanguageName';
import { MockRegion } from '../../../VO/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Mock/MockRegionID';
import { MockRegionName } from '../../../VO/Mock/MockRegionName';
import { MockStatsID } from '../../../VO/Mock/MockStatsID';
import { MockStatsName } from '../../../VO/Mock/MockStatsName';
import { MockStatsUnit } from '../../../VO/Mock/MockStatsUnit';
import { MockTerm } from '../../../VO/Mock/MockTerm';
import { StatsCommand } from '../StatsCommand';

// DONE
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
      const uuid: UUID = UUID.v4();
      const stats: MockStats = new MockStats({
        statsID: new MockStatsID(uuid),
        language: new MockLanguage({
          languageID: new MockLanguageID(3),
          name: new MockLanguageName('language name 1'),
          englishName: new MockLanguageName('language name 2'),
          iso639: new MockISO639('aa')
        }),
        region: new MockRegion({
          regionID: new MockRegionID(4),
          name: new MockRegionName('region name 5'),
          iso3166: new MockISO3166('bb')
        }),
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
      const trial: Try<void, DataSourceError> = await statsCommand.create(stats);

      expect(stub.withArgs('/api/stats', {
        statsID: uuid.get(),
        language: {
          languageID: 3,
          name: 'language name 1',
          englishName: 'language name 2',
          iso639: 'aa'
        },
        region: {
          regionID: 4,
          name: 'region name 5',
          iso3166: 'bb'
        },
        termID: 8,
        name: 'stats name',
        unit: 'stats unit',
        updatedAt: '2000-01-02 01:02:03',
        items: []
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
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
      const trial: Try<void, DataSourceError> = await statsCommand.create(stats);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
