import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule, NgbModule, RouterModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent {
  orders: OrderHistory[] = [];
  storage: Storage | null = null;
  userEmail: string = '';

  constructor(
    private orderHistoryService: OrderHistoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = sessionStorage;
      this.userEmail = JSON.parse(sessionStorage.getItem('userEmail')!);
    }
    this.orderHistory();
  }

  orderHistory() {
    this.orderHistoryService
      .getOrderHistory(this.userEmail)
      .subscribe((data) => {
        this.orders = data._embedded.orders;
      });
  }
}
