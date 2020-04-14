import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { vault } from '../../../Container/Vault';
import { TYPE } from '../../../Container/Types';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { AJAXError } from '../../../General/AJAX/AJAXError';
import { DataSourceError } from '../../../General/DataSourceError';
import { Failure } from '../../../General/Try/Failure';
import { Success } from '../../../General/Try/Success';
import { Try } from '../../../General/Try/Try';
import { ISO3166 } from '../../../VO/ISO3166';
import { Locale } from '../../../VO/Locale';
import { Region } from '../../../VO/Region';
import { RegionID } from '../../../VO/RegionID';
import { RegionName } from '../../../VO/RegionName';
import { Regions } from '../../../VO/Regions';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { RegionQuery } from '../RegionQuery';
import { MockLocale } from '../../../VO/Mock/MockLocale';
import { MockRegions } from '../../../VO/Mock/MockRegions';

// DONE
describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionQuery1: RegionQuery = vault.get<RegionQuery>(TYPE.RegionVaultQuery);
      const regionQuery2: RegionQuery = vault.get<RegionQuery>(TYPE.RegionVaultQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const locale: MockLocale = new MockLocale();

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const trial: Try<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toEqual(locale.getRegions());
    });

    it('LocaleQuery returns Failure', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Failure.of<Locale, DataSourceError>(new AJAXError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const trial: Try<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const locale: MockLocale = new MockLocale({
        regions: new MockRegions(
          Region.of(
            RegionID.of(1),
            RegionName.of('Afghanistan'),
            ISO3166.of('AFG')
          ),
          Region.of(
            RegionID.of(2),
            RegionName.of('Albania'),
            ISO3166.of('ALB')
          )
        )
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toEqual(locale.getRegions().get(1).get());
    });

    it('LocaleQuery.all returns Failure', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Failure.of<Locale, DataSourceError>(new AJAXError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('no match results', async () => {
      const locale: MockLocale = new MockLocale({
        regions: new MockRegions(
          Region.of(
            RegionID.of(1),
            RegionName.of('Afghanistan'),
            ISO3166.of('AFG')
          ),
          Region.of(
            RegionID.of(2),
            RegionName.of('Albania'),
            ISO3166.of('ALB')
          )
        )
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('OOP'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
