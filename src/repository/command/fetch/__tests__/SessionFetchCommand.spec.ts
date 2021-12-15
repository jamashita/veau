import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError, MockFetch } from '@jamashita/catacombe-fetch';
import { Schrodinger } from '@jamashita/genitore';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { bin } from '../../../../container/Bin';
import { Type } from '../../../../container/Types';
import { SessionFetchCommand } from '../SessionFetchCommand';

describe('SessionFetchCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const sessionCommand1: SessionFetchCommand = bin.get<SessionFetchCommand>(Type.SessionFetchCommand);
      const sessionCommand2: SessionFetchCommand = bin.get<SessionFetchCommand>(Type.SessionFetchCommand);

      expect(sessionCommand1).toBeInstanceOf(SessionFetchCommand);
      expect(sessionCommand1).toBe(sessionCommand2);
    });
  });

  describe('delete', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.delete = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: {}
      });

      const sessionCommand: SessionFetchCommand = new SessionFetchCommand(ajax);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await sessionCommand.delete().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(stub.withArgs('/api/session').called).toBe(true);
    });

    it('throws FetchError', async () => {
      expect.assertions(2);

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.delete = stub;
      stub.resolves({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {}
      });

      const sessionCommand: SessionFetchCommand = new SessionFetchCommand(ajax);
      const schrodinger: Schrodinger<unknown, DataSourceError> = await sessionCommand.delete().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });
  });
});
