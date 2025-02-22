import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Country } from '../../common/country';
import { CustomValidators } from '../../common/custom-validators';
import { State } from '../../common/state';
import { CartService } from '../../services/cart.service';
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
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.checkOutFromGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          CustomValidators.notOnlyWhitespace
        ]),
      }),

      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),

      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),

      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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

    this.cartService.computeCartTotal();
  }

  onSubmit() {

    if(this.checkOutFromGroup.invalid){
      this.checkOutFromGroup.markAllAsTouched()
    }
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
}
