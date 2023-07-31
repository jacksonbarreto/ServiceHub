import {Observable} from "rxjs";

export interface IAuthService {
  login(username: string, password: string): Observable<{token: string}>;
  logout(): void;
  loggedIn: boolean;
}
