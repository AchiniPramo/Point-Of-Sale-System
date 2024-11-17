import { OrderDetailDto } from "./OrderDetailDto.js";
export class OrderDto {
  constructor(orderId, orderDate, customerId, customerName, customerAddress, customerSalary, totalAmount, subtotalAmount, discount, paidAmount, balance, orderDetails = []) {
      this._orderId = orderId;
      this._orderDate = orderDate;
      this._customerId = customerId;
      this._customerName = customerName;
      this._customerAddress = customerAddress;
      this._customerSalary = customerSalary;
      this._totalAmount = totalAmount;
      this._subtotalAmount = subtotalAmount;
      this._discount = discount;
      this._paidAmount = paidAmount;
      this._balance = balance;
      this._orderDetails = orderDetails;
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

  get orderDate() {
      return this._orderDate;
  }

  set orderDate(value) {
      this._orderDate = value;
  }

  get customerId() {
      return this._customerId;
  }

  set customerId(value) {
      if (value) {
          this._customerId = value;
      } else {
          throw new Error("Customer ID is required");
      }
  }

  get customerName() {
      return this._customerName;
  }

  set customerName(value) {
      this._customerName = value;
  }

  get customerAddress() {
      return this._customerAddress;
  }

  set customerAddress(value) {
      this._customerAddress = value;
  }

  get customerSalary() {
      return this._customerSalary;
  }

  set customerSalary(value) {
      this._customerSalary = value;
  }

  get totalAmount() {
      return this._totalAmount;
  }

  set totalAmount(value) {
      this._totalAmount = value;
  }

  get subtotalAmount() {
      return this._subtotalAmount;
  }

  set subtotalAmount(value) {
      this._subtotalAmount = value;
  }

  get discount() {
      return this._discount;
  }

  set discount(value) {
      this._discount = value;
  }

  get paidAmount() {
      return this._paidAmount;
  }

  set paidAmount(value) {
      this._paidAmount = value;
  }

  get balance() {
      return this._balance;
  }

  set balance(value) {
      this._balance = value;
  }

  get orderDetails() {
      return this._orderDetails;
  }

  set orderDetails(value) {
      if (Array.isArray(value)) {
          this._orderDetails = value;
      } else {
          throw new Error("Order details should be an array");
      }
  }

  addOrderDetail(orderDetail) {
      if (orderDetail instanceof OrderDetailDto) {
          this._orderDetails.push(orderDetail);
      } else {
          throw new Error("Invalid order detail");
      }
  }

  isValid() {
      let isValid = true;
      if (!this.orderId) {
          console.error("Order ID is required");
          isValid = false;
      }
      if (!this.customerId) {
          console.error("Customer ID is required");
          isValid = false;
      }
      if (!Array.isArray(this.orderDetails) || this.orderDetails.length === 0) {
          console.error("Order details are required");
          isValid = false;
      }
      return isValid;
  }
}
