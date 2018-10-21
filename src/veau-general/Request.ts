import * as request from 'request';

export class RequestError extends Error {
  public constructor(message: string = 'REQUEST ERROR') {
    super(message);
  }
}

export class Request {
  public static send(url: string, encoding: string | null = null): Promise<request.Response> {
    const options = {
      url,
      encoding
    };

    return new Promise((resolve, reject) => {
      request.get(options, (err: any, response: request.Response, body: any) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }
}
