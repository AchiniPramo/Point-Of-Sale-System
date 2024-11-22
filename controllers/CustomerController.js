// Initialize Customer ID in New Customer on page load
initializeNextCustomerId();
// Load all customers to the table on page load
loadAllCustomers();

// Validate with regex pattern for Customer ID and Contact Number in real-time
$("#save-customer input, #save-customer textarea").on(
  "input change",
  realTimeValidate
);
$("#update-customer input, #update-customer textarea").on(
  "input change",
  realTimeValidate
);

// Validate with regex pattern for Search Customer in real-time
$("#txt-search-valuec").on("input change", function () {
  const value = $(this).val();
  const option = $("#search-customer-by").val();

  // Define regex patterns for each option
  const patterns = {
    ID: /^C[0-9]{3,}$/,
    Name: /^([A-Z]\.[A-Z]\. )?[A-Z][a-z]*( [A-Z][a-z]*)*$/,
    "Contact No": /^[0-9]{10}$/
  };

  if (patterns[option]) {
    realTimeValidateInput(value, patterns[option], this);
  }
});

$("#search-customer-by").on("change", function () {
  const value = $("#txt-search-valuec").val();
  const option = $(this).val();

  const patterns = {
    ID: /^C[0-9]{3,}$/,
    Name: /^([A-Z]\.[A-Z]\. )?[A-Z][a-z]*( [A-Z][a-z]*)*$/,
    "Contact No": /^[0-9]{10}$/
  };

  if (patterns[option]) {
    realTimeValidateInput(value, patterns[option], "#txt-search-valuec");
  }
});

// Reset form validation when Close button is clicked
$("#close-savec-btn, #close-savec-icon").on("click", function () {
  resetForm("#save-customer", "#save-customer input, #save-customer textarea");
  initializeNextCustomerId();
});
$("#close-updatec-btn, #close-updatec-icon").on("click", function () {
  resetForm(
    "#update-customer",
    "#update-customer input, #update-customer textarea"
  );
});

//========================================================================================
/*                                 Other Functions                                      */
//========================================================================================

function initializeNextCustomerId() {
  // Initialize Customer ID in New Customer
  const prevId =
    customerDatabase.length > 0
      ? customerDatabase[customerDatabase.length - 1].id
      : "C000";
  const nextId = generateNextID(prevId);
  $("#txt-save-cid").val(nextId);
  $("#txt-save-cid").removeClass("is-invalid").addClass("is-valid");
}

function getCustomerByName(name) {
  return customerDatabase.filter((c) => c.name === name);
}

function getCustomerByContactNo(contactNo) {
  return customerDatabase.filter((c) => c.contactNo === contactNo);
}

// Function to append customer to table
function appendToCustomerTable(customer) {
  $("#customer-tbody").append(`
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.address}</td>
            <td>${customer.contactNo}</td>
        </tr>
    `);
}

// Function to get customer based on option
function getCustomerByOption(option, value) {
  if (option === "ID") return getCustomerById(value);
  if (option === "Name") return getCustomerByName(value);
  if (option === "Contact No") return getCustomerByContactNo(value);
  return null;
}

// Function to load all customers to the table
function loadAllCustomers() {
  $("#customer-tbody").empty();
  for (const customer of customerDatabase) {
    appendToCustomerTable(customer);
  }
}

// Sort Customer Database by ID
function sortCustomerDatabaseById() {
  customerDatabase.sort(function (a, b) {
    const idA = parseInt(a.id.replace("C", ""), 10); // Remove 'C' and parse as integer
    const idB = parseInt(b.id.replace("C", ""), 10); // Remove 'C' and parse as integer

    return idA - idB; // Sort in ascending order
  });
}

//========================================================================================
/*                                CRUD Operations                                       */
//========================================================================================

// Save Customer
$("#save-customer").on("submit", function (event) {
  event.preventDefault();

  let isValidated = $("#save-customer input, #save-customer textarea")
    .toArray()
    .every((element) => $(element).hasClass("is-valid"));

  if (isValidated) {
    const id = $("#txt-save-cid").val();
    const name = $("#txt-save-cname").val();
    const address = $("#txt-save-caddress").val();
    const contactNo = $("#txt-save-cno").val();

    const customer = new Customer(id, name, address, contactNo);

    if (!customerDatabase.some((c) => c.id === id)) {
      customerDatabase.push(customer);
      showToast("success", "Customer saved successfully !");
      resetForm(
        "#save-customer",
        "#save-customer input, #save-customer textarea"
      );
      initializeNextCustomerId();
      sortCustomerDatabaseById();
      loadAllCustomers();
      loadCustomerCount();
      initializeOrderComboBoxes();
    } else {
      showToast("error", "Customer ID already exists !");
    }
  }
});

// Update Customer (Load Customer Details)
$("#txt-update-cid").on("input", function (event) {
  if (customerDatabase.some((c) => c.id === $(this).val())) {
    const customer = getCustomerById($(this).val());
    $("#txt-update-cname").val(customer.name);
    $("#txt-update-caddress").val(customer.address);
    $("#txt-update-cno").val(customer.contactNo);
    $("#update-customer input, #update-customer textarea")
      .addClass("is-valid")
      .removeClass("is-invalid");
  } else {
    $("#txt-update-cname").val("");
    $("#txt-update-caddress").val("");
    $("#txt-update-cno").val("");
    $("#update-customer input, #update-customer textarea").removeClass(
      "is-valid"
    );
  }
});

// Update Customer
$("#update-customer").on("submit", function (event) {
  event.preventDefault();

  let isValidated = $("#update-customer input, #update-customer textarea")
    .toArray()
    .every((element) => $(element).hasClass("is-valid"));

  if (isValidated) {
    const id = $("#txt-update-cid").val();
    const name = $("#txt-update-cname").val();
    const address = $("#txt-update-caddress").val();
    const contactNo = $("#txt-update-cno").val();

    const customer = new Customer(id, name, address, contactNo);

    if (customerDatabase.some((c) => c.id === id)) {
      const index = customerDatabase.findIndex((c) => c.id === id);
      customerDatabase[index] = customer;
      showToast("success", "Customer updated successfully !");
      resetForm(
        "#update-customer",
        "#update-customer input, #update-customer textarea"
      );
      loadAllCustomers();
    } else {
      showToast("error", "Customer ID not found !");
    }
  }
});

// Search Customer
$("#search-customer").on("submit", function (event) {
  event.preventDefault();

  let isValidated = $("#txt-search-valuec").hasClass("is-valid");

  if (isValidated) {
    const value = $("#txt-search-valuec").val();
    const option = $("#search-customer-by").val();

    // Clear the table first
    $("#customer-tbody").empty();

    const customers = getCustomerByOption(option, value);

    if (Array.isArray(customers) && customers.length > 0) {
      for (const customer of customers) {
        appendToCustomerTable(customer);
      }
      showToast("success", "Customer search completed successfully !");
    } else if (customers && !Array.isArray(customers)) {
      appendToCustomerTable(customers);
      showToast("success", "Customer search completed successfully !");
    } else {
      showToast("error", `Customer ${option} not found !`);
    }
  }
});

// Clear Customer
$("#clear-customer-btn").on("click", function () {
  $("#txt-search-valuec").val("");
  $("#txt-search-valuec").removeClass("is-invalid is-valid");
  $("#txt-search-valuec").next().hide();
  $("#search-customer-by").val("ID");
  $("#customer-tbody").empty();
  showToast("success", "Customer page cleared !");
});

// Delete Customer
$("#delete-customer-btn").on("click", function () {
  const value = $("#txt-search-valuec").val();
  const option = $("#search-customer-by").val();

  const customers = getCustomerByOption(option, value);

  if (Array.isArray(customers) && customers.length > 0) {
    // Prepare the message for the confirmation modal
    $("#confirm-delete-model .modal-body").text(
      "Are you sure you want to delete this customer ?"
    );
    // Show the confirmation modal
    $("#confirm-delete-model").modal("show");

    // Attach event listener for confirming the delete
    $("#confirm-delete-btn").one("click", function () {
      for (const customer of customers) {
        const index = customerDatabase.findIndex((c) => c.id === customer.id);
        if (index !== -1) {
          customerDatabase.splice(index, 1);
        }
      }
      showToast("success", "Customer deleted successfully!");
      $("#confirm-delete-model").modal("hide"); // Hide modal after deletion
      loadAllCustomers();
      loadCustomerCount();
      initializeOrderComboBoxes();
    });
  } else if (customers && !Array.isArray(customers)) {
    $("#confirm-delete-model .modal-body").text(
      "Are you sure you want to delete this customer ?"
    );
    $("#confirm-delete-model").modal("show");

    $("#confirm-delete-btn").one("click", function () {
      const index = customerDatabase.findIndex((c) => c.id === customers.id);
      if (index !== -1) {
        customerDatabase.splice(index, 1);
      }
      showToast("success", "Customer deleted successfully!");
      $("#confirm-delete-model").modal("hide");
      loadAllCustomers();
      loadCustomerCount();
      initializeOrderComboBoxes();
    });
  } else {
    showToast("error", `Customer ${option} not found!`);
    loadAllCustomers();
  }
});

// Load All Customers
$("#load-all-customer-btn").on("click", function () {
  loadAllCustomers();
  showToast("success", "All customers loaded successfully !");
});
