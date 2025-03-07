import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaymentInfo } from '../common/payment-info';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root',
})
export class CheckOutService {
  constructor(private httpClient: HttpClient) {}

  private purchaseURL = `${environment.backendURL}/checkout/purchase`;

  private paymentIntentURL = `${environment.backendURL}/checkout/payment-intent`;

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseURL, purchase);
  }

  getPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(
      this.paymentIntentURL,
      paymentInfo
    );
  }
}
