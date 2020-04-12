import { BAD_REQUEST, CREATED } from 'http-status';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { vault } from '../../../Container/Container';
import { TYPE } from '../../../Container/Types';
import { Stats } from '../../../Entity/Stats';
import { StatsItems } from '../../../Entity/StatsItems';
import { AJAXError } from '../../../General/AJAX/AJAXError';
import { MockAJAX } from '../../../General/AJAX/Mock/MockAJAX';
import { DataSourceError } from '../../../General/DataSourceError';
import { Try } from '../../../General/Try/Try';
import { ISO3166 } from '../../../VO/ISO3166';
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { LanguageID } from '../../../VO/LanguageID';
import { LanguageName } from '../../../VO/LanguageName';
import { Region } from '../../../VO/Region';
import { RegionID } from '../../../VO/RegionID';
import { RegionName } from '../../../VO/RegionName';
import { StatsID } from '../../../VO/StatsID';
import { StatsName } from '../../../VO/StatsName';
import { StatsUnit } from '../../../VO/StatsUnit';
import { Term } from '../../../VO/Term';
import { UpdatedAt } from '../../../VO/UpdatedAt';
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
    it('normal case',  async () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('d5619e72-3233-43a8-9cc8-571e53b2ff87').get(),
        Language.of(LanguageID.of(3), LanguageName.of('language name 1'), LanguageName.of('language name 2'), ISO639.of('aa')),
        Region.of(RegionID.of(4), RegionName.of('region name 5'), ISO3166.of('bb')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01 01:01:01').get(),
        StatsItems.empty()
      );

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.post = stub;
      stub.resolves({
        status: CREATED,
        body: {
        }
      });

      const statsCommand: StatsCommand = new StatsCommand(ajax);
      const trial: Try<void, DataSourceError> = await statsCommand.create(stats);

      expect(stub.withArgs('/api/stats', {
        statsID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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
        termID: 1,
        name: 'stats name',
        unit: 'stats unit',
        updatedAt: '2000-01-01 01:01:01',
        items: [
        ]
      }).called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
    });

    it('throws AJAXError', async () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('d5619e72-3233-43a8-9cc8-571e53b2ff87').get(),
        Language.of(LanguageID.of(3), LanguageName.of('language name 1'), LanguageName.of('language name 2'), ISO639.of('aa')),
        Region.of(RegionID.of(4), RegionName.of('region name 5'), ISO3166.of('bb')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.empty()
      );

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.post = stub;
      stub.resolves({
        status: BAD_REQUEST,
        body: {
        }
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
