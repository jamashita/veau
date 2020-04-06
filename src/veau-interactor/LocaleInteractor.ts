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

  public constructor(@inject(TYPE.LanguageQuery) languageQuery: ILanguageQuery,
    @inject(TYPE.RegionQuery) regionQuery: IRegionQuery,
    @inject(TYPE.LanguageRedisCommand) languageCommand: ILanguageCommand,
    @inject(TYPE.RegionRedisCommand) regionCommand: IRegionCommand
  ) {
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
    this.languageCommand = languageCommand;
    this.regionCommand = regionCommand;
  }

  public async all(): Promise<Try<Locale, NoSuchElementError>> {
    const trials: [
      Try<Languages, NoSuchElementError | DataSourceError>,
      Try<Regions, NoSuchElementError | DataSourceError>
    ] = await Promise.all([
      this.languageQuery.all(),
      this.regionQuery.all()
    ]);

    return trials[0].match<Try<Locale, NoSuchElementError>>((languages: Languages) => {
      return trials[1].match<Try<Locale, NoSuchElementError>>((regions: Regions) => {
        return Success.of<Locale, NoSuchElementError>(Locale.of(languages, regions));
      }, (err: NoSuchElementError | DataSourceError) => {
        // TODO SourceError
        // return Failure.of<Locale, NoSuchElementError>(err);
        return Failure.of<Locale, NoSuchElementError>(new NoSuchElementError('temporary error avoiding'));
      });
    }, (err: NoSuchElementError | DataSourceError) => {
      // TODO SourceError
      // return Failure.of<Locale, NoSuchElementError>(err);
      return Failure.of<Locale, NoSuchElementError>(new NoSuchElementError('temporary error avoiding'));
    });
  }

  public async delete(): Promise<Try<void, CacheError | DataSourceError>> {
    const trials: [Try<void, CacheError | DataSourceError>, Try<void, CacheError | DataSourceError>] = await Promise.all([
      this.languageCommand.deleteAll(),
      this.regionCommand.deleteAll()
    ]);

    if (trials[0].isFailure()) {
      return trials[0];
    }
    if (trials[1].isFailure()) {
      return trials[1];
    }

    return Success.of<void, CacheError>(undefined);
  }
}
