import { AJAXError, MockAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { SessionCommand } from '../SessionCommand';

describe('SessionCommand', () => {
  // TODO
  // eslint-disable-next-line jest/no-commented-out-tests
  // describe('container', () => {
  // eslint-disable-next-line jest/no-commented-out-tests
  //   it('must be a singleton', () => {
  //     const sessionCommand1: SessionCommand = v.get<SessionCommand>(Type.SessionAJAXCommand);
  //     const sessionCommand2: SessionCommand = v.get<SessionCommand>(Type.SessionAJAXCommand);
  //
  //     expect(sessionCommand1).toBeInstanceOf(SessionCommand);
  //     expect(sessionCommand1).toBe(sessionCommand2);
  //   });
  // });

  describe('delete', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const ajax: MockAJAX<'json'> = new MockAJAX<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.delete = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: {}
      });

      const sessionCommand: SessionCommand = new SessionCommand(ajax);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await sessionCommand.delete().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(stub.withArgs('/api/session').called).toBe(true);
    });

    it('throws AJAXError', async () => {
      expect.assertions(2);

      const ajax: MockAJAX<'json'> = new MockAJAX<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.delete = stub;
      stub.resolves({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {}
      });

      const sessionCommand: SessionCommand = new SessionCommand(ajax);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await sessionCommand.delete().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AJAXError);
    });
  });
});
