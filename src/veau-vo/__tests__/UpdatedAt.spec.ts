import 'jest';
import moment from 'moment';
import sinon, { SinonStub } from 'sinon';
import { UpdatedAtError } from '../../veau-error/UpdatedAtError';
import { UpdatedAt } from '../UpdatedAt';

describe('UpdatedAt', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const at1: UpdatedAt = UpdatedAt.of(moment('2000-01-01'));
      const at2: UpdatedAt = UpdatedAt.of(moment('2000-01-02'));
      const at3: UpdatedAt = UpdatedAt.of(moment('2000-01-01'));

      expect(at1.equals(at1)).toEqual(true);
      expect(at1.equals(at2)).toEqual(false);
      expect(at1.equals(at3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const at: string = '2000-01-01 00:01:02';
      const updatedAt: UpdatedAt = UpdatedAt.ofString(at);

      expect(updatedAt.toString()).toEqual(at);
    });
  });

  describe('ofString', () => {
    it('throws UpdatedAtError if the parameter is not date format', () => {
      expect(() => {
        UpdatedAt.ofString('this is not date');
      }).toThrow(UpdatedAtError);
    });

    it('normal case', () => {
      expect(() => {
        UpdatedAt.ofString('2000-01-01');
      }).not.toThrow(UpdatedAtError);
    });
  });

  describe('now', () => {
    it('returns current utc time', () => {
      const stub: SinonStub = sinon.stub();
      moment.utc = stub;
      stub.returns(moment('2000-01-01 00:00:00'));

      expect(UpdatedAt.now().toString()).toEqual('2000-01-01 00:00:00');
    });
  });
});
