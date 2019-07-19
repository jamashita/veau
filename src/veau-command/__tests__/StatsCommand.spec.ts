import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { StatsItems } from '../../veau-entity/collection/StatsItems';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { Stats } from '../../veau-entity/Stats';
import { Term } from '../../veau-enum/Term';
import { IQuery } from '../../veau-general/MySQL/IQuery';
import { QueryMock } from '../../veau-general/MySQL/QueryMock';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsName } from '../../veau-vo/StatsName';
import { StatsUnit } from '../../veau-vo/StatsUnit';
import { UpdatedAt } from '../../veau-vo/UpdatedAt';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      QueryMock.prototype.execute = stub;

      const query: IQuery = new QueryMock();
      const stats: Stats = Stats.from(
        StatsID.of('stats id'),
        Language.from(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('language 2'), ISO639.of('aa')),
        Region.from(RegionID.of(2), RegionName.of('region 3'), ISO3166.of('abc')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01'),
        StatsItems.from([])
      );
      const accountID: VeauAccountID = VeauAccountID.of('account');

      const statsCommand: StatsCommand = StatsCommand.getInstance(query);

      await statsCommand.create(stats, accountID);

      expect(stub.withArgs(`INSERT INTO stats VALUES (
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      :unit,
      UTC_TIMESTAMP()
      );`, {
        statsID: 'stats id',
        languageID: 1,
        regionID: 2,
        termID: 1,
        veauAccountID: 'account',
        name: 'stats name',
        unit: 'stats unit'
      }).called).toEqual(true);
    });
  });

  describe('deleteByStatsID', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      QueryMock.prototype.execute = stub;

      const query: IQuery = new QueryMock();
      const statsID: StatsID = StatsID.of('stats id');

      const statsCommand: StatsCommand = StatsCommand.getInstance(query);

      await statsCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`, {
        statsID: 'stats id'
      }).called).toEqual(true);
    });
  });
});
