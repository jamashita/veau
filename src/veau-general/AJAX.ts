import request from 'superagent';
import { Resolve } from './Type/Resolve';

export type AJAXResponse<T> = {
  status: number;
  body: T;
};

export class AJAX {

  public static get<T>(url: string): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>): void => {
      request.get(url).end((err: unknown, res: request.Response): void => {
        const {
          status,
          body
        }: request.Response = res;

        resolve({
          status,
          body
        });
      });
    });
  }

  public static post<T>(url: string, payload: string | object | undefined): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>): void => {
      request.post(url).send(payload).end((err: unknown, res: request.Response): void => {
        const {
          status,
          body
        }: request.Response = res;

        resolve({
          status,
          body
        });
      });
    });
  }

  public static put<T>(url: string, payload: string | object | undefined): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>): void => {
      request.put(url).send(payload).end((err: unknown, res: request.Response): void => {
        const {
          status,
          body
        }: request.Response = res;

        resolve({
          status,
          body
        });
      });
    });
  }

  public static delete<T>(url: string): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>): void => {
      request.del(url).end((err: unknown, res: request.Response): void => {
        const {
          status,
          body
        }: request.Response = res;

        resolve({
          status,
          body
        });
      });
    });
  }

  private constructor() {
  }
}
