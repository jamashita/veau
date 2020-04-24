import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, Quantum, Superposition } from 'publikum';
import { ILanguageCommand } from '../../Command/Interface/ILanguageCommand';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
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

  public async all(): Promise<Superposition<Languages, NoSuchElementError | DataSourceError>> {
    const superposition1: Superposition<Languages, NoSuchElementError | DataSourceError> = await this.languageRedisQuery.all();

    return superposition1.match<Languages, NoSuchElementError | DataSourceError>((languages: Languages) => {
      return Promise.resolve<Superposition<Languages, DataSourceError>>(Alive.of<Languages, DataSourceError>(languages));
    }, async () => {
      const superposition2: Superposition<Languages, NoSuchElementError | DataSourceError> = await this.languageMySQLQuery.all();

      return superposition2.match<Languages, NoSuchElementError | DataSourceError>(async (languages: Languages) => {
        const superposition3: Superposition<void, DataSourceError> = await this.languageRedisCommand.insertAll(languages);

        return superposition3.match<Languages, DataSourceError>(() => {
          return Alive.of<Languages, DataSourceError>(languages);
        }, (err: DataSourceError, self: Dead<void, DataSourceError>) => {
          return self.transpose<Languages>();
        });
      }, (err: NoSuchElementError | DataSourceError, self: Dead<Languages, NoSuchElementError | DataSourceError>) => {
        return Promise.resolve<Superposition<Languages, NoSuchElementError | DataSourceError>>(self);
      });
    });
  }

  public async findByISO639(iso639: ISO639): Promise<Superposition<Language, NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await this.all();

    return superposition.match<Language, NoSuchElementError | DataSourceError>((languages: Languages) => {
      const quantum: Quantum<Language> = languages.find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      return quantum.toSuperposition().match<Language, NoSuchElementError | DataSourceError>((language: Language) => {
        return Alive.of<Language, DataSourceError>(language);
      }, () => {
        return Dead.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
      });
    }, (err: NoSuchElementError | DataSourceError, self: Dead<Languages, NoSuchElementError | DataSourceError>) => {
      return self.transpose<Language>();
    });
  }
}
