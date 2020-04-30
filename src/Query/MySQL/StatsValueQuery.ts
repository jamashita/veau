import { inject, injectable } from 'inversify';
import {
  Alive,
  Ambiguous,
  DataSourceError,
  Dead,
  ImmutableProject,
  IMySQL,
  manoeuvre,
  MySQLError,
  Project,
  Superposition
} from 'publikum';
import { TYPE } from '../../Container/Types';
import { StatsValuesError } from '../../Error/StatsValuesError';
import { StatsID } from '../../VO/StatsID';
import { StatsItemID } from '../../VO/StatsItemID';
import { StatsValueRow } from '../../VO/StatsValue';
import { StatsValues } from '../../VO/StatsValues';
import { IMySQLQuery } from '../Interface/IMySQLQuery';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';

@injectable()
export class StatsValueQuery implements IStatsValueQuery, IMySQLQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(TYPE.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async findByStatsID(statsID: StatsID): Promise<Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`;

    try {
      const statsValueRows: Array<StatsValueRow> = await this.mysql.execute<Array<StatsValueRow>>(
        query,
        {
          statsID: statsID.get().get()
        }
      );

      const map1: Map<string, Array<StatsValueRow>> = new Map<string, Array<StatsValueRow>>();

      statsValueRows.forEach((row: StatsValueRow) => {
        const rows: Ambiguous<Array<StatsValueRow>> = map1.get(row.statsItemID);

        if (rows === undefined) {
          map1.set(row.statsItemID, [row]);
          return;
        }

        rows.push(row);
      });

      const map2: Map<string, Superposition<StatsValues, StatsValuesError>> = new Map<string, Superposition<StatsValues, StatsValuesError>>();

      map1.forEach((values: Array<StatsValueRow>, id: string) => {
        map2.set(id, StatsValues.ofRow(values));
      });

      const superpositions: Superposition<Array<StatsValues>, StatsValuesError> = manoeuvre([...map2.values()]);

      if (superpositions.isDead()) {
        return superpositions.transpose<Project<StatsItemID, StatsValues>>();
      }

      let project: ImmutableProject<StatsItemID, StatsValues> = ImmutableProject.empty<StatsItemID, StatsValues>();

      map2.forEach((superposition: Superposition<StatsValues, StatsValuesError>, id: string) => {
        const statsItemID: StatsItemID = StatsItemID.ofString(id).get();

        project = project.set(statsItemID, superposition.get());
      });

      return Alive.of<Project<StatsItemID, StatsValues>, DataSourceError>(project);
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Dead.of<Project<StatsItemID, StatsValues>, MySQLError>(err);
      }

      throw err;
    }
  }
}
