import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, IMySQL, MySQLError, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { ISO3166 } from '../../VO/ISO3166';
import { Region, RegionRow } from '../../VO/Region';
import { Regions } from '../../VO/Regions';
import { IMySQLQuery } from '../Interface/IMySQLQuery';
import { IRegionQuery } from '../Interface/IRegionQuery';

@injectable()
export class RegionQuery implements IRegionQuery, IMySQLQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(TYPE.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async all(): Promise<Superposition<Regions, NoSuchElementError | DataSourceError>> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166;`;

    try {
      const regionRows: Array<RegionRow> = await this.mysql.execute<Array<RegionRow>>(query);

      if (regionRows.length === 0) {
        return Dead.of<Regions, NoSuchElementError>(new NoSuchElementError('NO REGIONS FROM MYSQL'));
      }

      return Alive.of<Regions, DataSourceError>(Regions.ofRow(regionRows));
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Dead.of<Regions, MySQLError>(err);
      }

      throw err;
    }
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Superposition<Region, NoSuchElementError | DataSourceError>> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.iso3166 = :iso3166;`;

    try {
      const regionRows: Array<RegionRow> = await this.mysql.execute<Array<RegionRow>>(
        query,
        {
          iso3166: iso3166.get()
        }
      );

      if (regionRows.length === 0) {
        return Dead.of<Region, NoSuchElementError>(new NoSuchElementError('NO REGIONS FROM MYSQL'));
      }

      return Alive.of<Region, DataSourceError>(Region.ofRow(regionRows[0]));
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Dead.of<Region, MySQLError>(err);
      }

      throw err;
    }
  }
}
