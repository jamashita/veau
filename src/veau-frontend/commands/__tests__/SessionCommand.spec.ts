import 'jest';
import sinon, { SinonStub } from 'sinon';
import { AJAX } from '../../../veau-general/AJAX';
import { SessionCommand } from '../SessionCommand';

describe('SessionCommand', () => {
  describe('delete', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.delete = stub;

      const sessionCommand: SessionCommand = SessionCommand.getInstance();
      await sessionCommand.delete();

      expect(stub.withArgs('/api/destroy').called).toEqual(true);
    });
  });
});
