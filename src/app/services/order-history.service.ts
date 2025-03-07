import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private orderURL = `${environment.backendURL}/orders`;

  constructor(private httpClient: HttpClient) {}

  getOrderHistory(email: String) : Observable<GetOrderHistory> {
    const orderHistoryURL =
      `${this.orderURL}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;
      return this.httpClient.get<GetOrderHistory>(orderHistoryURL)
  }
}

interface GetOrderHistory{
  _embedded: {
    orders: OrderHistory[]
  }
}
