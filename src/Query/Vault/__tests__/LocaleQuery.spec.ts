import 'reflect-metadata';

import sinon, { SinonSpy, SinonStub } from 'sinon';

import { AJAXError } from '@jamashita/publikum-ajax';
import { CacheError } from '@jamashita/publikum-cache';
import { DataSourceError } from '@jamashita/publikum-error';
import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';

import { MockLocaleCommand } from '../../../Command/Mock/MockLocaleCommand';
import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { LocaleError } from '../../../VO/Locale/Error/LocaleError';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { LocaleQuery } from '../LocaleQuery';

describe('LocaleQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeQuery1: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleVaultQuery);
      const localeQuery2: LocaleQuery = vault.get<LocaleQuery>(Type.LocaleVaultQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

  describe('all', () => {
    it('returns Alive because Cache has', async () => {
      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.resolves(Alive.of<Locale, DataSourceError>(locale));
      const stub2: SinonStub = sinon.stub();

      localeAJAXQuery.all = stub2;
      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeQuery.all();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(false);
      expect(stub3.called).toBe(false);
      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(locale);
    });

    it('returns Alive because AJAX has', async () => {
      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.resolves(Dead.of<Locale, DataSourceError>(new CacheError('test failed')));
      const stub2: SinonStub = sinon.stub();

      localeAJAXQuery.all = stub2;
      stub2.resolves(Alive.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;
      stub3.resolves(Alive.of<DataSourceError>());

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeQuery.all();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const loc: Locale = superposition.get();

      expect(loc).toBe(locale);
    });

    it('returns Dead Cache nor AJAX returned nothing', async () => {
      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.resolves(Dead.of<Locale, DataSourceError>(new CacheError('test failed')));
      const stub2: SinonStub = sinon.stub();

      localeAJAXQuery.all = stub2;
      stub2.resolves(Dead.of<Locale, DataSourceError>(new AJAXError('test failed', 500)));
      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeQuery.all();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(false);
      expect(superposition.isDead()).toBe(true);
      superposition.transform<void>(
        () => {
          spy1();
        },
        (err: LocaleError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead Cache because saving Cache failure', async () => {
      const locale: MockLocale = new MockLocale();

      const localeCacheQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeAJAXQuery: MockLocaleQuery = new MockLocaleQuery();
      const localeCommand: MockLocaleCommand = new MockLocaleCommand();
      const stub1: SinonStub = sinon.stub();

      localeCacheQuery.all = stub1;
      stub1.resolves(Dead.of<Locale, DataSourceError>(new CacheError('test failed')));
      const stub2: SinonStub = sinon.stub();

      localeAJAXQuery.all = stub2;
      stub2.resolves(Alive.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();

      localeCommand.create = stub3;
      stub3.resolves(Dead.of<Locale, DataSourceError>(new CacheError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeQuery: LocaleQuery = new LocaleQuery(localeAJAXQuery, localeCacheQuery, localeCommand);
      const superposition: Superposition<Locale, LocaleError | DataSourceError> = await localeQuery.all();

      expect(stub1.called).toBe(true);
      expect(stub2.called).toBe(true);
      expect(stub3.called).toBe(true);
      expect(superposition.isDead()).toBe(true);
      superposition.transform<void>(
        () => {
          spy1();
        },
        (err: LocaleError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(CacheError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
