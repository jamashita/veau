import sinon, { SinonSpy } from 'sinon';

import { Superposition } from '@jamashita/publikum-monad';
import { Zeit } from '@jamashita/publikum-zeit';

import { UpdatedAtError } from '../Error/UpdatedAtError';
import { UpdatedAt } from '../UpdatedAt';

describe('UpdatedAt', () => {
  describe('ofString', () => {
    it('returns Dead if the parameter is not date format', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const superposition1: Superposition<UpdatedAt, UpdatedAtError> = UpdatedAt.ofString('this is not date');
      const superposition2: Superposition<UpdatedAt, UpdatedAtError> = UpdatedAt.ofString('2000-01-01');

      expect(superposition1.isDead()).toBe(true);
      superposition1.match<void>(
        () => {
          spy1();
        },
        (err: UpdatedAtError) => {
          spy2();
          expect(err).toBeInstanceOf(UpdatedAtError);
        }
      );
      expect(superposition2.isDead()).toBe(true);
      superposition2.match<void>(
        () => {
          spy3();
        },
        (err: UpdatedAtError) => {
          spy4();
          expect(err).toBeInstanceOf(UpdatedAtError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('normal case', () => {
      const superposition: Superposition<UpdatedAt, UpdatedAtError> = UpdatedAt.ofString('2000-01-01 00:00:00');

      expect(superposition.isAlive()).toBe(true);
    });
  });

  describe('format', () => {
    it('returns YYYY-MM-DD HH:mm:ss', () => {
      expect(UpdatedAt.format()).toBe('YYYY-MM-DD HH:mm:ss');
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const at1: UpdatedAt = UpdatedAt.of(Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss'));
      const at2: UpdatedAt = UpdatedAt.of(Zeit.ofString('2000-01-02 00:00:00', 'YYYY-MM-DD HH:mm:ss'));
      const at3: UpdatedAt = UpdatedAt.of(Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss'));

      expect(at1.equals(at1)).toBe(true);
      expect(at1.equals(at2)).toBe(false);
      expect(at1.equals(at3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const at: string = '2345-06-07 08:09:10';
      const updatedAt: UpdatedAt = UpdatedAt.ofString(at).get();

      expect(updatedAt.toString()).toBe(at);
    });
  });
});
