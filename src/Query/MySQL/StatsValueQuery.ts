import { inject, injectable } from 'inversify';
import {
  Alive,
  Ambiguous,
  DataSourceError,
  Dead,
  ImmutableProject,
  IMySQL,
  MySQLError,
  Project,
  Schrodinger,
  Superposition
} from 'publikum';

import { Type } from '../../Container/Types';
import { StatsItemIDError } from '../../VO/StatsItem/Error/StatsItemIDError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsItemID } from '../../VO/StatsItem/StatsItemID';
import { StatsValuesError } from '../../VO/StatsValue/Error/StatsValuesError';
import { StatsValueRow } from '../../VO/StatsValue/StatsValue';
import { StatsValues } from '../../VO/StatsValue/StatsValues';
import { IMySQLQuery } from './Interface/IMySQLQuery';
import { IStatsValueQuery } from '../Interface/IStatsValueQuery';

@injectable()
export class StatsValueQuery implements IStatsValueQuery, IMySQLQuery {
  public readonly noun: 'StatsValueQuery' = 'StatsValueQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(Type.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async findByStatsID(
    statsID: StatsID
  ): Promise<Superposition<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>> {
    const query: string = `SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`;

    const superposition: Superposition<Array<StatsValueRow>, MySQLError> = await Schrodinger.playground<
      Array<StatsValueRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<StatsValueRow>>(query, {
        statsID: statsID.get().get()
      });
    });

    return superposition.match<Project<StatsItemID, StatsValues>, StatsValuesError | DataSourceError>(
      (rows: Array<StatsValueRow>) => {
        const map1: Map<string, Array<StatsValueRow>> = new Map<string, Array<StatsValueRow>>();

        rows.forEach((row: StatsValueRow) => {
          const value: Ambiguous<Array<StatsValueRow>> = map1.get(row.statsItemID);

          if (value === undefined) {
            map1.set(row.statsItemID, [row]);
            return;
          }

          value.push(row);
        });

        const map2: Map<
          Superposition<StatsItemID, StatsItemIDError>,
          Superposition<StatsValues, StatsValuesError>
        > = new Map<Superposition<StatsItemID, StatsItemIDError>, Superposition<StatsValues, StatsValuesError>>();

        map1.forEach((values: Array<StatsValueRow>, id: string) => {
          map2.set(StatsItemID.ofString(id), StatsValues.ofRow(values));
        });

        const superpositions1: Superposition<Array<StatsItemID>, StatsItemIDError> = Schrodinger.all<
          StatsItemID,
          StatsItemIDError
        >([...map2.keys()]);
        const superpositions2: Superposition<Array<StatsValues>, StatsValuesError> = Schrodinger.all<
          StatsValues,
          StatsValuesError
        >([...map2.values()]);

        if (superpositions1.isDead()) {
          return Dead.of<Project<StatsItemID, StatsValues>, StatsValuesError>(
            new StatsValuesError('StatsValueQuery.findByStatsID()', superpositions1.getError())
          );
        }
        if (superpositions2.isDead()) {
          return superpositions2.transpose<Project<StatsItemID, StatsValues>>();
        }

        let project: ImmutableProject<StatsItemID, StatsValues> = ImmutableProject.empty<StatsItemID, StatsValues>();

        map2.forEach(
          (
            superposition1: Superposition<StatsValues, StatsValuesError>,
            superposition2: Superposition<StatsItemID, StatsItemIDError>
          ) => {
            project = project.set(superposition2.get(), superposition1.get());
          }
        );

        return Alive.of<Project<StatsItemID, StatsValues>, DataSourceError>(project);
      },
      (err: MySQLError) => {
        return Dead.of<Project<StatsItemID, StatsValues>, MySQLError>(err);
      }
    );
  }
}
