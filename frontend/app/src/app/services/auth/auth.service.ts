import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { TOKEN_KEY } from '../../constants';
import {IAuthService} from "../auth.service.interface";
@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService{
  private apiUrl = 'https://your-api-url.com';

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, {username, password})
      .pipe(tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
      }));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }

  public get loggedIn(): boolean {
    return localStorage.getItem(TOKEN_KEY) !==  null;
  }
}
