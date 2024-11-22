//========================================================================================
/*                                 Startup Initialization                               */
//========================================================================================

initializeNextOrderId();
initializeCurrentDate();
initializeOrderComboBoxes();

//========================================================================================
/*                               Validations & Form Control                             */
//========================================================================================

// Event delegation setup
$("#order-detail-tbody").on("click", ".btn-danger", function () {
  $(this).closest("tr").remove(); // Only removes the tr containing the clicked button
  initializeTotalAndSubtotal();
});

$('#tab-content-3 input[type="date"], #tab-content-3 input[pattern]').on(
  "input change",
  realTimeValidate
);

$("#txt-order-qty").on("input", validateOrderQuantity);

$("#txt-order-discount").on("input", function () {
  initializeTotalAndSubtotal();
});

$("#txt-order-cash").on("input", validateOrderCash);

//========================================================================================
/*                                 Other Functions                                      */
//========================================================================================

function initializeNextOrderId() {
  const prevCode =
    orderDatabase.length > 0
      ? orderDatabase[orderDatabase.length - 1].orderId
      : "O000";
  const nextCode = generateNextID(prevCode);
  $("#txt-order-id").val(nextCode);
  $("#txt-order-id").removeClass("is-invalid").addClass("is-valid");
}

function initializeCurrentDate() {
  const currentDate = new Date().toISOString().split("T")[0];
  $("#txt-order-date").val(currentDate);
  $("#txt-order-date").removeClass("is-invalid").addClass("is-valid");
}

function initializeOrderComboBoxes() {
  // Clear existing options first (keeping the first empty/default option if exists)
  $("#select-customer-id").find("option:not(:first)").remove();
  $("#select-item-code").find("option:not(:first)").remove();

  customerDatabase.forEach((c) => {
    $("#select-customer-id").append(`<option value="${c.id}">${c.id}</option>`);
  });

  itemDatabase.forEach((i) => {
    $("#select-item-code").append(
      `<option value="${i.code}">${i.code}</option>`
    );
  });
}

function initializeTotalAndSubtotal() {
  // 1. Get all rows and convert to array
  const rows = $("#order-detail-tbody tr").toArray();

  // 2. Use reduce to sum up the totals
  const total = rows.reduce((acc, row) => {
    const cellValue = $(row).find("td:eq(4)").text();
    return acc + parseFloat(cellValue);
  }, 0);

  // 3. Set the total to an input field, formatted to 2 decimal places
  $("#lbl-total").text("Total: " + parseFloat(total).toFixed(2) + "Rs/=");

  // 4. Update subtotal
  if ($("#txt-order-discount").hasClass("is-valid")) {
    const discount = (parseFloat($("#txt-order-discount").val()) / 100) * total;
    const subtotal = total - discount;
    $("#lbl-subtotal").text(
      "SubTotal: " + parseFloat(subtotal).toFixed(2) + "Rs/="
    );
  } else {
    $("#lbl-subtotal").text(
      "SubTotal: " + parseFloat(total).toFixed(2) + "Rs/="
    );
  }

  // 5. Update the balance
  if ($("#txt-order-cash").hasClass("is-valid")) {
    const cash = parseFloat($("#txt-order-cash").val());
    const subTotal = parseFloat($("#lbl-subtotal").text().split(" ")[1]);

    if (cash >= subTotal) {
      const balance = cash - subTotal;
      $("#txt-order-balance").val(parseFloat(balance).toFixed(2));

      $("#txt-order-cash").removeClass("is-invalid").addClass("is-valid");
      $("#txt-order-balance").removeClass("is-invalid").addClass("is-valid");
      $("#txt-order-cash").next().hide();
    } else {
      $("#txt-order-cash").removeClass("is-valid").addClass("is-invalid");
      $("#txt-order-cash").next().text("Insufficient cash !").show();
      $("#txt-order-balance").val("");
    }
  }
}

function getOrderById(id) {
  return orderDatabase.find((o) => o.orderId === id);
}

function appendToOrderTable(orderDetail) {
  const item = getItemByCode(orderDetail.itemCode);
  const existingRow = $(
    `#order-detail-tbody tr td:first-child:contains('${orderDetail.itemCode}')`
  ).closest("tr");

  if (existingRow.length > 0) {
    const currentQty = parseInt(existingRow.find("td:eq(3)").text());
    const newQty = currentQty + parseInt(orderDetail.qty);

    if (newQty > item.qty) {
      showToast("error", "Quantity exceeds available stock !");
    } else {
      // Update existing row
      const newTotal = parseFloat(item.price * newQty).toFixed(2);

      existingRow.find("td:eq(3)").text(newQty);
      existingRow.find("td:eq(4)").text(newTotal);

      $("#item-select input, #item-select select")
        .removeClass("is-valid")
        .val("");
    }
  } else {
    // Add new row
    $("#order-detail-tbody").append(`
            <tr class="text-center">
                <td>${orderDetail.itemCode}</td>
                <td>${item.name}</td>
                <td>${parseFloat(item.price).toFixed(2)}</td>
                <td>${orderDetail.qty}</td>
                <td>${parseFloat(item.price * orderDetail.qty).toFixed(2)}</td>
                <td><button class="btn btn-danger py-0 btn-sm">Remove</button></td>
            </tr>
        `);
    $("#item-select input, #item-select select")
      .removeClass("is-valid")
      .val("");
  }
}

function validateOrderQuantity() {
  const input = $(this);
  const qty = parseInt(input.val());
  const pattern = new RegExp(input.attr("pattern"));
  const itemCode = $("#txt-item-code").val();
  const item = getItemByCode(itemCode);

  // First check pattern validation
  if (!pattern.test(input.val())) {
    input.removeClass("is-valid").addClass("is-invalid");
    input.next().text("Enter a valid Quantity").show();
    return;
  }

  // Then check quantity validation if item exists
  if (item) {
    if (qty > 0 && qty <= item.qty) {
      input.removeClass("is-invalid").addClass("is-valid");
      input.next().hide();
    } else if (qty > item.qty) {
      input.removeClass("is-valid").addClass("is-invalid");
      input.next().text("Quantity exceeds available stock").show();
    }
  } else {
    // If no item is selected yet
    if (qty > 0) {
      input.removeClass("is-invalid").addClass("is-valid");
      input.next().hide();
    } else {
      input.removeClass("is-valid").addClass("is-invalid");
      input.next().text("Enter a valid Quantity").show();
    }
  }
}

function validateOrderCash() {
  const input = $(this);
  const cash = parseFloat($(this).val());
  const subTotal = parseFloat($("#lbl-subtotal").text().split(" ")[1]); // Extract the total amount from the label
  const pattern = new RegExp(input.attr("pattern"));

  if (!pattern.test(input.val())) {
    input.removeClass("is-valid").addClass("is-invalid");
    input.next().text("Enter a valid Price").show();
    return;
  }

  if (cash >= subTotal) {
    // Update the balance
    const balance = cash - subTotal;
    $("#txt-order-balance").val(parseFloat(balance).toFixed(2));

    input.removeClass("is-invalid").addClass("is-valid");
    $("#txt-order-balance").removeClass("is-invalid").addClass("is-valid");
    input.next().hide();
  } else {
    input.removeClass("is-valid").addClass("is-invalid");
    input.next().text("Insufficient cash !").show();
    $("#txt-order-balance").val("");
  }
}

function clearForm() {
  resetForm("#search-order", "#search-order input");
  resetForm(
    "#invoice-details",
    "#invoice-details input, #invoice-details select"
  );
  resetForm("#item-select", "#item-select input, #item-select select");
  resetForm("#order-payment", "#order-payment input");
  $("#order-detail-tbody").empty();
  initializeTotalAndSubtotal();
  initializeNextOrderId();
  initializeCurrentDate();
}

//========================================================================================
/*                                CRUD Operations                                       */
//========================================================================================

// Save Order
$("#order-purchase-btn").on("click", function () {
  let isValidated = $(
    "#txt-order-id, #txt-order-date, #txt-customer-id, #txt-order-discount, #txt-order-cash, #txt-order-balance"
  )
    .toArray()
    .every((element) => $(element).hasClass("is-valid"));

  if (isValidated) {
    const orderId = $("#txt-order-id").val();
    const date = $("#txt-order-date").val();
    const customerId = $("#txt-customer-id").val();
    const discount = parseFloat($("#txt-order-discount").val());
    const cash = parseFloat($("#txt-order-cash").val());
    const balance = parseFloat($("#txt-order-balance").val());

    const orderDetails = $("#order-detail-tbody tr")
      .toArray()
      .map((row) => {
        const cells = $(row).find("td");
        return new OrderDetail(
          cells.eq(0).text(),
          parseInt(cells.eq(3).text())
        );
      });

    const order = new Order(
      orderId,
      date,
      customerId,
      discount,
      cash,
      balance,
      orderDetails
    );

    if (orderDetails.length > 0) {
      if (!orderDatabase.some((o) => o.orderId === orderId)) {
        orderDatabase.push(order);

        for (const detail of orderDetails) {
          const item = getItemByCode(detail.itemCode);
          item.qty -= detail.qty;
          itemDatabase[itemDatabase.findIndex((i) => i.code === item.code)] =
            item;
        }

        showToast("success", "Order saved successfully !");
        clearForm();
        loadAllItems();
        loadOrderCount();
      } else {
        showToast("error", "Order already exists !");
      }
    }
  }
});

// Update Order
$("#update-order-btn").on("click", function () {
  const orderId = $("#txt-order-id").val();
  const order = getOrderById(orderId);

  let isValidated = $(
    "#txt-order-id, #txt-order-date, #txt-customer-id, #txt-order-discount, #txt-order-cash, #txt-order-balance"
  )
    .toArray()
    .every((element) => $(element).hasClass("is-valid"));

  if (isValidated) {
    const date = $("#txt-order-date").val();
    const customerId = $("#txt-customer-id").val();
    const discount = parseFloat($("#txt-order-discount").val());
    const cash = parseFloat($("#txt-order-cash").val());
    const balance = parseFloat($("#txt-order-balance").val());

    if (order) {
      const orderDetails = $("#order-detail-tbody tr")
        .toArray()
        .map((row) => {
          const cells = $(row).find("td");
          return new OrderDetail(
            cells.eq(0).text(),
            parseInt(cells.eq(3).text())
          );
        });

      for (const detail of order.orderDetails) {
        const item = getItemByCode(detail.itemCode);
        item.qty += detail.qty;
        itemDatabase[itemDatabase.findIndex((i) => i.code === item.code)] =
          item;
      }

      if (orderDetails.length > 0) {
        order.date = date;
        order.customerId = customerId;
        order.discount = discount;
        order.cash = cash;
        order.balance = balance;
        order.orderDetails = orderDetails;

        for (const detail of orderDetails) {
          const item = getItemByCode(detail.itemCode);
          item.qty -= detail.qty;
          itemDatabase[itemDatabase.findIndex((i) => i.code === item.code)] =
            item;
        }

        orderDatabase[orderDatabase.findIndex((o) => o.orderId === orderId)] =
          order;

        showToast("success", "Order updated successfully !");
        clearForm();
        loadAllItems();
      }
    } else {
      showToast("error", "Order not found !");
    }
  }
});

// Delete Order
$("#delete-order-btn").on("click", function () {
  const orderId = $("#txt-order-id").val();
  const order = getOrderById(orderId);

  if (order) {
    $("#confirm-delete-model .modal-body").text(
      "Are you sure you want to delete this order ?"
    );
    $("#confirm-delete-model").modal("show");

    $("#confirm-delete-btn").one("click", function () {
      for (const detail of order.orderDetails) {
        const item = getItemByCode(detail.itemCode);
        item.qty += detail.qty;
        itemDatabase[itemDatabase.findIndex((i) => i.code === item.code)] =
          item;
      }

      orderDatabase.splice(
        orderDatabase.findIndex((o) => o.orderId === orderId),
        1
      );

      showToast("success", "Order deleted successfully !");
      $("#confirm-delete-model").modal("hide");
      clearForm();
      loadAllItems();
      loadOrderCount();
    });
  } else {
    showToast("error", "Order not found !");
  }
});

// Search Order
$("#search-order").on("submit", function (event) {
  event.preventDefault();

  const orderId = $("#txt-search-order").val();
  const order = getOrderById(orderId);

  let isValidated = $("#txt-search-order").hasClass("is-valid");

  if (isValidated) {
    if (order) {
      clearForm();

      $("#txt-order-id").val(order.orderId);
      $("#txt-order-date").val(order.date);
      $("#txt-customer-id").val(order.customerId).trigger("input");
      $("#txt-order-discount").val(order.discount);
      $("#txt-order-cash").val(order.cash);
      $("#txt-order-balance").val(order.balance);

      $(
        "#txt-order-id, #txt-order-date, #txt-customer-id, #txt-order-discount, #txt-order-cash, #txt-order-balance"
      )
        .addClass("is-valid")
        .removeClass("is-invalid");

      order.orderDetails.forEach((detail) => appendToOrderTable(detail));
      initializeTotalAndSubtotal();
      showToast("success", "Order search completed successfully !");
    } else {
      showToast("error", "Order not found !");
    }
  }
});

// Clear Order
$("#clear-order-btn").on("click", function () {
  clearForm();
});

// Select Customer (Load Customer Details)
$("#select-customer-id, #txt-customer-id").on("input change", function () {
  const customerId = $(this).val();
  const customer = getCustomerById(customerId);
  if (customer) {
    $("#select-customer-id, #txt-customer-id").val(customer.id);
    $("#txt-customer-name").val(customer.name);
    $("#txt-customer-address").val(customer.address);
    $("#txt-customer-cno").val(customer.contactNo);
    $(
      "#txt-customer-id, #txt-customer-name, #txt-customer-address, #txt-customer-cno"
    )
      .removeClass("is-invalid")
      .addClass("is-valid");
  } else {
    $(
      "#select-customer-id, #txt-customer-name, #txt-customer-address, #txt-customer-cno"
    )
      .removeClass("is-valid")
      .val("");
    $("#txt-customer-id").val(customerId);
  }
});

// Select Item (Load Item Details)
$("#select-item-code, #txt-item-code").on("input change", function () {
  const itemCode = $(this).val();
  const item = getItemByCode(itemCode);
  if (item) {
    $("#select-item-code, #txt-item-code").val(item.code);
    $("#txt-item-name").val(item.name);
    $("#txt-item-price").val(parseFloat(item.price).toFixed(2));
    $("#txt-item-qty").val(item.qty);
    $("#txt-item-code, #txt-item-name, #txt-item-price, #txt-item-qty")
      .removeClass("is-invalid")
      .addClass("is-valid");
  } else {
    $("#select-item-code, #txt-item-name, #txt-item-price, #txt-item-qty")
      .removeClass("is-valid")
      .val("");
    $("#txt-item-code").val(itemCode);
  }
});

// Add Item
$("#item-select").on("submit", function (event) {
  event.preventDefault();

  let isValidated = $("#item-select input")
    .toArray()
    .every((element) => $(element).hasClass("is-valid"));

  if (isValidated) {
    const itemCode = $("#txt-item-code").val();
    const qty = parseInt($("#txt-order-qty").val());

    if (itemDatabase.some((i) => i.code === itemCode)) {
      const orderDetail = new OrderDetail(itemCode, qty);
      appendToOrderTable(orderDetail);
      initializeTotalAndSubtotal();
    } else {
      showToast("error", "Item not found !");
    }
  }
});
