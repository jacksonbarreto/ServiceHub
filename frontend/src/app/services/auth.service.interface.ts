import {Observable} from "rxjs";

export interface IAuthService {
  login(username: string, password: string): Observable<{token: string}>;
  logout(): Observable<void>;
  loggedIn(): Observable<boolean>;

  refreshToken(): Observable<{token: string}>;
}
