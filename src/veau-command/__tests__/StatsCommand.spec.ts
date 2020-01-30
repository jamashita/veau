import 'jest';
import sinon, { SinonStub } from 'sinon';
import { Stats } from '../../veau-entity/Stats';
import { StatsItems } from '../../veau-entity/StatsItems';
import { IQuery } from '../../veau-general/MySQL/IQuery';
import { QueryMock } from '../../veau-general/MySQL/QueryMock';
import { None } from '../../veau-general/Optional/None';
import { AsOf } from '../../veau-vo/AsOf';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsName } from '../../veau-vo/StatsName';
import { StatsUnit } from '../../veau-vo/StatsUnit';
import { Term } from '../../veau-vo/Term';
import { UpdatedAt } from '../../veau-vo/UpdatedAt';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { StatsCommand } from '../StatsCommand';

describe('StatsCommand', () => {
  describe('create', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      QueryMock.prototype.execute = stub;

      const query: IQuery = new QueryMock();
      const stats: Stats = Stats.of(
        StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007'),
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('language 2'), ISO639.of('aa')),
        Region.of(RegionID.of(2), RegionName.of('region 3'), ISO3166.of('abc')),
        Term.DAILY,
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01'),
        StatsItems.empty(),
        None.of<AsOf>()
      );
      const accountID: VeauAccountID = VeauAccountID.of('d5619e72-3233-43a8-9cc8-571e53b2ff87');

      const statsCommand: StatsCommand = StatsCommand.of(query);

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
        statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
        languageID: 1,
        regionID: 2,
        termID: 1,
        veauAccountID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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
      const statsID: StatsID = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');

      const statsCommand: StatsCommand = StatsCommand.of(query);

      await statsCommand.deleteByStatsID(statsID);

      expect(stub.withArgs(`DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`, {
        statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007'
      }).called).toEqual(true);
    });
  });
});
