import { BAD_REQUEST, CREATED } from 'http-status';
import 'jest';
import sinon, { SinonStub } from 'sinon';
import { Stats } from '../../../veau-entity/Stats';
import { StatsItems } from '../../../veau-entity/StatsItems';
import { AJAXError } from '../../../veau-error/AJAXError';
import { AJAX } from '../../../veau-general/AJAX';
import { empty } from '../../../veau-general/Optional/Empty';
import { AsOf } from '../../../veau-vo/AsOf';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { Region } from '../../../veau-vo/Region';
import { RegionID } from '../../../veau-vo/RegionID';
import { RegionName } from '../../../veau-vo/RegionName';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsName } from '../../../veau-vo/StatsName';
import { StatsUnit } from '../../../veau-vo/StatsUnit';
import { Term } from '../../../veau-vo/Term';
import { UpdatedAt } from '../../../veau-vo/UpdatedAt';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('create', () => {
    it('normal case',  () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: CREATED,
        body: {
        }
      });

      const stats: Stats = Stats.from(
        StatsID.of('d5619e72-3233-43a8-9cc8-571e53b2ff87'),
        Language.of(LanguageID.of(3), LanguageName.of('language name 1'), LanguageName.of('language name 2'), ISO639.of('aa')),
        Region.of(RegionID.of(4), RegionName.of('region name 5'), ISO3166.of('bb')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01'),
        StatsItems.from([]),
        empty<AsOf>()
      );

      const statsCommand: StatsCommand = StatsCommand.getInstance();
      expect(statsCommand.create(stats)).resolves.toEqual(undefined);
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
        updatedAt: '2000-01-01 00:00:00',
        items: [
        ]
      }).called).toEqual(true);
    });

    it('throws error', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: BAD_REQUEST,
        body: {
        }
      });

      const stats: Stats = Stats.from(
        StatsID.of('d5619e72-3233-43a8-9cc8-571e53b2ff87'),
        Language.of(LanguageID.of(3), LanguageName.of('language name 1'), LanguageName.of('language name 2'), ISO639.of('aa')),
        Region.of(RegionID.of(4), RegionName.of('region name 5'), ISO3166.of('bb')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01'),
        StatsItems.from([]),
        empty<AsOf>()
      );

      const statsCommand: StatsCommand = StatsCommand.getInstance();
      await expect(statsCommand.create(stats)).rejects.toThrow(AJAXError);
    });
  });
});
