import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { StatsItem, StatsItemRow } from '../veau-entity/StatsItem';
import { StatsItems } from '../veau-entity/StatsItems';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { StatsID } from '../veau-vo/StatsID';
import { StatsItemID } from '../veau-vo/StatsItemID';
import { StatsValues } from '../veau-vo/StatsValues';
import { StatsValueQuery } from './StatsValueQuery';

@injectable()
export class StatsItemQuery {
  private mysql: MySQL;
  private statsValueQuery: StatsValueQuery;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL,
    @inject(TYPE.StatsValueQuery) statsValueQuery: StatsValueQuery
  ) {
    this.mysql = mysql;
    this.statsValueQuery = statsValueQuery;
  }

  public async findByStatsID(statsID: StatsID): Promise<StatsItems> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`;

    const statsItemRows: Array<StatsItemRow> = await this.mysql.execute<Array<StatsItemRow>>(query, {
      statsID: statsID.get()
    });

    const statsValues: StatsValues = await this.statsValueQuery.findByStatsID(statsID);

    const items: Array<StatsItem> = statsItemRows.map<StatsItem>((statsItemRow: StatsItemRow) => {
      const values: StatsValues = statsValues.filter(StatsItemID.of(statsItemRow.statsItemID));

      return StatsItem.ofRow(statsItemRow, values);
    });

    return StatsItems.of(items);
  }
}
