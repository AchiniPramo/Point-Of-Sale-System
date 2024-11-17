import { ItemDto } from "../dto/ItemDto.js";
import { getAllItems, addItem, isItemExist, removeItem, updateItem } from "../model/ItemModel.js";

clearItemTable();
loadAllItems();
generateNextItemCode();

document.getElementById('add-item').addEventListener('click', addItemHandler);
document.getElementById('remove-item').addEventListener('click', removeItemHandler);
document.getElementById('update-item').addEventListener('click', updateItemHandler);
document.getElementById('getall-item').addEventListener('click', getAllItemsHandler);
document.getElementById('clear-item').addEventListener('click', clearFieldsHandler);

document.getElementById('item-table-body').addEventListener('click', function(event) {
  let target = event.target;
  if (target.tagName === 'TD') {
    let row = target.parentNode;
    let code = row.cells[0].textContent;
    let name = row.cells[1].textContent;
    let qty = row.cells[2].textContent;
    let unitPrice = row.cells[3].textContent;

    document.getElementById('item-code').value = code;
    document.getElementById('item-name').value = name;
    document.getElementById('item-qty').value = qty;
    document.getElementById('unit-price').value = unitPrice;
  }
});

function loadAllItems() {
  clearItemTable();
  let items = getAllItems();
  items.forEach(item => {
    reloadItemTable(item);
  });
}

function reloadItemTable(item) {
  if (item !== null && item !== undefined && item instanceof ItemDto && item.code !== null && item.code !== undefined) {
    let tableBody = document.getElementById('item-table-body');
    let newRow = tableBody.insertRow();

    let cellCode = newRow.insertCell(0);
    let cellName = newRow.insertCell(1);
    let cellQty = newRow.insertCell(2);
    let cellUnitPrice = newRow.insertCell(3);

    cellCode.textContent = item.code;
    cellName.textContent = item.name;
    cellQty.textContent = item.qty;
    cellUnitPrice.textContent = item.unitPrice;
  }
}

function getAllItemsHandler() {
  event.preventDefault();
  clearItemTable();
  loadAllItems();
}

function addItemHandler() {
  event.preventDefault();
  const code = document.getElementById('item-code').value;
  const name = document.getElementById('item-name').value;
  const qty = document.getElementById('item-qty').value;
  const unitPrice = document.getElementById('unit-price').value;

  const item = new ItemDto(code, name, qty, unitPrice);

  console.log(item);

  try {
    if (!isItemExist(code)) {
      if (confirm("Are you sure you want to add this item?")) {
        addItem(item);
        clearItemTable();
        clearFieldsHandler();
        loadAllItems();
        generateNextItemCode();
        alert('Item Added Successfully!');
      }
    } else {
      alert("Item already exists!");
    }
  } catch (error) {
    throw new Error(error);
  }
}

function removeItemHandler() {
  event.preventDefault();
  const code = document.getElementById('item-code').value;

  try {
    if (isItemExist(code)) {
      if (confirm("Are you sure you want to delete this item?")) {
        removeItem(code);
        clearItemTable();
        clearFieldsHandler();
        loadAllItems();
      }
    } else {
      alert("Couldn't find item!");
    }
  } catch (error) {
    throw new Error(error);
  }
}

function updateItemHandler() {
  event.preventDefault();
  const code = document.getElementById('item-code').value;
  const name = document.getElementById('item-name').value;
  const qty = document.getElementById('item-qty').value;
  const unitPrice = document.getElementById('unit-price').value;

  const updatedItem = new ItemDto(code, name, qty, unitPrice);

  try {
    if (isItemExist(code)) {
      if (confirm("Are you sure you want to update this item?")) {
        updateItem(updatedItem);
        clearItemTable();
        clearFieldsHandler();
        loadAllItems();
      }
    } else {
      alert("Couldn't find item!");
    }
  } catch (error) {
    throw new Error(error);
  }
}

function generateNextItemCode() {
  let items = getAllItems();
  let lastItem = items[items.length - 1];
  let lastCode = lastItem ? lastItem.code : "I00-000";
  let codeParts = lastCode.split("-");
  let prefix = codeParts[0];
  let number = parseInt(codeParts[1]) + 1;
  let nextCode = prefix + "-" + number.toString().padStart(3, "0");

  document.getElementById('item-code').value = nextCode;
}

function clearFieldsHandler() {
  event.preventDefault();
  document.getElementById('item-code').value = "";
  document.getElementById('item-name').value = "";
  document.getElementById('item-qty').value = "";
  document.getElementById('unit-price').value = "";

  const errorTags = document.querySelectorAll('p.error');
  errorTags.forEach(tag => tag.textContent = '');

  generateNextItemCode();
}

function clearItemTable() {
  let tableBody = document.getElementById('item-table-body');
  tableBody.innerHTML = "";
}