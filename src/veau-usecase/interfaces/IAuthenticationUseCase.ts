export interface IAuthenticationUseCase {

  review(account: string, password: string, done: (error: any, account?: any) => void): Promise<void>;
}
