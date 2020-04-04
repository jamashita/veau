import { BAD_REQUEST, CREATED } from 'http-status';
import 'jest';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { Stats } from '../../../veau-entity/Stats';
import { StatsItems } from '../../../veau-entity/StatsItems';
import { AJAXError } from '../../../veau-error/AJAXError';
import { AJAX } from '../../../veau-general/AJAX';
import { None } from '../../../veau-general/Optional/None';
import { Try } from '../../../veau-general/Try/Try';
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
    it('normal case',  async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: CREATED,
        body: {
        }
      });

      const stats: Stats = Stats.of(
        StatsID.of('d5619e72-3233-43a8-9cc8-571e53b2ff87').get(),
        Language.of(LanguageID.of(3), LanguageName.of('language name 1'), LanguageName.of('language name 2'), ISO639.of('aa')),
        Region.of(RegionID.of(4), RegionName.of('region name 5'), ISO3166.of('bb')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01').get(),
        StatsItems.empty(),
        None.of<AsOf>()
      );

      const statsCommand: StatsCommand = new StatsCommand();
      const trial: Try<void, AJAXError> = await statsCommand.create(stats);

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
      expect(trial.isSuccess()).toEqual(true);
    });

    it('throws error', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.post = stub;
      stub.resolves({
        status: BAD_REQUEST,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const stats: Stats = Stats.of(
        StatsID.of('d5619e72-3233-43a8-9cc8-571e53b2ff87').get(),
        Language.of(LanguageID.of(3), LanguageName.of('language name 1'), LanguageName.of('language name 2'), ISO639.of('aa')),
        Region.of(RegionID.of(4), RegionName.of('region name 5'), ISO3166.of('bb')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01').get(),
        StatsItems.empty(),
        None.of<AsOf>()
      );

      const statsCommand: StatsCommand = new StatsCommand();
      const trial: Try<void, AJAXError> = await statsCommand.create(stats);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (e: AJAXError) => {
        expect(e).toBeInstanceOf(AJAXError);
        spy2();
      });
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
