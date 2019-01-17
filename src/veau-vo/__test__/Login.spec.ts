import 'jest';
import {Login} from '../Login';

describe('Login', () => {
  it('name is empty, then user is not able to login', () => {
    const login: Login = new Login('', 'password');

    expect(login.isAcceptable()).toEqual(false);
  });

  it('password is empty, then user is not able to login', () => {
    const login: Login = new Login('name', '');

    expect(login.isAcceptable()).toEqual(false);
  });

  it('name and password are filled then user is able to attempt login', () => {
    const login: Login = new Login('name', 'password');

    expect(login.isAcceptable()).toEqual(true);
  });

  it('equals', () => {
    const login1: Login = new Login('name1', 'password1');
    const login2: Login = new Login('name1', 'password2');
    const login3: Login = new Login('name2', 'password1');
    const login4: Login = new Login('name1', 'password1');

    expect(login1.equals(login1)).toEqual(true);
    expect(login1.equals(login2)).toEqual(false);
    expect(login1.equals(login3)).toEqual(false);
    expect(login1.equals(login4)).toEqual(true);
  });
});
