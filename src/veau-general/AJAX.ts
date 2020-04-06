import { injectable } from 'inversify';
import request from 'superagent';
import { AJAXResponse, Requestable } from './Requestable';
import { Resolve } from './Type/Resolve';

@injectable()
export class AJAX implements Requestable {

  public get<T>(url: string): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>) => {
      request.get(url).end((err: unknown, res: request.Response) => {
        const {
          status,
          body
        } = res;

        resolve({
          status,
          body
        });
      });
    });
  }

  public post<T>(url: string, payload?: object): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>) => {
      request.post(url).send(payload).end((err: unknown, res: request.Response) => {
        const {
          status,
          body
        } = res;

        resolve({
          status,
          body
        });
      });
    });
  }

  public put<T>(url: string, payload?: object): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>) => {
      request.put(url).send(payload).end((err: unknown, res: request.Response) => {
        const {
          status,
          body
        } = res;

        resolve({
          status,
          body
        });
      });
    });
  }

  public delete<T>(url: string): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>) => {
      request.del(url).end((err: unknown, res: request.Response) => {
        const {
          status,
          body
        } = res;

        resolve({
          status,
          body
        });
      });
    });
  }
}
