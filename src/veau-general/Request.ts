import request from 'request';
import { Reject } from './Type/Reject';
import { Resolve } from './Type/Resolve';

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

    return new Promise<Response<T>>((resolve: Resolve<Response<T>>, reject: Reject<unknown>): void => {
      request.get(options, (err: unknown, response: request.Response): void => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (err) {
          reject(err);
          return;
        }

        const {
          statusCode,
          body
        }: request.Response = response;

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
