import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { IMySQL } from '../../veau-general/MySQL/interfaces/IMySQL';
import { MySQLError } from '../../veau-general/MySQL/MySQLError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language, LanguageRow } from '../../veau-vo/Language';
import { Languages } from '../../veau-vo/Languages';
import { ILanguageQuery } from '../Interfaces/ILanguageQuery';
import { IMySQLQuery } from '../Interfaces/IMySQLQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IMySQLQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'MySQL' = 'MySQL';
  private readonly mysql: IMySQL;

  public constructor(@inject(TYPE.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async all(): Promise<Try<Languages, NoSuchElementError | DataSourceError>> {
    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      FORCE INDEX(iso639)
      ORDER BY R1.iso639;`;

    try {
      const languageRows: Array<LanguageRow> = await this.mysql.execute<Array<LanguageRow>>(query);

      if (languageRows.length === 0) {
        return Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('NO LANGUAGES FROM MYSQL'));
      }

      return Success.of<Languages, DataSourceError>(Languages.ofRow(languageRows));
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Failure.of<Languages, MySQLError>(err);
      }

      throw err;
    }
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | DataSourceError>> {
    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      WHERE R1.iso639 = :iso639;`;

    try {
      const languageRows: Array<LanguageRow> = await this.mysql.execute<Array<LanguageRow>>(query, {
        iso639: iso639.get()
      });

      if (languageRows.length === 0) {
        return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
      }

      return Success.of<Language, DataSourceError>(Language.ofRow(languageRows[0]));
    }
    catch (err) {
      if (err instanceof MySQLError) {
        return Failure.of<Language, MySQLError>(err);
      }

      throw err;
    }
  }
}
