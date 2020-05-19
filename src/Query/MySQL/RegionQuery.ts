import { inject, injectable } from 'inversify';
import { DataSourceError, Dead, IMySQL, MySQLError, Schrodinger, Superposition } from 'publikum';

import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { RegionsError } from '../../VO/Region/Error/RegionsError';
import { ISO3166 } from '../../VO/Region/ISO3166';
import { Region, RegionRow } from '../../VO/Region/Region';
import { RegionID } from '../../VO/Region/RegionID';
import { Regions } from '../../VO/Region/Regions';
import { IMySQLQuery } from './Interface/IMySQLQuery';
import { IRegionQuery } from '../Interface/IRegionQuery';

@injectable()
export class RegionQuery implements IRegionQuery, IMySQLQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(TYPE.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async all(): Promise<Superposition<Regions, RegionsError | DataSourceError>> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166;`;

    const superposition: Superposition<Array<RegionRow>, MySQLError> = await Schrodinger.playground<
      Array<RegionRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<RegionRow>>(query);
    });

    return superposition.match<Regions, RegionsError | DataSourceError>(
      (rows: Array<RegionRow>) => {
        if (rows.length === 0) {
          return Dead.of<Regions, MySQLError>(new MySQLError('NO REGIONS FROM MYSQL'));
        }

        return Regions.ofRow(rows);
      },
      (err: MySQLError) => {
        return Dead.of<Regions, MySQLError>(err);
      }
    );
  }

  public async find(
    regionID: RegionID
  ): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.region_id = :regionID;`;

    const superposition: Superposition<Array<RegionRow>, MySQLError> = await Schrodinger.playground<
      Array<RegionRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<RegionRow>>(query, {
        regionID: regionID.get().get()
      });
    });

    return superposition.match<Region, RegionError | NoSuchElementError | DataSourceError>(
      (rows: Array<RegionRow>) => {
        if (rows.length === 0) {
          return Dead.of<Region, NoSuchElementError>(new NoSuchElementError('NO REGIONS FROM MYSQL'));
        }

        return Region.ofRow(rows[0]);
      },
      (err: MySQLError) => {
        return Dead.of<Region, MySQLError>(err);
      }
    );
  }

  public async findByISO3166(
    iso3166: ISO3166
  ): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.iso3166 = :iso3166;`;

    const superposition: Superposition<Array<RegionRow>, MySQLError> = await Schrodinger.playground<
      Array<RegionRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<RegionRow>>(query, {
        iso3166: iso3166.get()
      });
    });

    return superposition.match<Region, RegionError | NoSuchElementError | DataSourceError>(
      (rows: Array<RegionRow>) => {
        if (rows.length === 0) {
          return Dead.of<Region, NoSuchElementError>(new NoSuchElementError('NO REGIONS FROM MYSQL'));
        }

        return Region.ofRow(rows[0]);
      },
      (err: MySQLError) => {
        return Dead.of<Region, MySQLError>(err);
      }
    );
  }
}
