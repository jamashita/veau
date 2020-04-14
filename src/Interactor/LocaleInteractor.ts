import { inject, injectable } from 'inversify';
import { ILanguageCommand } from '../Command/Interface/ILanguageCommand';
import { IRegionCommand } from '../Command/Interface/IRegionCommand';
import { TYPE } from '../Container/Types';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { DataSourceError } from '../General/DataSourceError';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { ILanguageQuery } from '../Query/Interface/ILanguageQuery';
import { IRegionQuery } from '../Query/Interface/IRegionQuery';
import { Languages } from '../VO/Languages';
import { Locale } from '../VO/Locale';
import { Regions } from '../VO/Regions';
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
    const [
      languagesTry,
      regionsTry
    ]: [
      Try<Languages, NoSuchElementError | DataSourceError>,
      Try<Regions, NoSuchElementError | DataSourceError>
    ] = await Promise.all<Try<Languages, NoSuchElementError | DataSourceError>, Try<Regions, NoSuchElementError | DataSourceError>>([
      this.languageQuery.all(),
      this.regionQuery.all()
    ]);

    return languagesTry.match<Try<Locale, NoSuchElementError | DataSourceError>>((languages: Languages) => {
      return regionsTry.match<Try<Locale, NoSuchElementError | DataSourceError>>((regions: Regions) => {
        return Success.of<Locale, DataSourceError>(Locale.of(languages, regions));
      }, (err: NoSuchElementError | DataSourceError, self: Failure<Regions, NoSuchElementError | DataSourceError>) => {
        return self.transpose<Locale>();
      });
    }, (err: NoSuchElementError | DataSourceError, self: Failure<Languages, NoSuchElementError | DataSourceError>) => {
      return self.transpose<Locale>();
    });
  }

  public async delete(): Promise<Try<void, DataSourceError>> {
    const [
      languagesTry,
      regionsTry
    ]: [
      Try<void, DataSourceError>,
      Try<void, DataSourceError>
    ] = await Promise.all<Try<void, DataSourceError>, Try<void, DataSourceError>>([
      this.languageCommand.deleteAll(),
      this.regionCommand.deleteAll()
    ]);

    return languagesTry.match<Try<void, DataSourceError>>(() => {
      return regionsTry.match<Try<void, DataSourceError>>(() => {
        return Success.of<DataSourceError>();
      }, (err: DataSourceError, self: Failure<void, DataSourceError>) => {
        return self;
      });
    }, (err: DataSourceError, self: Failure<void, DataSourceError>) => {
      return self;
    });
  }
}
