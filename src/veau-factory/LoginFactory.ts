import {Login} from '../veau-domain/Login';

export class LoginFactory {

  public static from(name: string, password: string): Login {
    return new Login(name, password);
  }

  public static fromName(login: Login, name: string): Login {
    return LoginFactory.from(name, login.getPassword());
  }

  public static fromPassword(login: Login, password: string): Login {
    return LoginFactory.from(login.getName(), password);
  }
}
