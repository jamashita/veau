export type AJAXResponse<T> = Readonly<{
  status: number;
  body: T;
}>;
