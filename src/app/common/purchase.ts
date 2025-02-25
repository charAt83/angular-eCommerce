import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {

    customer: Customer;
    billingAddress: Address
    shippingAddress: Address
    order: Order
    orderItems: OrderItem[] = []

    constructor(){
        this.customer = new Customer()
        this.billingAddress = new Address()
        this.shippingAddress = new Address()
        this.order = new Order()
    }

    

}
