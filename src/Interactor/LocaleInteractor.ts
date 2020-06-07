import { inject, injectable } from 'inversify';

import { DataSourceError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import { Alive, Dead, Schrodinger, Superposition } from '@jamashita/publikum-monad';

import { ILanguageCommand } from '../Command/Interface/ILanguageCommand';
import { IRegionCommand } from '../Command/Interface/IRegionCommand';
import { Type } from '../Container/Types';
import { ILanguageQuery } from '../Query/Interface/ILanguageQuery';
import { IRegionQuery } from '../Query/Interface/IRegionQuery';
import { LanguagesError } from '../VO/Language/Error/LanguagesError';
import { Languages } from '../VO/Language/Languages';
import { LocaleError } from '../VO/Locale/Error/LocaleError';
import { Locale } from '../VO/Locale/Locale';
import { RegionsError } from '../VO/Region/Error/RegionsError';
import { Regions } from '../VO/Region/Regions';

@injectable()
export class LocaleInteractor implements Noun {
  public readonly noun: 'LocaleInteractor' = 'LocaleInteractor';
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly languageCommand: ILanguageCommand;
  private readonly regionCommand: IRegionCommand;

  public constructor(
    @inject(Type.LanguageKernelQuery) languageQuery: ILanguageQuery,
    @inject(Type.RegionKernelQuery) regionQuery: IRegionQuery,
    @inject(Type.LanguageRedisCommand) languageCommand: ILanguageCommand,
    @inject(Type.RegionRedisCommand) regionCommand: IRegionCommand
  ) {
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.languageCommand = languageCommand;
    this.regionCommand = regionCommand;
  }

  public async all(): Promise<Superposition<Locale, LocaleError | DataSourceError>> {
    const [superposition1, superposition2]: [
      Superposition<Languages, LanguagesError | DataSourceError>,
      Superposition<Regions, RegionsError | DataSourceError>
    ] = await Promise.all<
      Superposition<Languages, LanguagesError | DataSourceError>,
      Superposition<Regions, RegionsError | DataSourceError>
    >([this.languageQuery.all(), this.regionQuery.all()]);

    return superposition1.transform<Locale, LocaleError | DataSourceError>(
      (languages: Languages) => {
        return superposition2.transform<Locale, LocaleError | DataSourceError>(
          (regions: Regions) => {
            return Alive.of<Locale, DataSourceError>(Locale.of(languages, regions));
          },
          (err: RegionsError | DataSourceError) => {
            if (err instanceof RegionsError) {
              return Dead.of<Locale, LocaleError>(new LocaleError('LocaleInteradtor.all()', err));
            }

            return Dead.of<Locale, DataSourceError>(err);
          }
        );
      },
      (err: LanguagesError | DataSourceError) => {
        if (err instanceof LanguagesError) {
          return Dead.of<Locale, LocaleError>(new LocaleError('LocaleInteradtor.all()', err));
        }

        return Dead.of<Locale, DataSourceError>(err);
      }
    );
  }

  public async delete(): Promise<Superposition<unknown, DataSourceError>> {
    const superpositions: Array<Superposition<unknown, DataSourceError>> = await Promise.all<
      Superposition<unknown, DataSourceError>
    >([this.languageCommand.deleteAll(), this.regionCommand.deleteAll()]);

    return Schrodinger.all<unknown, DataSourceError>(superpositions);
  }
}
