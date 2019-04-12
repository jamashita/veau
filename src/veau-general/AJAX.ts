import * as request from 'superagent';

export type AJAXResponse<T> = {
  status: number;
  body: T;
};

export class AJAX {

  public static get<T>(url: string): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: (value: AJAXResponse<T>) => void, reject: (reason: any) => void): void => {
      request.get(url).end((err: any, res: request.Response) => {
          if (err) {
            reject(err);
            return;
          }

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

  public static post<T>(url: string, payload: any): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: (value: AJAXResponse<T>) => void, reject: (reason: any) => void): void => {
      request.post(url).send(payload).end((err: any, res: request.Response) => {
          if (err) {
            reject(err);
            return;
          }

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

  public static put(url: string, payload: any): Promise<request.Response> {
    return new Promise<request.Response>((resolve: (value: request.Response) => void, reject: (reason: any) => void): void => {
      request.put(url).send(payload).end((err: any, res: request.Response) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(res);
        });
    });
  }

  public static delete(url: string): Promise<request.Response> {
    return new Promise<request.Response>((resolve: (value: request.Response) => void, reject: (reason: any) => void): void => {
      request.del(url).end((err: any, res: request.Response) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(res);
        });
    });
  }
}
