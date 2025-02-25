import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from '../../common/country';
import { CustomValidators } from '../../common/custom-validators';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { State } from '../../common/state';
import { CartService } from '../../services/cart.service';
import { CheckOutService } from '../../services/check-out.service';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  checkOutFromGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private formService: FormService,
    private checkOutService: CheckOutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkOutFromGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          CustomValidators.notOnlyWhitespace,
        ]),
      }),

      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),

        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),

        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),

        state: new FormControl('', [Validators.required]),

        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
      }),

      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),

        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),

        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),

        state: new FormControl('', [Validators.required]),

        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;

    this.formService.getCreditCardMonths().subscribe((data) => {
      this.creditCardMonths = data;
    });

    this.formService.getCreditCardYears().subscribe((data) => {
      this.creditCardYears = data;
    });

    this.getCartTotals();

    this.formService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  getCartTotals() {
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });

    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    //NOTE: ----------------------------------------------------------------------------------------------------------------------

    // You dont need to call computeCartTotal() again if we are using BehaviourSubject for subscribing to totalValue and totalQuantity.
    // this.cartService.computeCartTotal()
  }

  onSubmit() {
    if (this.checkOutFromGroup.invalid) {
      this.checkOutFromGroup.markAllAsTouched();
      return;
    }

    //Set up order

    let order = new Order();

    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //Get cart items
    const cartItems = this.cartService.cartItems;
    //create orderItems with cartItems

    let orderItems: OrderItem[] = cartItems.map((item) => new OrderItem(item));

    //Set up purchase

    let purchase = new Purchase();

    //populate purchase - Customer

    purchase.customer = this.checkOutFromGroup.controls['customer'].value;

    //Populate purchase - Shipping Address

    purchase.shippingAddress =
      this.checkOutFromGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );

    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //Populate purchase - Billing Address

    purchase.billingAddress =
      this.checkOutFromGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );

    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //Populate purchase - Order and Order Items.

    purchase.order = order;
    purchase.orderItems = orderItems;

    //Call rest api via checkout service

    this.checkOutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`
        );

        //reset cart.

        this.resetCart();
      },
      error: (err) => {
        alert(`There was an error: ${err.message}`);
      },
    });
  }


  resetCart() {

    //Reset Cart data

    this.cartService.cartItems = []
    this.cartService.totalPrice.next(0)
    this.cartService.totalQuantity.next(0)

    this.checkOutFromGroup.reset();

    this.router.navigateByUrl("/product")

    //Reset form data

    //Navigate back to main products page

  }

  copyShippingAddressToBilling(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.checkOutFromGroup
        .get('billingAddress')
        ?.setValue(this.checkOutFromGroup.get('shippingAddress')?.value);

      //bug fix for billing address as check box is clicked, states are not appearing in billing address. This will resolve it.
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkOutFromGroup.get('billingAddress')?.reset();
      this.billingAddressStates = [];
    }
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkOutFromGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.formService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        console.log('Inside the form group shipping address');

        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      // This is to display the first state value automatically on the form.
      // formGroup?.get('state')?.setValue(data[0]);
    });
  }

  get firstName() {
    return this.checkOutFromGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkOutFromGroup.get('customer.lastName');
  }

  get email() {
    return this.checkOutFromGroup.get('customer.email');
  }

  get shippingAddressCity() {
    return this.checkOutFromGroup.get('shippingAddress.city');
  }
  get shippingAddressStreet() {
    return this.checkOutFromGroup.get('shippingAddress.street');
  }
  get shippingAddressZipCode() {
    return this.checkOutFromGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressCountry() {
    return this.checkOutFromGroup.get('shippingAddress.country');
  }
  get shippingAddressState() {
    return this.checkOutFromGroup.get('shippingAddress.state');
  }

  get billingAddressCity() {
    return this.checkOutFromGroup.get('billingAddress.city');
  }
  get billingAddressStreet() {
    return this.checkOutFromGroup.get('billingAddress.street');
  }
  get billingAddressZipCode() {
    return this.checkOutFromGroup.get('billingAddress.zipCode');
  }
  get billingAddressCountry() {
    return this.checkOutFromGroup.get('billingAddress.country');
  }
  get billingAddressState() {
    return this.checkOutFromGroup.get('billingAddress.state');
  }

  get creditCardType() {
    return this.checkOutFromGroup.get('creditCard.cardType');
  }

  get nameOnCard() {
    return this.checkOutFromGroup.get('creditCard.nameOnCard');
  }

  get cardNumber() {
    return this.checkOutFromGroup.get('creditCard.cardNumber');
  }

  get securityCode() {
    return this.checkOutFromGroup.get('creditCard.securityCode');
  }
}
