import { AJAXResponse } from './AJAXResponse';

export interface AJAXRequestable {

  get<T>(url: string): Promise<AJAXResponse<T>>;

  post<T>(url: string, payload?: object): Promise<AJAXResponse<T>>;

  put<T>(url: string, payload?: object): Promise<AJAXResponse<T>>;

  delete<T>(url: string): Promise<AJAXResponse<T>>;
}
