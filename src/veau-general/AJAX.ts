import * as request from 'superagent';

export class AJAX {

  public static get(url: string): Promise<request.Response> {
    return new Promise<request.Response>((resolve: (value: request.Response) => void, reject: (reason: any) => void): void => {
      request.get(url).end((err: any, res: request.Response) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(res);
        });
    });
  }

  public static post(url: string, payload: any): Promise<request.Response> {
    return new Promise<request.Response>((resolve: (value: request.Response) => void, reject: (reason: any) => void): void => {
      request.post(url).send(payload).end((err: any, res: request.Response) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(res);
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
