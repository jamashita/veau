import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { MockLocaleCommand } from '../../../Command/Mock/MockLocaleCommand';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { AJAXError } from '../../../General/AJAX/AJAXError';
import { CacheError } from '../../../General/Cache/CacheError';
import { DataSourceError } from '../../../General/DataSourceError';
import { Failure } from '../../../General/Superposition/Failure';
import { Success } from '../../../General/Superposition/Success';
import { Try } from '../../../General/Superposition/Try';
import { Locale } from '../../../VO/Locale';
import { MockLocale } from '../../../VO/Mock/MockLocale';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { LocaleQuery } from '../LocaleQuery';

// DONE
describe('LocaleQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(TYPE.LocaleVaultQuery);
      const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(TYPE.LocaleVaultQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

  describe('all', () => {
    it('returns Success because Cache has', async () => {
      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();
      localeCacheQuery.all = stub1;
      stub1.resolves(Success.of<Locale, DataSourceError>(locale));
      const stub2: SinonStub = sinon.stub();
      localeAJAXQuery.all = stub2;
      const stub3: SinonStub = sinon.stub();
      localeCommand.create = stub3;

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(false);
      expect(stub3.called).toEqual(false);
      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toEqual(locale);
    });

    it('returns Success because AJAX has', async () => {
      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();
      localeCacheQuery.all = stub1;
      stub1.resolves(Failure.of<Locale, DataSourceError>(new CacheError('test failed')));
      const stub2: SinonStub = sinon.stub();
      localeAJAXQuery.all = stub2;
      stub2.resolves(Success.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();
      localeCommand.create = stub3;
      stub3.resolves(Success.of<DataSourceError>());

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const loc: Locale = trial.get();
      expect(loc).toEqual(locale);
    });

    it('returns Failure Cache nor AJAX returned nothing', async () => {
      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();
      localeCacheQuery.all = stub1;
      stub1.resolves(Failure.of<Locale, DataSourceError>(new CacheError('test failed')));
      const stub2: SinonStub = sinon.stub();
      localeAJAXQuery.all = stub2;
      stub2.resolves(Failure.of<Locale, DataSourceError>(new AJAXError('test failed', 500)));
      const stub3: SinonStub = sinon.stub();
      localeCommand.create = stub3;
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(false);
      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure Cache nor AJAX returned nothing', async () => {
      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();
      localeCacheQuery.all = stub1;
      stub1.resolves(Failure.of<Locale, DataSourceError>(new CacheError('test failed')));
      const stub2: SinonStub = sinon.stub();
      localeAJAXQuery.all = stub2;
      stub2.resolves(Success.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();
      localeCommand.create = stub3;
      stub3.resolves(Failure.of<Locale, DataSourceError>(new CacheError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const trial: Try<Locale, DataSourceError> = await localeQuery.all();

      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      expect(stub3.called).toEqual(true);
      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(CacheError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
