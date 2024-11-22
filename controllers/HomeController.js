function loadCustomerCount() {
  const customerCount = customerDatabase.length.toString().padStart(2, "0");
  $("#customer-counter").text(customerCount);
}

function loadItemCount() {
  const itemCount = itemDatabase.length.toString().padStart(2, "0");
  $("#item-counter").text(itemCount);
}

function loadOrderCount() {
  const orderCount = orderDatabase.length.toString().padStart(2, "0");
  $("#order-counter").text(orderCount);
}
