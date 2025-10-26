import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  // private apiUrl = `https://localhost:7066/api/Item`;
  private apiUrl = `http://localhost:5271/api/Item`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  getById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  getByName(name: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${name}`);
  }
}
