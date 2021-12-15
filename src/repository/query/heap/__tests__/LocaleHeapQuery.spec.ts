import { DataSourceError } from '@jamashita/catacombe-datasource';
import { HeapError, MockHeap } from '@jamashita/catacombe-heap';
import { Schrodinger } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { bin } from '../../../../container/Bin';
import { Type } from '../../../../container/Types';
import { LocaleError } from '../../../../domain/vo/Locale/error/LocaleError';
import { Locale } from '../../../../domain/vo/Locale/Locale';
import { MockLocale } from '../../../../domain/vo/Locale/mock/MockLocale';
import { VAULT_LOCALE_KEY } from '../../../../infrastructure/VeauHeap';
import { LocaleHeapQuery } from '../LocaleHeapQuery';

describe('LocaleHeapQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const localeQuery1: LocaleHeapQuery = bin.get<LocaleHeapQuery>(Type.LocaleHeapQuery);
      const localeQuery2: LocaleHeapQuery = bin.get<LocaleHeapQuery>(Type.LocaleHeapQuery);

      expect(localeQuery1).toBeInstanceOf(LocaleHeapQuery);
      expect(localeQuery1).toBe(localeQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(3);

      const locale: MockLocale = new MockLocale();

      const cache: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();

      cache.get = stub;
      stub.returns(locale);

      const localeQuery: LocaleHeapQuery = new LocaleHeapQuery(cache);
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeQuery.all().terminate();

      expect(stub.withArgs(VAULT_LOCALE_KEY).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(locale);
    });

    it('returns Dead when Cache throws HeapError', async () => {
      expect.assertions(2);

      const cache: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();

      cache.get = stub;
      stub.throws(new HeapError('test failed'));

      const localeQuery: LocaleHeapQuery = new LocaleHeapQuery(cache);
      const schrodinger: Schrodinger<Locale, DataSourceError | LocaleError> = await localeQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(HeapError);
    });
  });
});
