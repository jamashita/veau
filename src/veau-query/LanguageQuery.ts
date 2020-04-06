import { inject, injectable } from 'inversify';
import { ILanguageCommand } from '../veau-command/interfaces/ILanguageCommand';
import { TYPE } from '../veau-container/Types';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { ISO639 } from '../veau-vo/ISO639';
import { Language } from '../veau-vo/Language';
import { Languages } from '../veau-vo/Languages';
import { ILanguageQuery } from './interfaces/ILanguageQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Complex' = 'Complex';
  private readonly languageMySQLQuery: ILanguageQuery;
  private readonly languageRedisQuery: ILanguageQuery;
  private readonly languageCommand: ILanguageCommand;

  public constructor(@inject(TYPE.LanguageMySQLQuery) languageMySQLQuery: ILanguageQuery,
    @inject(TYPE.LanguageRedisQuery) languageRedisQuery: ILanguageQuery,
    @inject(TYPE.LanguageRedisCommand) languageCommand: ILanguageCommand
  ) {
    this.languageMySQLQuery = languageMySQLQuery;
    this.languageRedisQuery = languageRedisQuery;
    this.languageCommand = languageCommand;
  }

  public async all(): Promise<Try<Languages, NoSuchElementError>> {
    const trial1: Try<Languages, NoSuchElementError> = await this.languageRedisQuery.all();

    return trial1.match<Promise<Try<Languages, NoSuchElementError>>>((languages: Languages) => {
      return Promise.resolve<Success<Languages, NoSuchElementError>>(Success.of<Languages, NoSuchElementError>(languages));
    }, async () => {
      const trial2: Try<Languages, NoSuchElementError> = await this.languageMySQLQuery.all();

      return trial2.match<Promise<Try<Languages, NoSuchElementError>>>(async (languages: Languages) => {
        await this.languageCommand.insertAll(languages);

        return Success.of<Languages, NoSuchElementError>(languages);
      }, (err: NoSuchElementError) => {
        return Promise.resolve<Failure<Languages, NoSuchElementError>>(Failure.of<Languages, NoSuchElementError>(err));
      });
    });
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError>> {
    const trial: Try<Languages, NoSuchElementError> = await this.all();

    return trial.match<Try<Language, NoSuchElementError>>((languages: Languages) => {
      const found: Language | undefined = languages.find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      if (found === undefined) {
        return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
      }

      return Success.of<Language, NoSuchElementError>(found);
    }, (err: NoSuchElementError) => {
      return Failure.of<Language, NoSuchElementError>(err);
    });
  }
}
