import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root',
})
export class CheckOutService {
  constructor(private httpClient: HttpClient) {}

  private purchaseURL = 'http://localhost:8080/api/checkout/purchase';

  placeOrder(purchase: Purchase): Observable<any> {
    
    return this.httpClient.post<Purchase>(this.purchaseURL, purchase);
  }
}
