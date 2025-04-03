import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlBase: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) { 
    this.urlBase = `http://127.0.0.1:8000/api/v3/auth/`
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.urlBase}login`, userData);
  }

  info(): Observable<any>{
    return this.http.get<any>(`${this.urlBase}info`);
  }

  getToken():string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getUserRole(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded: any = this.jwtHelper.decodeToken(token);
    return decoded?.role_id || null;
  }

  hasRole(requiredRoles: number[]): boolean {
    const userRole = this.getUserRole();
    return userRole !== null && requiredRoles.includes(userRole);
  }

  logout(): Observable<any>{
    return this.http.post(`${this.urlBase}logout`, '');
  }
}
