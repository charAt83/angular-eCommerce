import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  addToCart(cartItem: CartItem) {
    //Check if we already have item in cart.

    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find((item) => item.id === cartItem.id);
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart && existingCartItem) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotal();
  }
  computeCartTotal() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let cartItem of this.cartItems) {
      totalPriceValue += cartItem.quantity * cartItem.unitPrice;
      totalQuantityValue += cartItem.quantity;
    }

    //Publish the new values. All subscribers will receive the new data

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  removeItem(item: CartItem) {
    item.quantity--;
    if (item.quantity == 0) {
      this.remove(item);
    } else {
      this.computeCartTotal();
    }
  }
  remove(item: CartItem) {
    const index = this.cartItems.findIndex(
      (itemsInCart) => item.id === itemsInCart.id
    );
    if (index > -1) {
      this.cartItems.splice(index, 1);

      this.computeCartTotal();
    }
  }
}

/*
1. What this method does is, it has method addToCart(item). This is called from productListComponent addToCart method, when user clicks the addToCart button.
2. Inside the addToCart method, we are checking if the item already exists in the cart. 
3. If exists, then we are gonna increment the quantity of the particular item in the cart. Else, we will push the new item to cart
4. After that, we are computing the totals for the cart item to publish to productListComponent.
5. Compute the totalCostValue and totalQuantity value for each item inside the cart and by using next method, we are publishing to 
    different events (totalPriceValue and totalQuantityValue).
*/
