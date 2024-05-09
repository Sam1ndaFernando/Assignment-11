export class ItemModel{
    constructor(item_code, description, unit_price, qty) {
        this.itemId = item_code;
        this.description = description;
        this.unitPrice = unit_price;
        this.qty = qty;
    }
}