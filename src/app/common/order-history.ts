export class OrderHistory {
  constructor(
    public id: string,
    public orderTrackingNumber: number,
    public totalQuantity: number,
    public totalPrice: number,
    public dateCreated: Date
  ) {}
}
