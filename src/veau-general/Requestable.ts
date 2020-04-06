export type AJAXResponse<T> = {
  status: number;
  body: T;
};

export interface Requestable {

  get<T>(url: string): Promise<AJAXResponse<T>>;

  post<T>(url: string, payload?: object): Promise<AJAXResponse<T>>;

  put<T>(url: string, payload?: object): Promise<AJAXResponse<T>>;

  delete<T>(url: string): Promise<AJAXResponse<T>>;
}
