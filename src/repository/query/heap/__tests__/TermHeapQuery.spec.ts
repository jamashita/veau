import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore';
import 'reflect-metadata';
import { bin } from '../../../../container/Bin';
import { Type } from '../../../../container/Types';
import { TermError } from '../../../../domain/vo/Term/error/TermError';
import { Terms } from '../../../../domain/vo/Term/Terms';
import { TermHeapQuery } from '../TermHeapQuery';

describe('TermHeapQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const termQuery1: TermHeapQuery = bin.get<TermHeapQuery>(Type.TermHeapQuery);
      const termQuery2: TermHeapQuery = bin.get<TermHeapQuery>(Type.TermHeapQuery);

      expect(termQuery1).toBeInstanceOf(TermHeapQuery);
      expect(termQuery1).toBe(termQuery2);
    });
  });

  describe('all', () => {
    it('returns singleton Terms', async () => {
      expect.assertions(2);

      const termQuery: TermHeapQuery = new TermHeapQuery();
      const schrodinger: Schrodinger<Terms, DataSourceError | TermError> = await termQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(Terms.all());
    });
  });
});
