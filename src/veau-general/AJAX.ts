import request from 'superagent';
import { Resolve } from './Type/Resolve';

export type AJAXResponse<T> = {
  status: number;
  body: T;
};

export class AJAX {

  public static get<T>(url: string): Promise<AJAXResponse<T>> {
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

  public static post<T>(url: string, payload: string | object | undefined): Promise<AJAXResponse<T>> {
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

  public static put<T>(url: string, payload: string | object | undefined): Promise<AJAXResponse<T>> {
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

  public static delete<T>(url: string): Promise<AJAXResponse<T>> {
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

  private constructor() {
  }
}
