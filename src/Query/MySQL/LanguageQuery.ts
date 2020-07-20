import { Superposition } from '@jamashita/publikum-monad';
import { IMySQL, MySQLError } from '@jamashita/publikum-mysql';
import { inject, injectable } from 'inversify';

import { Type } from '../../Container/Types';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { LanguagesError } from '../../VO/Language/Error/LanguagesError';
import { ISO639 } from '../../VO/Language/ISO639';
import { Language, LanguageRow } from '../../VO/Language/Language';
import { LanguageID } from '../../VO/Language/LanguageID';
import { Languages } from '../../VO/Language/Languages';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IMySQLQuery } from './Interface/IMySQLQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery<MySQLError>, IMySQLQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(Type.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public all(): Superposition<Languages, LanguagesError | MySQLError> {
    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      FORCE INDEX(iso639)
      ORDER BY R1.iso639;`;

    return Superposition.playground<Array<LanguageRow>, MySQLError>(() => {
      return this.mysql.execute<Array<LanguageRow>>(query);
    }, MySQLError).map<Languages, LanguagesError | MySQLError>((rows: Array<LanguageRow>) => {
      if (rows.length === 0) {
        throw new MySQLError('NO LANGUAGES FROM MYSQL');
      }

      return Languages.ofRow(rows);
    }, LanguagesError);
  }

  public find(languageID: LanguageID): Superposition<Language, LanguageError | NoSuchElementError | MySQLError> {
    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      WHERE R1.language_id = :languageID;`;

    return Superposition.playground<Array<LanguageRow>, MySQLError>(() => {
      return this.mysql.execute<Array<LanguageRow>>(query, {
        languageID: languageID.get().get()
      });
    }, MySQLError).map<Language, LanguageError | NoSuchElementError | MySQLError>(
      (rows: Array<LanguageRow>) => {
        if (rows.length === 0) {
          throw new NoSuchElementError('NO LANGUAGES FROM MYSQL');
        }

        return Language.ofRow(rows[0]);
      },
      LanguageError,
      NoSuchElementError
    );
  }

  public findByISO639(iso639: ISO639): Superposition<Language, LanguageError | NoSuchElementError | MySQLError> {
    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      WHERE R1.iso639 = :iso639;`;

    return Superposition.playground<Array<LanguageRow>, MySQLError>(() => {
      return this.mysql.execute<Array<LanguageRow>>(query, {
        iso639: iso639.get()
      });
    }, MySQLError).map<Language, LanguageError | NoSuchElementError | MySQLError>(
      (rows: Array<LanguageRow>) => {
        if (rows.length === 0) {
          throw new NoSuchElementError('NO LANGUAGES FROM MYSQL');
        }

        return Language.ofRow(rows[0]);
      },
      LanguageError,
      NoSuchElementError
    );
  }
}
