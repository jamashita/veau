import { inject, injectable } from 'inversify';

import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Alive, Dead, Quantum, Superposition } from '@jamashita/publikum-monad';

import { ILanguageCommand } from '../../Command/Interface/ILanguageCommand';
import { Type } from '../../Container/Types';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { LanguagesError } from '../../VO/Language/Error/LanguagesError';
import { ISO639 } from '../../VO/Language/ISO639';
import { Language } from '../../VO/Language/Language';
import { LanguageID } from '../../VO/Language/LanguageID';
import { Languages } from '../../VO/Language/Languages';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IKernelQuery } from './Interface/IKernelQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IKernelQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Kernel' = 'Kernel';
  private readonly languageMySQLQuery: ILanguageQuery;
  private readonly languageRedisQuery: ILanguageQuery;
  private readonly languageRedisCommand: ILanguageCommand;

  public constructor(
    @inject(Type.LanguageMySQLQuery) languageMySQLQuery: ILanguageQuery,
    @inject(Type.LanguageRedisQuery) languageRedisQuery: ILanguageQuery,
    @inject(Type.LanguageRedisCommand) languageRedisCommand: ILanguageCommand
  ) {
    this.languageMySQLQuery = languageMySQLQuery;
    this.languageRedisQuery = languageRedisQuery;
    this.languageRedisCommand = languageRedisCommand;
  }

  public async all(): Promise<Superposition<Languages, LanguagesError | DataSourceError>> {
    const superposition1: Superposition<
      Languages,
      LanguagesError | DataSourceError
    > = await this.languageRedisQuery.all();

    return superposition1.match<Languages, LanguagesError | DataSourceError>(
      (languages: Languages, self: Alive<Languages, LanguagesError | DataSourceError>) => {
        return Promise.resolve<Superposition<Languages, LanguagesError | DataSourceError>>(self);
      },
      async () => {
        const superposition2: Superposition<
          Languages,
          LanguagesError | DataSourceError
        > = await this.languageMySQLQuery.all();

        return superposition2.match<Languages, LanguagesError | DataSourceError>(
          async (languages: Languages) => {
            const superposition3: Superposition<unknown, DataSourceError> = await this.languageRedisCommand.insertAll(
              languages
            );

            return superposition3.match<Languages, DataSourceError>(
              () => {
                return Alive.of<Languages, DataSourceError>(languages);
              },
              (err: DataSourceError, self: Dead<unknown, DataSourceError>) => {
                return self.transpose<Languages>();
              }
            );
          },
          (err: LanguagesError | DataSourceError, self: Dead<Languages, LanguagesError | DataSourceError>) => {
            return Promise.resolve<Superposition<Languages, LanguagesError | DataSourceError>>(self);
          }
        );
      }
    );
  }

  public find(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    languageID: LanguageID
  ): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public async findByISO639(
    iso639: ISO639
  ): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await this.all();

    return superposition.match<Language, LanguageError | NoSuchElementError | DataSourceError>(
      (languages: Languages) => {
        const quantum: Quantum<Language> = languages.find((language: Language) => {
          return language.getISO639().equals(iso639);
        });

        return quantum.toSuperposition().match<Language, NoSuchElementError | DataSourceError>(
          (language: Language) => {
            return Alive.of<Language, DataSourceError>(language);
          },
          () => {
            return Dead.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
          }
        );
      },
      (err: LanguagesError | DataSourceError) => {
        if (err instanceof LanguagesError) {
          return Dead.of<Language, LanguageError>(new LanguageError('LanguageQuery.findByISO639()', err));
        }

        return Dead.of<Language, DataSourceError>(err);
      }
    );
  }
}
