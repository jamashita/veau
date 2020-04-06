import { UnimplementedError } from '../UnimplementedError';
import { AJAX } from './AJAX';
import { AJAXResponse } from './AJAXResponse';

export class MockAJAX<T> extends AJAX {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public get<T>(url: string): Promise<AJAXResponse<T>> {
    return Promise.reject<AJAXResponse<T>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public post<T>(url: string, payload?: object): Promise<AJAXResponse<T>> {
    return Promise.reject<AJAXResponse<T>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public put<T>(url: string, payload?: object): Promise<AJAXResponse<T>> {
    return Promise.reject<AJAXResponse<T>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public delete<T>(url: string): Promise<AJAXResponse<T>> {
    return Promise.reject<AJAXResponse<T>>(new UnimplementedError());
  }
}
