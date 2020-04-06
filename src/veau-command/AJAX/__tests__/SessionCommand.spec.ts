import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { vault } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { AJAXError } from '../../../veau-error/AJAXError';
import { AJAX } from '../../../veau-general/AJAX';
import { Try } from '../../../veau-general/Try/Try';
import { SessionCommand } from '../SessionCommand';

describe('SessionCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const sessionCommand1: SessionCommand = vault.get<SessionCommand>(TYPE.SessionAJAXCommand);
      const sessionCommand2: SessionCommand = vault.get<SessionCommand>(TYPE.SessionAJAXCommand);

      expect(sessionCommand1).toBeInstanceOf(SessionCommand);
      expect(sessionCommand1).toBe(sessionCommand2);
    });
  });

  describe('delete', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.prototype.delete = stub;
      stub.resolves({
        status: OK,
        body: {
        }
      });

      const sessionCommand: SessionCommand = vault.get<SessionCommand>(TYPE.SessionAJAXCommand);
      const trial: Try<void, AJAXError> = await sessionCommand.delete();

      expect(trial.isSuccess()).toEqual(true);
      expect(stub.withArgs('/api/destroy').called).toEqual(true);
    });

    it('throws AJAXError', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.prototype.delete = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const sessionCommand: SessionCommand = vault.get<SessionCommand>(TYPE.SessionAJAXCommand);
      const trial: Try<void, AJAXError> = await sessionCommand.delete();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
