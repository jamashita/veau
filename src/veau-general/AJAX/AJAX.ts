import request from 'superagent';
import { Resolve } from '../Type/Resolve';
import { AJAXRequestable } from './AJAXRequestable';
import { AJAXResponse } from './AJAXResponse';

export class AJAX implements AJAXRequestable {

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
