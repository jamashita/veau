import { StatsOverview, StatsOverviewRow } from '../veau-entity/StatsOverview';
import { StatsOverviewFactory } from '../veau-factory/StatsOverviewFactory';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsOverviewQuery } from './interfaces/IStatsOverviewQuery';

const statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();
const LIMIT: number = 40;

export class StatsOverviewQuery implements IStatsOverviewQuery {

  public static getInstance(): StatsOverviewQuery {
    return new StatsOverviewQuery();
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
      R1.unit,
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
}
