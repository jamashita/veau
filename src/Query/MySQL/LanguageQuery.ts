import { inject, injectable } from 'inversify';

import { DataSourceError } from '@jamashita/publikum-error';
import { Dead, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { IMySQL, MySQLError } from '@jamashita/publikum-mysql';

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
export class LanguageQuery implements ILanguageQuery, IMySQLQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(Type.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async all(): Promise<Superposition<Languages, LanguagesError | DataSourceError>> {
    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      FORCE INDEX(iso639)
      ORDER BY R1.iso639;`;

    const superposition: Superposition<Array<LanguageRow>, MySQLError> = await Schrodinger.sandbox<
      Array<LanguageRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<LanguageRow>>(query);
    });

    return superposition.transform<Languages, LanguagesError | DataSourceError>(
      (rows: Array<LanguageRow>) => {
        if (rows.length === 0) {
          return Dead.of<Languages, MySQLError>(new MySQLError('NO LANGUAGES FROM MYSQL'));
        }

        return Languages.ofRow(rows);
      },
      (err: MySQLError) => {
        return Dead.of<Languages, MySQLError>(err);
      }
    );
  }

  public async find(
    languageID: LanguageID
  ): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      WHERE R1.language_id = :languageID;`;

    const superposition: Superposition<Array<LanguageRow>, MySQLError> = await Schrodinger.sandbox<
      Array<LanguageRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<LanguageRow>>(query, {
        languageID: languageID.get().get()
      });
    });

    return superposition.transform<Language, LanguageError | NoSuchElementError | DataSourceError>(
      (rows: Array<LanguageRow>) => {
        if (rows.length === 0) {
          return Dead.of<Language, NoSuchElementError>(new NoSuchElementError('NO LANGUAGES FROM MYSQL'));
        }

        return Language.ofRow(rows[0]);
      },
      (err: MySQLError) => {
        return Dead.of<Language, MySQLError>(err);
      }
    );
  }

  public async findByISO639(
    iso639: ISO639
  ): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      WHERE R1.iso639 = :iso639;`;

    const superposition: Superposition<Array<LanguageRow>, MySQLError> = await Schrodinger.sandbox<
      Array<LanguageRow>,
      MySQLError
    >(() => {
      return this.mysql.execute<Array<LanguageRow>>(query, {
        iso639: iso639.get()
      });
    });

    return superposition.transform<Language, LanguageError | NoSuchElementError | MySQLError>(
      (rows: Array<LanguageRow>) => {
        if (rows.length === 0) {
          return Dead.of<Language, NoSuchElementError>(new NoSuchElementError('NO LANGUAGES FROM MYSQL'));
        }

        return Language.ofRow(rows[0]);
      },
      (err: MySQLError) => {
        return Dead.of<Language, MySQLError>(err);
      }
    );
  }
}
