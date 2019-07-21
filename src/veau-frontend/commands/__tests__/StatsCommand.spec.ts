import { BAD_REQUEST, OK } from 'http-status';
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { StatsItems } from '../../../veau-entity/collection/StatsItems';
import { Language } from '../../../veau-entity/Language';
import { Region } from '../../../veau-entity/Region';
import { Stats } from '../../../veau-entity/Stats';
import { Term } from '../../../veau-enum/Term';
import { RuntimeError } from '../../../veau-error/RuntimeError';
import { AJAX } from '../../../veau-general/AJAX';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { RegionID } from '../../../veau-vo/RegionID';
import { RegionName } from '../../../veau-vo/RegionName';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsName } from '../../../veau-vo/StatsName';
import { StatsUnit } from '../../../veau-vo/StatsUnit';
import { UpdatedAt } from '../../../veau-vo/UpdatedAt';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('create', () => {
    it('normal case',  () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: OK,
        body: {
        }
      });

      const stats: Stats = Stats.from(
        StatsID.of('stats id'),
        Language.from(LanguageID.of(3), LanguageName.of('language name 1'), LanguageName.of('language name 2'), ISO639.of('aa')),
        Region.from(RegionID.of(4), RegionName.of('region name 5'), ISO3166.of('bb')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01'),
        StatsItems.from([])
      );

      const statsCommand: StatsCommand = StatsCommand.getInstance();
      expect(statsCommand.create(stats)).rejects.not.toThrow(RuntimeError);

      expect(stub.withArgs('/api/stats', {
        statsID: 'stats id',
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

    it('throws error', () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: BAD_REQUEST,
        body: {
        }
      });

      const stats: Stats = Stats.from(
        StatsID.of('stats id'),
        Language.from(LanguageID.of(3), LanguageName.of('language name 1'), LanguageName.of('language name 2'), ISO639.of('aa')),
        Region.from(RegionID.of(4), RegionName.of('region name 5'), ISO3166.of('bb')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01'),
        StatsItems.from([])
      );

      const statsCommand: StatsCommand = StatsCommand.getInstance();
      expect(statsCommand.create(stats)).rejects.toThrow(RuntimeError);
    });
  });
});