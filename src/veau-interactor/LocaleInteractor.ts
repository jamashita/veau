import { inject, injectable } from 'inversify';
import { ILanguageCommand } from '../veau-command/interfaces/ILanguageCommand';
import { IRegionCommand } from '../veau-command/interfaces/IRegionCommand';
import { TYPE } from '../veau-container/Types';
import { CacheError } from '../veau-error/CacheError';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { DataSourceError } from '../veau-general/DataSourceError';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { ILanguageQuery } from '../veau-query/interfaces/ILanguageQuery';
import { IRegionQuery } from '../veau-query/interfaces/IRegionQuery';
import { Languages } from '../veau-vo/Languages';
import { Locale } from '../veau-vo/Locale';
import { Regions } from '../veau-vo/Regions';
import { IInteractor } from './IInteractor';

@injectable()
export class LocaleInteractor implements IInteractor {
  public readonly noun: 'LocaleInteractor' = 'LocaleInteractor';
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;
  private readonly languageCommand: ILanguageCommand;
  private readonly regionCommand: IRegionCommand;

  public constructor(
    @inject(TYPE.LanguageKernelQuery) languageQuery: ILanguageQuery,
    @inject(TYPE.RegionKernelQuery) regionQuery: IRegionQuery,
    @inject(TYPE.LanguageRedisCommand) languageCommand: ILanguageCommand,
    @inject(TYPE.RegionRedisCommand) regionCommand: IRegionCommand
  ) {
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.languageCommand = languageCommand;
    this.regionCommand = regionCommand;
  }

  public async all(): Promise<Try<Locale, NoSuchElementError | DataSourceError>> {
    const trials: [
      Try<Languages, NoSuchElementError | DataSourceError>,
      Try<Regions, NoSuchElementError | DataSourceError>
    ] = await Promise.all<Try<Languages, NoSuchElementError | DataSourceError>, Try<Regions, NoSuchElementError | DataSourceError>>([
      this.languageQuery.all(),
      this.regionQuery.all()
    ]);

    return trials[0].match<Try<Locale, NoSuchElementError | DataSourceError>>((languages: Languages) => {
      return trials[1].match<Try<Locale, NoSuchElementError | DataSourceError>>((regions: Regions) => {
        return Success.of<Locale, DataSourceError>(Locale.of(languages, regions));
      }, (err: NoSuchElementError | DataSourceError) => {
        // TODO
        return Failure.of<Locale, NoSuchElementError | DataSourceError>(err);
      });
    }, (err: NoSuchElementError | DataSourceError) => {
      // TODO
      return Failure.of<Locale, NoSuchElementError | DataSourceError>(err);
    });
  }

  public async delete(): Promise<Try<void, CacheError | DataSourceError>> {
    const trials: [
      Try<void, CacheError | DataSourceError>,
      Try<void, CacheError | DataSourceError>
    ] = await Promise.all<Try<void, CacheError | DataSourceError>, Try<void, CacheError | DataSourceError>>([
      this.languageCommand.deleteAll(),
      this.regionCommand.deleteAll()
    ]);

    return trials[0].match<Try<void, CacheError | DataSourceError>>(() => {
      return trials[1].match<Try<void, CacheError | DataSourceError>>(() => {
        return Success.of<void, DataSourceError>(undefined);
      }, (err: CacheError | DataSourceError) => {
        // TODO
        return Failure.of<void, CacheError | DataSourceError>(err);
      });
    }, (err: CacheError | DataSourceError) => {
      // TODO
      return Failure.of<void, CacheError | DataSourceError>(err);
    });
  }
}
