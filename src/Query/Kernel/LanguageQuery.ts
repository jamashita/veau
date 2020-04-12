import { inject, injectable } from 'inversify';
import { ILanguageCommand } from '../../Command/Interface/ILanguageCommand';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Optional } from '../../General/Optional/Optional';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { Languages } from '../../VO/Languages';
import { IKernelQuery } from '../Interface/IKernelQuery';
import { ILanguageQuery } from '../Interface/ILanguageQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IKernelQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Kernel' = 'Kernel';
  private readonly languageMySQLQuery: ILanguageQuery;
  private readonly languageRedisQuery: ILanguageQuery;
  private readonly languageRedisCommand: ILanguageCommand;

  public constructor(
    @inject(TYPE.LanguageMySQLQuery) languageMySQLQuery: ILanguageQuery,
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
      return Promise.resolve<Try<Languages, DataSourceError>>(Success.of<Languages, DataSourceError>(languages));
    }, async () => {
      const trial2: Try<Languages, NoSuchElementError | DataSourceError> = await this.languageMySQLQuery.all();

      return trial2.match<Promise<Try<Languages, NoSuchElementError | DataSourceError>>>(async (languages: Languages) => {
        const trial3: Try<void, DataSourceError> = await this.languageRedisCommand.insertAll(languages);

        return trial3.match<Try<Languages, DataSourceError>>(() => {
          return Success.of<Languages, DataSourceError>(languages);
        }, (err: DataSourceError, self: Failure<void, DataSourceError>) => {
          return self.transpose<Languages>();
        });
      }, (err: NoSuchElementError | DataSourceError, self: Failure<Languages, NoSuchElementError | DataSourceError>) => {
        return Promise.resolve<Try<Languages, NoSuchElementError | DataSourceError>>(self);
      });
    });
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | DataSourceError>> {
    const trial: Try<Languages, NoSuchElementError | DataSourceError> = await this.all();

    return trial.match<Try<Language, NoSuchElementError | DataSourceError>>((languages: Languages) => {
      const optional: Optional<Language> = languages.find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      return optional.toTry().match<Try<Language, NoSuchElementError | DataSourceError>>((language: Language) => {
        return Success.of<Language, DataSourceError>(language);
      }, () => {
        return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
      });
    }, (err: NoSuchElementError | DataSourceError, self: Failure<Languages, NoSuchElementError | DataSourceError>) => {
      return self.transpose<Language>();
    });
  }
}