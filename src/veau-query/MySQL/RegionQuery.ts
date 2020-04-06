import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Region, RegionRow } from '../../veau-vo/Region';
import { Regions } from '../../veau-vo/Regions';
import { IMySQLQuery } from '../interfaces/IMySQLQuery';
import { IRegionQuery } from '../interfaces/IRegionQuery';

@injectable()
export class RegionQuery implements IRegionQuery, IMySQLQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: MySQL;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL) {
    this.mysql = mysql;
  }

  public async all(): Promise<Try<Regions, NoSuchElementError>> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166;`;

    const regionRows: Array<RegionRow> = await this.mysql.execute<Array<RegionRow>>(query);

    if (regionRows.length === 0) {
      return Failure.of<Regions, NoSuchElementError>(new NoSuchElementError('NO LANGUAGES FROM MYSQL'));
    }

    return Success.of<Regions, NoSuchElementError>(Regions.ofRow(regionRows));
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError>> {
    const query: string = `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.iso3166 = :iso3166;`;

    const regionRows: Array<RegionRow> = await this.mysql.execute<Array<RegionRow>>(query, {
      iso3166: iso3166.get()
    });

    if (regionRows.length === 0) {
      return Failure.of<Region, NoSuchElementError>(new NoSuchElementError('NO LANGUAGES FROM MYSQL'));
    }

    return Success.of<Region, NoSuchElementError>(Region.ofRow(regionRows[0]));
  }
}
