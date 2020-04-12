import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { IMySQL } from '../../General/MySQL/Interface/IMySQL';
import { MySQLError } from '../../General/MySQL/MySQLError';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
import { ISO639 } from '../../VO/ISO639';
import { Language, LanguageRow } from '../../VO/Language';
import { Languages } from '../../VO/Languages';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IMySQLQuery } from '../Interface/IMySQLQuery';

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
