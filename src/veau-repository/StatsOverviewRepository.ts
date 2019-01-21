import { StatsOverview, StatsOverviewRow } from '../veau-entity/StatsOverview';
import { StatsOverviewFactory } from '../veau-factory/StatsOverviewFactory';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';

const statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();
const LIMIT: number = 40;

export class StatsOverviewRepository implements IStatsOverviewRepository {
  private static instance: StatsOverviewRepository = new StatsOverviewRepository();

  public static getInstance(): StatsOverviewRepository {
    return StatsOverviewRepository.instance;
  }

  private constructor() {
  }

  public async findByPage(page: number): Promise<Array<StatsOverview>> {
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
      LIMIT :limit
      OFFSET :offset;`;

    const statsOverviewRows: Array<StatsOverviewRow> = await VeauMySQL.query(query, [
      {
        limit: LIMIT,
        offset: (page - 1) * LIMIT
      }
    ]);

    return statsOverviewRows.map<StatsOverview>((statsOverviewRow: StatsOverviewRow) => {
      return statsOverviewFactory.fromRow(statsOverviewRow);
    });
  }
}

export interface IStatsOverviewRepository {

  findByPage(page: number): Promise<Array<StatsOverview>>;
}
