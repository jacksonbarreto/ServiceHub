import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {TOKEN_KEY, TOKEN_KEY_REFRESH} from '../../constants';
import {IAuthService} from "../auth.service.interface";
import {Observable, of} from "rxjs";

interface AuthResponse {
  authenticated: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    console.log('email: ' + email + ' password: ' + password);
    return this.http.post<{
      refreshToken: string;
      token: string }>(`${this.apiUrl}/login`, {email, password})
      .pipe(tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(TOKEN_KEY_REFRESH, res.refreshToken);
      }));
  }

  logout() {


    const refreshToken = localStorage.getItem(TOKEN_KEY_REFRESH);

    return this.http.post<void>(`${this.apiUrl}/logout`, {refreshToken});
  }

  loggedIn() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token === null) {
      return of(false);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<AuthResponse>(`${this.apiUrl}/is-authenticated`, { headers }).pipe(
      map(res => {
        const authenticated = res['authenticated'];
        return res.authenticated;
      }),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
    }

  refreshToken(): Observable<{ token: string }> {
    const refreshToken = localStorage.getItem(TOKEN_KEY_REFRESH);
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh`, {refreshToken}).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
      })
    );
  }


}
