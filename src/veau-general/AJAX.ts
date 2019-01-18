import * as request from 'superagent';

export class AJAX {

  public static get(url: string): Promise<request.Response> {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err: any, res: request.Response) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(res);
        });
    });
  }

  public static post(url: string, payload: any): Promise<request.Response> {
    return new Promise((resolve, reject) => {
      request
        .post(url)
        .send(payload)
        .end((err: any, res: request.Response) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(res);
        });
    });
  }

  public static put(url: string, payload: any): Promise<request.Response> {
    return new Promise((resolve, reject) => {
      request
        .put(url)
        .send(payload)
        .end((err: any, res: request.Response) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(res);
        });
    });
  }

  public static delete(url: string): Promise<request.Response> {
    return new Promise((resolve, reject) => {
      request
        .del(url)
        .end((err: any, res: request.Response) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(res);
        });
    });
  }
}
