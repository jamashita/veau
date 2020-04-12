import request from 'superagent';
import { Resolve } from '../Type/Function';
import { JSObjectNotation } from '../Type/Value';
import { AJAXResponse } from './AJAXResponse';
import { IAJAX } from './Interface/IAJAX';

export class AJAX implements IAJAX {

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

  public post<T>(url: string, payload?: JSObjectNotation): Promise<AJAXResponse<T>> {
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

  public put<T>(url: string, payload?: JSObjectNotation): Promise<AJAXResponse<T>> {
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
