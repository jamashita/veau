import { UUID } from '@jamashita/anden-uuid';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError, MockFetch } from '@jamashita/catacombe-fetch';
import { Schrodinger } from '@jamashita/genitore';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { Type } from '../../../../container/Types';
import { vault } from '../../../../container/Vault';
import { MockStats } from '../../../../domain/entity/Stats/mock/MockStats';
import { MockLanguage } from '../../../../domain/vo/Language/mock/MockLanguage';
import { MockLanguageID } from '../../../../domain/vo/Language/mock/MockLanguageID';
import { MockRegion } from '../../../../domain/vo/Region/mock/MockRegion';
import { MockRegionID } from '../../../../domain/vo/Region/mock/MockRegionID';
import { MockStatsID } from '../../../../domain/vo/StatsOutline/mock/MockStatsID';
import { MockStatsOutline } from '../../../../domain/vo/StatsOutline/mock/MockStatsOutline';
import { StatsName } from '../../../../domain/vo/StatsOutline/StatsName';
import { StatsUnit } from '../../../../domain/vo/StatsOutline/StatsUnit';
import { Term } from '../../../../domain/vo/Term/Term';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const statsCommand1: StatsCommand = vault.get<StatsCommand>(Type.StatsFetchCommand);
      const statsCommand2: StatsCommand = vault.get<StatsCommand>(Type.StatsFetchCommand);

      expect(statsCommand1).toBeInstanceOf(StatsCommand);
      expect(statsCommand1).toBe(statsCommand2);
    });
  });

  describe('create', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const statsName: string = 'stats name';
      const statsUnit: string = 'stats unit';
      const stats: MockStats = new MockStats({
        outline: new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid2),
          regionID: new MockRegionID(uuid3),
          termID: Term.QUARTERLY.getTermID(),
          name: StatsName.of(statsName),
          unit: StatsUnit.of(statsUnit)
        }),
        language: new MockLanguage({
          languageID: new MockLanguageID(uuid2)
        }),
        region: new MockRegion({
          regionID: new MockRegionID(uuid3)
        }),
        term: Term.QUARTERLY
      });

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.post = stub;
      stub.resolves({
        status: StatusCodes.CREATED,
        body: {}
      });

      const statsCommand: StatsCommand = new StatsCommand(ajax);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsCommand.create(stats).terminate();

      expect(
        stub.withArgs('/api/stats', {
          outline: {
            statsID: uuid1.get(),
            languageID: uuid2.get(),
            regionID: uuid3.get(),
            termID: Term.QUARTERLY.getTermID().get().get(),
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
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('throws FetchError', async () => {
      expect.assertions(2);

      const stats: MockStats = new MockStats();

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.post = stub;
      stub.resolves({
        status: StatusCodes.BAD_REQUEST,
        body: {}
      });

      const statsCommand: StatsCommand = new StatsCommand(ajax);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await statsCommand.create(stats).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });
  });
});
