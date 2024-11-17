import { ItemDto } from "../dto/ItemDto.js";
import { items } from "../db/DB.js";

export function getAllItems() {
  return items;
}

export function addItem(item) {
  if (item instanceof ItemDto && item.code !== null && item.code !== '' && item.name !== null && item.name !== '' && item.qty !== null && item.qty > 0 && item.unitPrice !== null && item.unitPrice > 0) {
    items.push(item);
  } else {
    throw new Error('Invalid Item');
  }
}

export function removeItem(code) {
  const index = items.findIndex(item => item.code === code);
  if (index !== -1) {
    items.splice(index, 1);
  }
}

export function isItemExist(code) {
  return items.find(item => item.code === code) !== undefined;
}

export function updateItem(updatedItem) {
  const index = items.findIndex(item => item.code === updatedItem.code);
  if (index !== -1) {
    items[index] = updatedItem;
    alert('Item Updated Successfully!');
  } else {
    throw new Error('Item not found');
  }
}