import { inject, injectable } from 'inversify';
import { ILanguageCommand } from '../../veau-command/interfaces/ILanguageCommand';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Languages } from '../../veau-vo/Languages';
import { IKernelQuery } from '../interfaces/IKernelQuery';
import { ILanguageQuery } from '../interfaces/ILanguageQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IKernelQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Kernel' = 'Kernel';
  private readonly languageMySQLQuery: ILanguageQuery;
  private readonly languageRedisQuery: ILanguageQuery;
  private readonly languageRedisCommand: ILanguageCommand;

  public constructor(@inject(TYPE.LanguageMySQLQuery) languageMySQLQuery: ILanguageQuery,
    @inject(TYPE.LanguageRedisQuery) languageRedisQuery: ILanguageQuery,
    @inject(TYPE.LanguageRedisCommand) languageRedisCommand: ILanguageCommand
  ) {
    this.languageMySQLQuery = languageMySQLQuery;
    this.languageRedisQuery = languageRedisQuery;
    this.languageRedisCommand = languageRedisCommand;
  }

  public async all(): Promise<Try<Languages, NoSuchElementError | DataSourceError>> {
    const trial1: Try<Languages, NoSuchElementError | DataSourceError> = await this.languageRedisQuery.all();

    return trial1.match<Promise<Try<Languages, NoSuchElementError | DataSourceError>>>((languages: Languages) => {
      return Promise.resolve<Success<Languages, DataSourceError>>(Success.of<Languages, DataSourceError>(languages));
    }, async () => {
      const trial2: Try<Languages, NoSuchElementError | DataSourceError> = await this.languageMySQLQuery.all();

      return trial2.match<Promise<Try<Languages, NoSuchElementError | DataSourceError>>>(async (languages: Languages) => {
        const trial3: Try<void, DataSourceError> = await this.languageRedisCommand.insertAll(languages);

        return trial3.match<Try<Languages, DataSourceError>>(() => {
          return Success.of<Languages, DataSourceError>(languages);
        }, (err: DataSourceError) => {
          return Failure.of<Languages, DataSourceError>(err);
        });
      }, (err: NoSuchElementError | DataSourceError) => {
        return Promise.resolve<Failure<Languages, NoSuchElementError | DataSourceError>>(Failure.of<Languages, NoSuchElementError | DataSourceError>(err));
      });
    });
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | DataSourceError>> {
    const trial: Try<Languages, NoSuchElementError | DataSourceError> = await this.all();

    return trial.match<Try<Language, NoSuchElementError | DataSourceError>>((languages: Languages) => {
      const found: Language | undefined = languages.find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      if (found === undefined) {
        return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
      }

      return Success.of<Language, DataSourceError>(found);
    }, (err: NoSuchElementError | DataSourceError) => {
      return Failure.of<Language, NoSuchElementError | DataSourceError>(err);
    });
  }
}
