export class ItemDto {
    constructor(code = null, name = '', qty = 0, unitPrice = 0) {
      if (this.isValidated(code, name, qty, unitPrice)) {
        this._code = code;
        this._name = name;
        this._qty = qty;
        this._unitPrice = unitPrice;
      }
    }
  
    isValidated(code, name, qty, unitPrice) {
      let isValid = true;
  
      if (this.checkCodePattern(code) === false) {
        $('#itemCode-error').text("Item Code is a required field and should be in the format 'I00-001'");
        isValid = false;
      } else {
        $('#itemCode-error').text("");
      }
  
      if (name === null || name === '') {
        $('#itemName-error').text("Please enter the Item Name");
        isValid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        $('#itemName-error').text("Please enter a valid Item Name");
        isValid = false;
      } else {
        $('#itemName-error').text("");
      }
  
      if (qty === null || qty === '' || isNaN(qty) || qty <= 0) {
        $('#itemQty-error').text("Please enter a valid Quantity");
        isValid = false;
      } else {
        $('#itemQty-error').text("");
      }
  
      if (unitPrice === null || unitPrice === '' || isNaN(unitPrice) || unitPrice <= 0) {
        $('#unitPrice-error').text("Please enter a valid Unit Price");
        isValid = false;
      } else {
        $('#itemUnitPrice-error').text("");
      }
  
      return isValid;
    }
  
    checkCodePattern(code) {
      let codePattern = /^I\d{2}-\d{3}$/;
      return codePattern.test(code);
    }
  
    get code() {
      return this._code;
    }
  
    get name() {
      return this._name;
    }
  
    get qty() {
      return this._qty;
    }
  
    get unitPrice() {
      return this._unitPrice;
    }
  
    set code(value) {
      this._code = value;
    }
  
    set name(value) {
      this._name = value;
    }
  
    set qty(value) {
      this._qty = value;
    }
  
    set unitPrice(value) {
      this._unitPrice = value;
    }
  
    toString() {
      return `Item { code: ${this._code}, name: ${this._name}, qty: ${this._qty}, unitPrice: ${this._unitPrice} }`;
    }
  }