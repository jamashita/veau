import 'jest';
import { Login } from '../Login';

describe('Login', () => {
  it('account is empty, then user is not able to login', () => {
    const login: Login = Login.of('', 'password');

    expect(login.isAcceptable()).toEqual(false);
  });

  it('password is empty, then user is not able to login', () => {
    const login: Login = Login.of('name', '');

    expect(login.isAcceptable()).toEqual(false);
  });

  it('account and password are filled then user is able to attempt login', () => {
    const login: Login = Login.of('name', 'password');

    expect(login.isAcceptable()).toEqual(true);
  });

  it('equals', () => {
    const login1: Login = Login.of('account1', 'password1');
    const login2: Login = Login.of('account1', 'password2');
    const login3: Login = Login.of('account2', 'password1');
    const login4: Login = Login.of('account1', 'password1');

    expect(login1.equals(login1)).toEqual(true);
    expect(login1.equals(login2)).toEqual(false);
    expect(login1.equals(login3)).toEqual(false);
    expect(login1.equals(login4)).toEqual(true);
  });
});
