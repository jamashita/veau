import 'reflect-metadata';

import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { TermsError } from '../../../VO/Term/Error/TermsError';
import { Terms } from '../../../VO/Term/Terms';
import { TermQuery } from '../TermQuery';

describe('TermQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const termQuery1: TermQuery = vault.get<TermQuery>(Type.TermCacheQuery);
      const termQuery2: TermQuery = vault.get<TermQuery>(Type.TermCacheQuery);

      expect(termQuery1).toBeInstanceOf(TermQuery);
      expect(termQuery1).toBe(termQuery2);
    });
  });

  describe('all', () => {
    it('returns singleton Terms', async () => {
      const termQuery: TermQuery = new TermQuery();
      const superposition: Superposition<Terms, TermsError | DataSourceError> = await termQuery.all();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(Terms.all());
    });
  });
});
