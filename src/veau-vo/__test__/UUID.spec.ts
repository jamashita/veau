import 'jest';
import {UUID} from '../UUID';

describe('UUID', () => {
  it('generate method always generates 36 length string', () => {
    for (let i = 0; i < 100000; i++) {
      const uuid: UUID = UUID.generate();
      expect(uuid.get().length).toEqual(36);
    }
  });

  it('equals', () => {
    const uuid1: UUID = UUID.of('958dcd4c-0476-476a-9815-45609eb95dd0');
    const uuid2: UUID = UUID.of('8b95aa02-0ecd-4044-ae23-e000681fb849');
    const uuid3: UUID = UUID.of('958dcd4c-0476-476a-9815-45609eb95dd0');

    expect(uuid1.equals(uuid1)).toEqual(true);
    expect(uuid1.equals(uuid2)).toEqual(false);
    expect(uuid1.equals(uuid3)).toEqual(true);
  });
});
