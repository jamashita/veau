import { UnimplementedError } from '../../UnimplementedError';
import { AJAXResponse } from '../AJAXResponse';
import { IAJAX } from '../interfaces/IAJAX';

export class MockAJAX implements IAJAX {

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
