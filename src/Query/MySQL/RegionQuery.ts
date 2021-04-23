import { Superposition } from '@jamashita/genitore-superposition';
import { IMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { RegionError } from '../../VO/Region/Error/RegionError';
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

  public all(): Superposition<Regions, MySQLError | RegionError> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166;`;

    return Superposition.playground<Array<RegionRow>, MySQLError>(() => {
      return this.mysql.execute<Array<RegionRow>>(query);
    }, MySQLError).map<Regions, MySQLError | RegionError>((rows: Array<RegionRow>) => {
      if (rows.length === 0) {
        throw new MySQLError('NO REGIONS FROM MYSQL');
      }

      return Regions.ofRow(rows);
    }, RegionError);
  }

  public find(regionID: RegionID): Superposition<Region, MySQLError | NoSuchElementError | RegionError> {
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
    }, MySQLError).map<Region, MySQLError | NoSuchElementError | RegionError>((rows: Array<RegionRow>) => {
      if (rows.length === 0) {
        throw new NoSuchElementError('NO REGIONS FROM MYSQL');
      }

      return Region.ofRow(rows[0]);
    }, RegionError, NoSuchElementError);
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, MySQLError | NoSuchElementError | RegionError> {
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
    }, MySQLError).map<Region, MySQLError | NoSuchElementError | RegionError>((rows: Array<RegionRow>) => {
      if (rows.length === 0) {
        throw new NoSuchElementError('NO REGIONS FROM MYSQL');
      }

      return Region.ofRow(rows[0]);
    }, RegionError, NoSuchElementError);
  }
}
