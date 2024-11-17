export class OrderDetailDto {
    constructor(orderId, itemCode, itemName, itemPrice, itemQtyOnHand, orderedQty, totalPrice) {
        this._orderId = orderId;
        this._itemCode = itemCode;
        this._itemName = itemName;
        this._itemPrice = itemPrice;
        this._itemQtyOnHand = itemQtyOnHand;
        this._orderedQty = orderedQty;
        this._totalPrice = totalPrice;
    }
  
    get orderId() {
        return this._orderId;
    }
  
    set orderId(value) {
        if (value) {
            this._orderId = value;
        } else {
            throw new Error("Order ID is required");
        }
    }
  
    get itemCode() {
        return this._itemCode;
    }
  
    set itemCode(value) {
        if (value) {
            this._itemCode = value;
        } else {
            throw new Error("Item Code is required");
        }
    }
  
    get itemName() {
        return this._itemName;
    }
  
    set itemName(value) {
        this._itemName = value;
    }
  
    get itemPrice() {
        return this._itemPrice;
    }
  
    set itemPrice(value) {
        this._itemPrice = value;
    }
  
    get itemQtyOnHand() {
        return this._itemQtyOnHand;
    }
  
    set itemQtyOnHand(value) {
        this._itemQtyOnHand = value;
    }
  
    get orderedQty() {
        return this._orderedQty;
    }
  
    set orderedQty(value) {
        if (value > 0) {
            this._orderedQty = value;
        } else {
            throw new Error("Ordered Quantity must be greater than zero");
        }
    }
  
    get totalPrice() {
        return this._totalPrice;
    }
  
    set totalPrice(value) {
        this._totalPrice = value;
    }
  
   
    isValid() {
        let isValid = true;
        if (!this.orderId) {
            console.error("Order ID is required");
            isValid = false;
        }
        if (!this.itemCode) {
            console.error("Item Code is required");
            isValid = false;
        }
        if (this.orderedQty <= 0) {
            console.error("Ordered Quantity must be greater than zero");
            isValid = false;
        }
        return isValid;
    }
  }
  