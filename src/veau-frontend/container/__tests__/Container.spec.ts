import 'jest';
import { Container } from '../Container';
import { NoInstanceError } from '../NoInstanceError';

describe('Container', () => {
  describe('get', () => {
    it('successfully get the instance', () => {
      const container: Container = new Container();
      const identifier: symbol = Symbol('test');
      const instance: Map<unknown, unknown> = new Map<unknown, unknown>();

      container.bind(identifier, instance);

      expect(container.get<Map<unknown, unknown>>(identifier)).toEqual(instance);
    });

    it('throws error when the instance does not exist', () => {
      const container: Container = new Container();
      const identifier: symbol = Symbol('test');

      expect(() => {
        container.get<Map<unknown, unknown>>(identifier);
      }).toThrow(NoInstanceError);
    });
  });
});
