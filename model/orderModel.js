export class OrderModel{
    constructor(orderId, date, discount, subTotal, customerId) {
        this.orderId = orderId;
        this.date = date;
        this.discount = discount;
        this.total = subTotal;
        this.customerId = customerId;
    }
}