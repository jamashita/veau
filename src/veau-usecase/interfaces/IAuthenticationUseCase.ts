export interface IAuthenticationUseCase {

  review(account: string, password: string, callback: (error: any, account?: any) => void): Promise<void>;
}
