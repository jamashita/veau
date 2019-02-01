import { StatsOverview, StatsOverviewRow } from '../veau-entity/StatsOverview';
import { StatsOverviewFactory } from '../veau-factory/StatsOverviewFactory';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { Language } from '../veau-vo/Language';
import { Region } from '../veau-vo/Region';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsOverviewRepository } from './IStatsOverviewRepository';
import { LanguageRepository } from './LanguageRepository';
import { RegionRepository } from './RegionRepository';

const statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();
const languageRepository: LanguageRepository = LanguageRepository.getInstance();
const regionRepository: RegionRepository = RegionRepository.getInstance();
const LIMIT: number = 40;

export class StatsOverviewRepository implements IStatsOverviewRepository {
  private static instance: StatsOverviewRepository = new StatsOverviewRepository();

  public static getInstance(): StatsOverviewRepository {
    return StatsOverviewRepository.instance;
  }

  private constructor() {
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: number): Promise<Array<StatsOverview>> {
    const query: string = `SELECT
      R1.stats_id AS statsID,
      R2.iso639,
      R3.iso3166,
      R1.term_id AS termID,
      R1.name,
      R1.updated_at AS updatedAt
      FROM stats R1
      INNER JOIN languages R2
      USING(language_id)
      INNER JOIN regions R3
      USING(region_id)
      WHERE R1.veau_account_id = :veauAccountID
      LIMIT :limit
      OFFSET :offset;`;

    const statsOverviewRows: Array<StatsOverviewRow> = await VeauMySQL.query(query, [
      {
        veauAccountID: veauAccountID.get().get(),
        limit: LIMIT,
        offset: (page - 1) * LIMIT
      }
    ]);

    return statsOverviewRows.map<StatsOverview>((statsOverviewRow: StatsOverviewRow) => {
      return statsOverviewFactory.fromRow(statsOverviewRow);
    });
  }

  public async create(veauAccountID: VeauAccountID, statsOverview: StatsOverview): Promise<any> {
    const query: string = `INSERT INTO stats VALUES(
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      NOW()
      );`;

    const language: Language = await languageRepository.findByISO639(statsOverview.getISO639());
    const region: Region = await regionRepository.findByISO3166(statsOverview.getISO3166());

    return VeauMySQL.query(query, [
      {
        statsID: statsOverview.getStatsID().get().get(),
        languageID: language.getLanguageID().get(),
        regionID: region.getRegionID().get(),
        termID: statsOverview.getTerm().get(),
        veauAccountID: veauAccountID.get().get(),
        name: statsOverview.getName()
      }
    ]);
  }
}
