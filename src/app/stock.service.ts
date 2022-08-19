import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Stock } from './models/stock.model';
import { StockValue } from './models/stockValue.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  readonly BaseURI = 'https://localhost:7128/api/Stock/';

  constructor(private http: HttpClient, private router: Router) {}

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.BaseURI);
  }

  getStockValues(id: number): Observable<StockValue[]> {
    return this.http.get<StockValue[]>(this.BaseURI + id);
  }
}
