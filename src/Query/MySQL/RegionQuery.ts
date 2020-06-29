import { inject, injectable } from 'inversify';

import { Superposition } from '@jamashita/publikum-monad';
import { IMySQL, MySQLError } from '@jamashita/publikum-mysql';

import { Type } from '../../Container/Types';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { RegionsError } from '../../VO/Region/Error/RegionsError';
import { ISO3166 } from '../../VO/Region/ISO3166';
import { Region, RegionRow } from '../../VO/Region/Region';
import { RegionID } from '../../VO/Region/RegionID';
import { Regions } from '../../VO/Region/Regions';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IRegionQuery } from '../Interface/IRegionQuery';
import { IMySQLQuery } from './Interface/IMySQLQuery';

@injectable()
export class RegionQuery implements IRegionQuery<MySQLError>, IMySQLQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(Type.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public all(): Superposition<Regions, RegionsError | MySQLError> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166;`;

    return Superposition.playground<Array<RegionRow>, MySQLError>(() => {
      return this.mysql.execute<Array<RegionRow>>(query);
    }).map<Regions, RegionsError | MySQLError>((rows: Array<RegionRow>) => {
      if (rows.length === 0) {
        throw new MySQLError('NO REGIONS FROM MYSQL');
      }

      return Regions.ofRow(rows);
    });
  }

  public find(regionID: RegionID): Superposition<Region, RegionError | NoSuchElementError | MySQLError> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.region_id = :regionID;`;

    return Superposition.playground<Array<RegionRow>, MySQLError>(() => {
      return this.mysql.execute<Array<RegionRow>>(query, {
        regionID: regionID.get().get()
      });
    }).map<Region, RegionError | NoSuchElementError | MySQLError>((rows: Array<RegionRow>) => {
      if (rows.length === 0) {
        throw new NoSuchElementError('NO REGIONS FROM MYSQL');
      }

      return Region.ofRow(rows[0]);
    });
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, RegionError | NoSuchElementError | MySQLError> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.iso3166 = :iso3166;`;

    return Superposition.playground<Array<RegionRow>, MySQLError>(() => {
      return this.mysql.execute<Array<RegionRow>>(query, {
        iso3166: iso3166.get()
      });
    }).map<Region, RegionError | NoSuchElementError | MySQLError>((rows: Array<RegionRow>) => {
      if (rows.length === 0) {
        throw new NoSuchElementError('NO REGIONS FROM MYSQL');
      }

      return Region.ofRow(rows[0]);
    });
  }
}
