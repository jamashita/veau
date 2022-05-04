import { UnimplementedError } from '@jamashita/anden-error';
import { IMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Alive, Contradiction, Dead, Schrodinger } from '@jamashita/genitore-schrodinger';
import { inject, injectable } from 'inversify';
import { Types } from '../../../../container/Types';
import { ISO3166 } from '../../../../domain/Region/ISO3166';
import { Region, RegionRow } from '../../../../domain/Region/Region';
import { RegionError } from '../../../../domain/Region/RegionError';
import { RegionID } from '../../../../domain/Region/RegionID';
import { RegionRepository } from '../../../../domain/Region/RegionRepository';
import { Regions } from '../../../../domain/Region/Regions';
import { NoSuchElementError } from '../../../../repository/query/error/NoSuchElementError';

@injectable()
export class MySQLRegionRepository implements RegionRepository<MySQLError> {
  private readonly mysql: IMySQL;

  public constructor(@inject(Types.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async all(): Promise<Schrodinger<Regions, MySQLError | RegionError>> {
    try {
      const query: string = `SELECT R1.region_id AS regionID,
                                    R1.name,
                                    R1.iso3166
                             FROM regions R1 FORCE INDEX(iso3166)
                             ORDER BY R1.iso3166;`;

      const rows: Array<RegionRow> = await this.mysql.execute(query);

      if (rows.length === 0) {
        return Dead.of(new MySQLError('NO REGIONS FROM MYSQL'));
      }

      return Alive.of(Regions.ofRow(rows));
    }
    catch (e: unknown) {
      if (e instanceof MySQLError) {
        return Dead.of(e);
      }
      return Contradiction.of(e);
    }
  }

  public createAll(): Promise<Schrodinger<unknown, MySQLError>> {
    return Promise.reject(new UnimplementedError());
  }

  public deleteAll(): Promise<Schrodinger<unknown, MySQLError>> {
    return Promise.reject(new UnimplementedError());
  }

  public async find(id: RegionID): Promise<Schrodinger<Region, MySQLError | NoSuchElementError | RegionError>> {
    try {
      const query: string = `SELECT R1.region_id AS regionID,
                                    R1.name,
                                    R1.iso3166
                             FROM regions R1
                             WHERE R1.region_id = :regionID;`;

      const rows: Array<RegionRow> = await this.mysql.execute(query, {
        regionID: id.get().get()
      });

      if (rows.length === 0) {
        return Dead.of(new NoSuchElementError('NO REGIONS FROM MYSQL'));
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Alive.of(Region.ofRow(rows[0]!));
    }
    catch (e: unknown) {
      if (e instanceof RegionError) {
        return Dead.of(e);
      }
      if (e instanceof MySQLError) {
        return Dead.of(e);
      }

      return Contradiction.of(e);
    }
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Schrodinger<Region, MySQLError | NoSuchElementError | RegionError>> {
    try {
      const query: string = `SELECT R1.region_id AS regionID,
                                    R1.name,
                                    R1.iso3166
                             FROM regions R1
                             WHERE R1.iso3166 = :iso3166;`;

      const rows: Array<RegionRow> = await this.mysql.execute(query, {
        iso3166: iso3166.get()
      });

      if (rows.length === 0) {
        return Dead.of(new NoSuchElementError('NO REGIONS FROM MYSQL'));
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Alive.of(Region.ofRow(rows[0]!));
    }
    catch (e: unknown) {
      if (e instanceof RegionError) {
        return Dead.of(e);
      }
      if (e instanceof MySQLError) {
        return Dead.of(e);
      }

      return Contradiction.of(e);
    }
  }
}
