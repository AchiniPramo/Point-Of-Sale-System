initializeNextItemCode();
loadAllItems();

$("#save-item input").on("input change", realTimeValidate);
$("#update-item input").on("input change", realTimeValidate);

$("#txt-search-valuei").on("input change", function () {
  const value = $(this).val();
  const option = $("#search-item-by").val();

  const patterns = {
    Code: /^I[0-9]{3,}$/,
    Name: /^[a-zA-Z0-9\s\-\']{1,50}$/
  };

  if (patterns[option]) {
    realTimeValidateInput(value, patterns[option], this);
  }
});

$("#search-item-by").on("change", function () {
  const value = $("#txt-search-valuei").val();
  const option = $(this).val();

  const patterns = {
    Code: /^I[0-9]{3,}$/,
    Name: /^[a-zA-Z0-9\s\-\']{1,50}$/
  };

  if (patterns[option]) {
    realTimeValidateInput(value, patterns[option], "#txt-search-valuei");
  }
});

$("#close-savei-btn, #close-savei-icon").on("click", function () {
  resetForm("#save-item", "#save-item input");
  initializeNextItemCode();
});
$("#close-updatei-btn, #close-updatei-icon").on("click", function () {
  resetForm("#update-item", "#update-item input");
});

//========================================================================================
/*                                 Other Functions                                      */
//========================================================================================

function initializeNextItemCode() {
  const prevCode =
    itemDatabase.length > 0
      ? itemDatabase[itemDatabase.length - 1].code
      : "I000";
  const nextCode = generateNextID(prevCode);
  $("#txt-save-icode").val(nextCode);
  $("#txt-save-icode").removeClass("is-invalid").addClass("is-valid");
}

function getItemByName(name) {
  return itemDatabase.filter((i) => i.name === name);
}

function appendToItemTable(item) {
  $("#item-tbody").append(`
        <tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${parseFloat(item.price).toFixed(2)}</td>
        </tr>
    `);
}

function getItemByOption(option, value) {
  if (option === "Code") return getItemByCode(value);
  if (option === "Name") return getItemByName(value);
  return null;
}

function loadAllItems() {
  $("#item-tbody").empty();
  for (const item of itemDatabase) {
    appendToItemTable(item);
  }
}

function sortItemDatabaseByCode() {
  itemDatabase.sort(function (a, b) {
    const codeA = parseInt(a.code.replace("I", ""), 10);
    const codeB = parseInt(b.code.replace("I", ""), 10);
    return codeA - codeB;
  });
}

//========================================================================================
/*                                CRUD Operations                                       */
//========================================================================================

// Save Item
$("#save-item").on("submit", function (event) {
  event.preventDefault();
  let isValidated = $("#save-item input")
    .toArray()
    .every((element) => $(element).hasClass("is-valid"));

  if (isValidated) {
    const code = $("#txt-save-icode").val();
    const name = $("#txt-save-iname").val();
    const quantity = $("#txt-save-iqty").val();
    const unitPrice = $("#txt-save-iprice").val();

    const item = new Item(code, name, quantity, unitPrice);

    if (!itemDatabase.some((i) => i.code === code)) {
      itemDatabase.push(item);
      showToast("success", "Item saved successfully !");
      resetForm("#save-item", "#save-item input");
      initializeNextItemCode();
      sortItemDatabaseByCode();
      loadAllItems();
      loadItemCount();
      initializeOrderComboBoxes();
    } else {
      showToast("error", "Item code already exists !");
    }
  }
});

// Update Item (Load Item Details)
$("#txt-update-icode").on("input", function (event) {
  if (itemDatabase.some((i) => i.code === $(this).val())) {
    const item = getItemByCode($(this).val());
    $("#txt-update-iname").val(item.name);
    $("#txt-update-iqty").val(item.qty);
    $("#txt-update-iprice").val(item.price);
    $("#update-item input").addClass("is-valid").removeClass("is-invalid");
  } else {
    $("#txt-update-iname").val("");
    $("#txt-update-iqty").val("");
    $("#txt-update-iprice").val("");
    $("#update-item input").removeClass("is-valid");
  }
});

// Update Item
$("#update-item").on("submit", function (event) {
  event.preventDefault();

  let isValidated = $("#update-item input")
    .toArray()
    .every((element) => $(element).hasClass("is-valid"));

  if (isValidated) {
    const code = $("#txt-update-icode").val();
    const name = $("#txt-update-iname").val();
    const quantity = $("#txt-update-iqty").val();
    const unitPrice = $("#txt-update-iprice").val();

    const item = new Item(code, name, quantity, unitPrice);

    if (itemDatabase.some((i) => i.code === code)) {
      const index = itemDatabase.findIndex((i) => i.code === code);
      itemDatabase[index] = item;
      showToast("success", "Item updated successfully !");
      resetForm("#update-item", "#update-item input");
      loadAllItems();
    } else {
      showToast("error", "Item code not found !");
    }
  }
});

// Search Item
$("#search-item").on("submit", function (event) {
  event.preventDefault();

  let isValidated = $("#txt-search-valuei").hasClass("is-valid");

  if (isValidated) {
    const value = $("#txt-search-valuei").val();
    const option = $("#search-item-by").val();

    $("#item-tbody").empty();

    const items = getItemByOption(option, value);

    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        appendToItemTable(item);
      }
      showToast("success", "Item search completed successfully !");
    } else if (items && !Array.isArray(items)) {
      appendToItemTable(items);
      showToast("success", "Item search completed successfully !");
    } else {
      showToast("error", `Item ${option} not found !`);
    }
  }
});

// Clear Item
$("#clear-item-btn").on("click", function () {
  $("#txt-search-valuei").val("");
  $("#txt-search-valuei").removeClass("is-invalid is-valid");
  $("#txt-search-valuei").next().hide();
  $("#search-item-by").val("Code");
  $("#item-tbody").empty();
  showToast("success", "Item page cleared !");
});

// Delete Item
$("#delete-item-btn").on("click", function () {
  const value = $("#txt-search-valuei").val();
  const option = $("#search-item-by").val();

  const items = getItemByOption(option, value);

  if (Array.isArray(items) && items.length > 0) {
    $("#confirm-delete-model .modal-body").text(
      "Are you sure you want to delete this item ?"
    );
    $("#confirm-delete-model").modal("show");

    $("#confirm-delete-btn").one("click", function () {
      for (const item of items) {
        const index = itemDatabase.findIndex((i) => i.code === item.code);
        if (index !== -1) {
          itemDatabase.splice(index, 1);
        }
      }
      showToast("success", "Item deleted successfully !");
      $("#confirm-delete-model").modal("hide");
      loadAllItems();
      loadItemCount();
      initializeOrderComboBoxes();
    });
  } else if (items && !Array.isArray(items)) {
    $("#confirm-delete-model .modal-body").text(
      "Are you sure you want to delete this item ?"
    );
    $("#confirm-delete-model").modal("show");

    $("#confirm-delete-btn").one("click", function () {
      const index = itemDatabase.findIndex((i) => i.code === items.code);
      if (index !== -1) {
        itemDatabase.splice(index, 1);
        showToast("success", "Item deleted successfully !");
        $("#confirm-delete-model").modal("hide");
        loadAllItems();
        loadItemCount();
        initializeOrderComboBoxes();
      }
    });
  } else {
    showToast("error", `Item ${option} not found !`);
    loadAllItems();
  }
});

// Load All Items
$("#load-all-item-btn").on("click", function () {
  loadAllItems();
  showToast("success", "All items loaded successfully !");
});
