import { MockNominative } from '../../Mock/MockNominative';
import { MockAEntity } from '../Mock/MockAEntity';

describe('MockAEntity', () => {
  describe('equals', () => {
    it('returns true when the ids equal', () => {
      const noun1: MockNominative<number> = new MockNominative<number>(-1);
      const noun2: MockNominative<number> = new MockNominative<number>(0);
      const noun3: MockNominative<number> = new MockNominative<number>(-1);

      const entity1: MockAEntity<number> = new MockAEntity<number>(noun1, {});
      const entity2: MockAEntity<number> = new MockAEntity<number>(noun2, {});
      const entity3: MockAEntity<number> = new MockAEntity<number>(noun3, {});

      expect(entity1.equals(entity1)).toBe(true);
      expect(entity1.equals(entity2)).toBe(false);
      expect(entity1.equals(entity3)).toBe(true);
    });
  });

  describe('hashCode', () => {
    it('returns same value of id\'s hashCode', () => {
      const noun: MockNominative<number> = new MockNominative<number>(-1);

      const entity: MockAEntity<number> = new MockAEntity<number>(noun, {});

      expect(noun.hashCode()).toBe(entity.hashCode());
    });

    it('only depends on the id value, even if the other valeus are changed, returns same hashCode', () => {
      const noun: MockNominative<number> = new MockNominative<number>(-1);

      const entity: MockAEntity<number> = new MockAEntity<number>(noun, {});
      const code1: string = entity.hashCode();
      entity.other = {
        code1
      };
      const code2: string = entity.hashCode();
      entity.other = {
        code1,
        code2
      };
      const code3: string = entity.hashCode();
      entity.other = {
        code1,
        code2
      };

      expect(code1).toBe(code2);
      expect(code2).toBe(code3);
    });
  });
});
