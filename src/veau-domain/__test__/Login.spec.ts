import 'jest';
import {Login} from '../Login';

describe('Login', () => {
  it('name is empty, then user is not able to login', () => {
    const login = new Login('', 'password');

    expect(login.isAcceptable()).toEqual(false);
  });

  it('password is empty, then user is not able to login', () => {
    const login = new Login('name', '');

    expect(login.isAcceptable()).toEqual(false);
  });

  it('name and password are filled then user is able to attempt login', () => {
    const login = new Login('name', 'password');

    expect(login.isAcceptable()).toEqual(true);
  });

  it('equals', () => {
    const login1 = new Login('name1', 'password1');
    const login2 = new Login('name1', 'password2');

    expect(login1.equals(login2)).toEqual(false);

    const login3 = new Login('name2', 'password1');

    expect(login1.equals(login3)).toEqual(false);

    const login4 = new Login('name1', 'password1');

    expect(login1.equals(login4)).toEqual(true);
  });
});
