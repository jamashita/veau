import { Stats, StatsRow } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { StatsFactory } from '../veau-factory/StatsFactory';
import { NoSuchElementError } from '../veau-general/Error/NoSuchElementError';
import { Transaction } from '../veau-general/MySQL/Transaction';
import { VeauMySQL } from '../veau-infrastructure/VeauMySQL';
import { StatsID } from '../veau-vo/StatsID';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { IStatsRepository } from './interfaces/IStatsRepository';
import { StatsItemRepository } from './StatsItemRepository';

const statsItemRepository: StatsItemRepository = StatsItemRepository.getInstance();
const statsFactory: StatsFactory = StatsFactory.getInstance();

export class StatsRepository implements IStatsRepository {
  private static instance: StatsRepository = new StatsRepository();

  public static getInstance(): StatsRepository {
    return StatsRepository.instance;
  }

  private constructor() {
  }

  public async findByStatsID(statsID: StatsID): Promise<Stats> {
    const query: string = `SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.term_id AS termID,
      R2.name AS languageName,
      R2.english_name AS languageEnglishName,
      R2.iso639,
      R1.region_id AS regionID,
      R3.name AS regionName,
      R3.iso3166,
      R1.name,
      R1.unit,
      R1.updated_at AS updatedAt
      FROM stats R1
      INNER JOIN languages R2
      USING(language_id)
      INNER JOIN regions R3
      USING(region_id)
      WHERE R1.stats_id = :statsID;`;

    const rows: Array<StatsRow> = await VeauMySQL.query(query, [
      {
        statsID: statsID.get().get()
      }
    ]);

    if (rows.length === 0) {
      throw new NoSuchElementError(statsID.toString());
    }

    const items: Array<StatsItem> = await statsItemRepository.findByStatsID(statsID);

    return statsFactory.fromRow(rows[0], items);
  }

  public async create(stats: Stats, veauAccountID: VeauAccountID, transaction: Transaction): Promise<any> {
    const query: string = `INSERT INTO stats VALUES (
      :statsID,
      :languageID,
      :regionID,
      :termID,
      :veauAccountID,
      :name,
      :unit,
      UTC_TIMESTAMP()
      );`;

    await transaction.query(query, [
      {
        statsID: stats.getStatsID().get().get(),
        languageID: stats.getLanguage().getLanguageID().get(),
        regionID: stats.getRegion().getRegionID().get(),
        termID: stats.getTerm().get(),
        veauAccountID: veauAccountID.get().get(),
        name: stats.getName(),
        unit: stats.getUnit()
      }
    ]);

    const promises: Array<Promise<any>> = stats.getItems().map<Promise<any>>((statsItem: StatsItem, index: number) => {
      return statsItemRepository.create(stats.getStatsID(), statsItem, index + 1, transaction);
    });

    return Promise.all<any>(promises);
  }

  public async deleteByStatsID(statsID: StatsID, transaction: Transaction): Promise<any> {
    await statsItemRepository.deleteByStatsID(statsID, transaction);

    const query: string = `DELETE R1
      FROM stats R1
      WHERE R1.stats_id = :statsID;`;

    return transaction.query(query, [
      {
        statsID: statsID.get().get()
      }
    ]);
  }
}
