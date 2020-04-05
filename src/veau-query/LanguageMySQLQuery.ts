import { inject, injectable } from 'inversify';
import { TYPE } from '../veau-container/Types';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { MySQL } from '../veau-general/MySQL/MySQL';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { ISO639 } from '../veau-vo/ISO639';
import { Language, LanguageRow } from '../veau-vo/Language';
import { Languages } from '../veau-vo/Languages';
import { ILanguageQuery } from './ILanguageQuery';

@injectable()
export class LanguageMySQLQuery implements ILanguageQuery {
  private mysql: MySQL;

  public constructor(@inject(TYPE.MySQL) mysql: MySQL) {
    this.mysql = mysql;
  }

  public async all(): Promise<Try<Languages, NoSuchElementError>> {
    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      FORCE INDEX(iso639)
      ORDER BY R1.iso639;`;

    const languageRows: Array<LanguageRow> = await this.mysql.execute<Array<LanguageRow>>(query);

    if (languageRows.length === 0) {
      return Failure.of<Languages, NoSuchElementError>(new NoSuchElementError('NO LANGUAGES FROM MYSQL'));
    }

    return Success.of<Languages, NoSuchElementError>(Languages.ofRow(languageRows));
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError>> {
    const query: string = `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      WHERE R1.iso639 = :iso639;`;

    const languageRows: Array<LanguageRow> = await this.mysql.execute<Array<LanguageRow>>(query, {
      iso639: iso639.get()
    });

    if (languageRows.length === 0) {
      return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
    }

    return Success.of<Language, NoSuchElementError>(Language.ofRow(languageRows[0]));
  }
}
