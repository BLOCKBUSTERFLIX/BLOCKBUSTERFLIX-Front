import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CRUDService {

private urlBase:string
  constructor(private http: HttpClient) {
    this.urlBase = `http://127.0.0.1:8000/api/v3/`
  }
  info(table: string): Observable<any>{
    return this.http.get<any>(`${this.urlBase}table/${table}`);
  }
  post(table: string, data: any): Observable<any>{
    return this.http.post<any>(`${this.urlBase}${table}/new`, data);
  }
  put(table: string, id:number,  data: any): Observable<any>{
    return this.http.put<any>(`${this.urlBase}${table}/update/${id}`, data);
  }
  all(table: string): Observable<any>{
    return this.http.get<any>(`${this.urlBase}${table}/`);
  }
  delete(table: string, id:number): Observable<any>{
    return this.http.delete<any>(`${this.urlBase}${table}/${id}`);
  }


}
