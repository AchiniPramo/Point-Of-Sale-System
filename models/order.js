function Order(
  orderId,
  date,
  customerId,
  discount,
  cash,
  balance,
  orderDetails
) {
  this.orderId = orderId;
  this.date = date;
  this.customerId = customerId;
  this.discount = discount;
  this.cash = cash;
  this.balance = balance;
  this.orderDetails = orderDetails;
}
