import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore';
import 'reflect-metadata';
import { Type } from '../../../../container/Types';
import { vault } from '../../../../container/Vault';
import { TermError } from '../../../../domain/vo/Term/error/TermError';
import { Terms } from '../../../../domain/vo/Term/Terms';
import { TermQuery } from '../TermQuery';

describe('TermQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const termQuery1: TermQuery = vault.get<TermQuery>(Type.TermHeapQuery);
      const termQuery2: TermQuery = vault.get<TermQuery>(Type.TermHeapQuery);

      expect(termQuery1).toBeInstanceOf(TermQuery);
      expect(termQuery1).toBe(termQuery2);
    });
  });

  describe('all', () => {
    it('returns singleton Terms', async () => {
      expect.assertions(2);

      const termQuery: TermQuery = new TermQuery();
      const schrodinger: Schrodinger<Terms, DataSourceError | TermError> = await termQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(Terms.all());
    });
  });
});