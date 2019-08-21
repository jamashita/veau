import request from 'superagent';

export type AJAXResponse<T> = {
  status: number;
  body: T;
};

export class AJAX {

  public static get<T>(url: string): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: (value: AJAXResponse<T>) => void): void => {
      request.get(url).end((err: any, res: request.Response): void => {
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

  public static post<T>(url: string, payload: any): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: (value: AJAXResponse<T>) => void): void => {
      request.post(url).send(payload).end((err: any, res: request.Response): void => {
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

  public static put<T>(url: string, payload: any): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: (value: AJAXResponse<T>) => void): void => {
      request.put(url).send(payload).end((err: any, res: request.Response): void => {
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
    return new Promise<AJAXResponse<T>>((resolve: (value: AJAXResponse<T>) => void): void => {
      request.del(url).end((err: any, res: request.Response): void => {
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
