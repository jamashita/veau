import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { StatsItemRow } from '../../veau-entity/StatsItem';
import { StatsItems } from '../../veau-entity/StatsItems';
import { StatsItemsError } from '../../veau-error/StatsItemsError';
import { StatsValuesError } from '../../veau-error/StatsValuesError';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { Failure } from '../../veau-general/Try/Failure';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsValues } from '../../veau-vo/StatsValues';
import { IStatsItemQuery } from '../interfaces/IStatsItemQuery';
import { IStatsValueQuery } from '../interfaces/IStatsValueQuery';

@injectable()
export class StatsItemQuery implements IStatsItemQuery {
  private readonly mysql: MySQL;
  private readonly statsValueQuery: IStatsValueQuery;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL,
    @inject(TYPE.StatsValueQuery) statsValueQuery: IStatsValueQuery
  ) {
    this.mysql = mysql;
    this.statsValueQuery = statsValueQuery;
  }

  public async findByStatsID(statsID: StatsID): Promise<Try<StatsItems, StatsItemsError>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`;

    const statsItemRows: Array<StatsItemRow> = await this.mysql.execute<Array<StatsItemRow>>(query, {
      statsID: statsID.get()
    });

    const trial: Try<StatsValues, StatsValuesError> = await this.statsValueQuery.findByStatsID(statsID);

    return trial.match<Try<StatsItems, StatsItemsError>>((statsValues: StatsValues) => {
      return StatsItems.ofRow(statsItemRows, statsValues);
    }, (err: StatsValuesError) => {
      return Failure.of<StatsItems, StatsItemsError>(new StatsItemsError(err.message));
    });
  }
}
