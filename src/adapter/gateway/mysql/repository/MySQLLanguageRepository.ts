import { UnimplementedError } from '@jamashita/anden-error';
import { IMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Alive, Contradiction, Dead, Schrodinger } from '@jamashita/genitore-schrodinger';
import { inject, injectable } from 'inversify';
import { Types } from '../../../../container/Types';
import { ISO639 } from '../../../../domain/Language/ISO639';
import { Language, LanguageRow } from '../../../../domain/Language/Language';
import { LanguageError } from '../../../../domain/Language/LanguageError';
import { LanguageID } from '../../../../domain/Language/LanguageID';
import { LanguageRepository } from '../../../../domain/Language/LanguageRepository';
import { Languages } from '../../../../domain/Language/Languages';
import { NoSuchElementError } from '../../../../repository/query/error/NoSuchElementError';

@injectable()
export class MySQLLanguageRepository implements LanguageRepository<MySQLError> {
  private readonly mysql: IMySQL;

  public constructor(@inject(Types.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async all(): Promise<Schrodinger<Languages, LanguageError | MySQLError>> {
    try {
      const query: string = `SELECT R1.language_id  AS languageID,
                                    R1.name,
                                    R1.english_name AS englishName,
                                    R1.iso639
                             FROM languages R1 FORCE INDEX(iso639)
                             ORDER BY R1.iso639;`;

      const rows: Array<LanguageRow> = await this.mysql.execute(query);

      if (rows.length === 0) {
        return Dead.of(new MySQLError('NO LANGUAGES FROM MYSQL'));
      }

      return Alive.of(Languages.ofRow(rows));
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

  public async find(id: LanguageID): Promise<Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError>> {
    try {
      const query: string = `SELECT R1.language_id  AS languageID,
                                    R1.name,
                                    R1.english_name AS englishName,
                                    R1.iso639
                             FROM languages R1
                             WHERE R1.language_id = :languageID;`;

      const rows: Array<LanguageRow> = await this.mysql.execute(query, {
        languageID: id.get().get()
      });

      if (rows.length === 0) {
        return Dead.of(new NoSuchElementError('NO LANGUAGES FROM MYSQL'));
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Alive.of(Language.ofRow(rows[0]!));
    }
    catch (e: unknown) {
      if (e instanceof LanguageError) {
        return Dead.of(e);
      }
      if (e instanceof MySQLError) {
        return Dead.of(e);
      }

      return Contradiction.of(e);
    }
  }

  public async findByISO639(iso639: ISO639): Promise<Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError>> {
    try {
      const query: string = `SELECT R1.language_id  AS languageID,
                                    R1.name,
                                    R1.english_name AS englishName,
                                    R1.iso639
                             FROM languages R1
                             WHERE R1.iso639 = :iso639;`;

      const rows: Array<LanguageRow> = await this.mysql.execute(query, {
        iso639: iso639.get()
      });

      if (rows.length === 0) {
        return Dead.of(new NoSuchElementError('NO LANGUAGES FROM MYSQL'));
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Alive.of(Language.ofRow(rows[0]!));
    }
    catch (e: unknown) {
      if (e instanceof LanguageError) {
        return Dead.of(e);
      }
      if (e instanceof MySQLError) {
        return Dead.of(e);
      }

      return Contradiction.of(e);
    }
  }
}

