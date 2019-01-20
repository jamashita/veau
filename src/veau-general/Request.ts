import * as request from 'request';

export class Request {

  public static send(url: string, encoding: string | null = null): Promise<request.Response> {
    const options: request.UrlOptions & request.CoreOptions = {
      url,
      encoding
    };

    return new Promise<request.Response>((resolve: (value: request.Response) => void, reject: (reason: any) => void): void => {
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
