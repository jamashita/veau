import 'reflect-metadata';

import { BAD_REQUEST, CREATED } from 'http-status';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { AJAXError, MockAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { UUID } from '@jamashita/publikum-uuid';

import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { MockStats } from '../../../Entity/Stats/Mock/MockStats';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Language/Mock/MockLanguageID';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Region/Mock/MockRegionID';
import { MockStatsID } from '../../../VO/StatsOutline/Mock/MockStatsID';
import { MockStatsName } from '../../../VO/StatsOutline/Mock/MockStatsName';
import { MockStatsOutline } from '../../../VO/StatsOutline/Mock/MockStatsOutline';
import { MockStatsUnit } from '../../../VO/StatsOutline/Mock/MockStatsUnit';
import { MockTerm } from '../../../VO/Term/Mock/MockTerm';
import { MockTermID } from '../../../VO/Term/Mock/MockTermID';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsCommand1: StatsCommand = vault.get<StatsCommand>(Type.StatsAJAXCommand);
      const statsCommand2: StatsCommand = vault.get<StatsCommand>(Type.StatsAJAXCommand);

      expect(statsCommand1).toBeInstanceOf(StatsCommand);
      expect(statsCommand1).toBe(statsCommand2);
    });
  });

  describe('create', () => {
    it('normal case', async () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const statsName: string = 'stats name';
      const statsUnit: string = 'stats unit';
      const stats: MockStats = new MockStats({
        outline: new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid2),
          regionID: new MockRegionID(uuid3),
          termID: new MockTermID(uuid4),
          name: new MockStatsName(statsName),
          unit: new MockStatsUnit(statsUnit)
        }),
        language: new MockLanguage({
          languageID: new MockLanguageID(uuid2)
        }),
        region: new MockRegion({
          regionID: new MockRegionID(uuid3)
        }),
        term: new MockTerm({
          termID: new MockTermID(uuid4)
        })
      });

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();

      ajax.post = stub;
      stub.resolves({
        status: CREATED,
        body: {}
      });

      const statsCommand: StatsCommand = new StatsCommand(ajax);
      const superposition: Superposition<unknown, DataSourceError> = await statsCommand.create(stats);

      expect(
        stub.withArgs('/api/stats', {
          outline: {
            statsID: uuid1.get(),
            languageID: uuid2.get(),
            regionID: uuid3.get(),
            termID: uuid4.get(),
            name: statsName,
            unit: statsUnit,
            updatedAt: '2000-01-02 01:02:03'
          },
          language: {
            languageID: uuid2.get(),
            name: '',
            englishName: '',
            iso639: ''
          },
          region: {
            regionID: uuid3.get(),
            name: '',
            iso3166: ''
          },
          items: []
        }).called
      ).toBe(true);
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
      const superposition: Superposition<unknown, DataSourceError> = await statsCommand.create(stats);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
