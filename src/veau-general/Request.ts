import * as request from 'request';

type Response<T> = {
  status: number;
  body: T;
};

export class Request {

  public static send<T>(url: string, encoding: string | null = null): Promise<Response<T>> {
    const options: request.UrlOptions & request.CoreOptions = {
      url,
      encoding
    };

    return new Promise<Response<T>>((resolve: (value: Response<T>) => void, reject: (reason: any) => void): void => {
      request.get(options, (err: any, response: request.Response): void => {
        if (err) {
          reject(err);
          return;
        }

        const {
          statusCode,
          body
        } = response;

        resolve({
          status: statusCode,
          body
        });
      });
    });
  }

  private constructor() {
  }
}
