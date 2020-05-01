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
import { StatsItemIDError } from '../../Error/StatsItemIDError';
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

      const map2: Map<Superposition<StatsItemID, StatsItemIDError>, Superposition<StatsValues, StatsValuesError>> = new Map<Superposition<StatsItemID, StatsItemIDError>, Superposition<StatsValues, StatsValuesError>>();

      map1.forEach((values: Array<StatsValueRow>, id: string) => {
        map2.set(
          StatsItemID.ofString(id),
          StatsValues.ofRow(values)
        );
      });

      const superpositions1: Superposition<Array<StatsItemID>, StatsItemIDError> = manoeuvre<StatsItemID, StatsItemIDError>([...map2.keys()]);
      const superpositions2: Superposition<Array<StatsValues>, StatsValuesError> = manoeuvre<StatsValues, StatsValuesError>([...map2.values()]);

      if (superpositions1.isDead()) {
        return Dead.of<Project<StatsItemID, StatsValues>, StatsValuesError>(new StatsValuesError('StatsValueQuery.findByStatsID()', superpositions1.getError()));
      }
      if (superpositions2.isDead()) {
        return superpositions2.transpose<Project<StatsItemID, StatsValues>>();
      }

      let project: ImmutableProject<StatsItemID, StatsValues> = ImmutableProject.empty<StatsItemID, StatsValues>();

      map2.forEach((superposition1: Superposition<StatsValues, StatsValuesError>, superposition2: Superposition<StatsItemID, StatsItemIDError>) => {
        project = project.set(superposition2.get(), superposition1.get());
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
