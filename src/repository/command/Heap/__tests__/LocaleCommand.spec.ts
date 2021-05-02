import { DataSourceError } from '@jamashita/catacombe-datasource';
import { HeapError, MockHeap } from '@jamashita/catacombe-heap';
import { Schrodinger } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { Type } from '../../../../container/Types';
import { vault } from '../../../../container/Vault';
import { Locale } from '../../../../domain/vo/Locale/Locale';
import { MockLocale } from '../../../../domain/vo/Locale/Mock/MockLocale';
import { VAULT_LOCALE_KEY } from '../../../../infrastructure/VeauHeap';
import { LocaleCommand } from '../LocaleCommand';

describe('LocaleCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const localeCommand1: LocaleCommand = vault.get<LocaleCommand>(Type.LocaleHeapCommand);
      const localeCommand2: LocaleCommand = vault.get<LocaleCommand>(Type.LocaleHeapCommand);

      expect(localeCommand1).toBeInstanceOf(LocaleCommand);
      expect(localeCommand1).toBe(localeCommand2);
    });
  });

  describe('create', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const locale: Locale = new MockLocale();

      const cache: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();

      cache.set = stub;
      stub.returns(locale);

      const localeCommand: LocaleCommand = new LocaleCommand(cache);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await localeCommand.create(locale).terminate();

      expect(stub.withArgs(VAULT_LOCALE_KEY, locale).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead when Cache throws HeapError', async () => {
      expect.assertions(2);

      const locale: Locale = new MockLocale();

      const cache: MockHeap = new MockHeap();
      const stub: SinonStub = sinon.stub();

      cache.set = stub;
      stub.throws(new HeapError('test failed'));

      const localeCommand: LocaleCommand = new LocaleCommand(cache);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await localeCommand.create(locale).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(HeapError);
    });
  });
});
