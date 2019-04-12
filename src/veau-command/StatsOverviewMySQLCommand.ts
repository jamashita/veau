import { StatsOverview } from '../veau-entity/StatsOverview';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { LanguageMySQLQuery } from '../veau-query/LanguageMySQLQuery';
import { RegionMySQLQuery } from '../veau-query/RegionMySQLQuery';
import { Language } from '../veau-vo/Language';
import { Region } from '../veau-vo/Region';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsOverviewCommand } from './interfaces/IStatsOverviewCommand';

const languageQuery: LanguageMySQLQuery = LanguageMySQLQuery.getInstance();
const regionQuery: RegionMySQLQuery = RegionMySQLQuery.getInstance();

export class StatsOverviewMySQLCommand implements IStatsOverviewCommand {

  public static getInstance(): StatsOverviewMySQLCommand {
    return new StatsOverviewMySQLCommand();
  }

  private constructor() {
  }

  public async create(veauAccountID: VeauAccountID, statsOverview: StatsOverview): Promise<any> {
    const query: string = `INSERT INTO stats VALUES(
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      :unit,
      UTC_TIMESTAMP()
      );`;

    const language: Language = await languageQuery.findByISO639(statsOverview.getISO639());
    const region: Region = await regionQuery.findByISO3166(statsOverview.getISO3166());

    return VeauMySQL.query(query, [
      {
        statsID: statsOverview.getStatsID().get().get(),
        languageID: language.getLanguageID().get(),
        regionID: region.getRegionID().get(),
        termID: statsOverview.getTerm().get(),
        veauAccountID: veauAccountID.get().get(),
        name: statsOverview.getName(),
        unit: statsOverview.getUnit()
      }
    ]);
  }
}
