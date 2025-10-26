import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private baseUrl: string = 'http://localhost:5271/api/User';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getCashiers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/Cashier`);
  }
  getCaptains(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/Captain`);
  }
  getWaiters(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/Waiter`);
  }
}
