import { OrderDto } from "../dto/OrderDto.js";
import { OrderDetailDto } from "../dto/OrderDetailDto.js";
import { getAllOrders,saveOrder,searchOrder} from "../model/OrderModel.js";
import {getAllCustomers} from "../model/CustomerModel.js";
import {getAllItems} from "../model/ItemModel.js";

export {setCustomerList,setItemList};

generateNextOrderId();
setDate();
setCustomerList();
setItemList();



document.getElementById('discount').addEventListener('input', updateDiscountedTotal);
document.getElementById('additem-btn').addEventListener('click',addItemBtnOnAction);
document.getElementById('btn-purchase').addEventListener('click', btnPurchaseOnAction);
document.getElementById('order-id').addEventListener('keydown',searchOrderOnAction);


function searchOrderOnAction(event){ 
  if(event.key === 'Enter'){
    let orderId = document.getElementById('order-id').value;
    let order = searchOrder(orderId);
    if(order){
      document.getElementById('order-date').value = order._orderDate;
      document.getElementById('cus-id-order').value = order._customerId;
      document.getElementById('cus-name-order').value = order._customerName;
      document.getElementById('cus-address-order').value = order._customerAddress;
      document.getElementById('cus-salary-order').value = order._customerSalary;
      document.getElementById('total-order').innerText = order._totalAmount;
      document.getElementById('sub-total-order').innerText = order._subtotalAmount;
      document.getElementById('discount').value = order._discount;
      document.getElementById('paidAmount').value = order._paidAmount;
      document.getElementById('balance').value = order._balance;
  
      let table = document.getElementById('cart-table').getElementsByTagName('tbody')[0];
      table.innerHTML = '';
      if (Array.isArray(order._orderDetails)) {
        console.log('order:',order._orderDetails);
        order._orderDetails.forEach(orderDetail => {
            let table = document.getElementById('cart-table').getElementsByTagName('tbody')[0];
            let row = table.insertRow();
            let itemCodeCell = row.insertCell(0);
            let itemNameCell = row.insertCell(1);
            let itemPriceCell = row.insertCell(2);
            let itemQtyCell = row.insertCell(3);
            let itemTotalCell = row.insertCell(4);
            let deleteBtnCell = row.insertCell(5);

            itemCodeCell.innerHTML = orderDetail._itemCode;
            itemNameCell.innerHTML = orderDetail._itemName;
            itemQtyCell.innerHTML = orderDetail._orderedQty;
            itemPriceCell.innerHTML = orderDetail._itemPrice;
            itemTotalCell.innerHTML = orderDetail._totalPrice;
         
        });
      }
     }else{
      alert('Order not found!');
    }
  }
}

function btnPurchaseOnAction(){

  
    event.preventDefault();
  
    let orderId = document.getElementById('order-id').value;
    let orderDate = document.getElementById('order-date').value;
    let customerId = document.getElementById('cus-id-order').value;
    let customerName = document.getElementById('cus-name-order').value;
    let customerAddress = document.getElementById('cus-address-order').value;
    let customerSalary = document.getElementById('cus-salary-order').value;
    let totalAmount = document.getElementById('total-order').innerText;
    let subtotalAmount = document.getElementById('sub-total-order').innerText;
    let discount = document.getElementById('discount').value;
    let paidAmount = document.getElementById('paidAmount').value;
    let balance = document.getElementById('balance').value;

    
    if(customerId !== '' && customerName !== '' && customerAddress !== '' && customerSalary !== '' && totalAmount !== '' && subtotalAmount !== '' && discount !== '' && paidAmount !== '' && balance !== ''){
      
    let orderDetails = [];
  
    let table = document.getElementById('cart-table').getElementsByTagName('tbody')[0];
    let rows = table.rows;
    for(let i = 0; i < rows.length; i++){
      let orderDetail = new OrderDetailDto(
        orderId,
        rows[i].cells[0].innerHTML,
        rows[i].cells[1].innerHTML,
        rows[i].cells[2].innerHTML,
        document.getElementById('item-qty-order').value,
        rows[i].cells[3].innerHTML,
        rows[i].cells[4].innerHTML
      );
      orderDetails.push(orderDetail);
    }
  
    let order = new OrderDto(
      orderId,
      orderDate,
      customerId,
      customerName,
      customerAddress,
      customerSalary,
      totalAmount,
      subtotalAmount,
      discount,
      paidAmount,
      balance,
      orderDetails
    );
  
    let isSaved = saveOrder(order);
    
    if(isSaved){
      alert('Order has been saved successfully!');
      clearFields();
      generateNextOrderId();
    }

    }else{
      alert('Fill all the fields!');
    }
}


function generateNextOrderId() {
  let orders = getAllOrders();
  let lastOrder = orders[orders.length - 1];
  let lastID = lastOrder ? lastOrder._orderId : "O00-000";
  let idParts = lastID.split("-");
  let prefix = idParts[0];
  let number = parseInt(idParts[1]) + 1;
  let nextID = prefix + "-" + number.toString().padStart(3, "0");
  
  
  document.getElementById('order-id').value = nextID;
}

function setDate() {
  let date = new Date();
  let formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  document.getElementById('order-date').value = formattedDate;
}

function setCustomerList(){

  let customerList = document.getElementById('customer-list');
  customerList.innerHTML = '';

  let defaultOption = document.createElement('option');
  defaultOption.textContent = 'Select Customer';
  defaultOption.value = '';
  customerList.appendChild(defaultOption);

  let customers = getAllCustomers();
  customers.forEach(customer => {
    let option = document.createElement('option');
    option.textContent = customer._id;
    option.value = customer._id;
    customerList.appendChild(option);
  });
}
 
document.getElementById('customer-list').addEventListener('change', function(){
  let selectedCustomerId = document.getElementById('customer-list').value;
  let selectedCustomer = getAllCustomers().find(customer => customer._id === selectedCustomerId);
  document.getElementById('cus-id-order').value = selectedCustomer._id;
  document.getElementById('cus-name-order').value = selectedCustomer._name;
  document.getElementById('cus-address-order').value = selectedCustomer._address;
  document.getElementById('cus-salary-order').value = selectedCustomer._salary;
});

function setItemList(){
  
  let itemList = document.getElementById('item-list');
  itemList.innerHTML = '';

  let defaultOption = document.createElement('option');
  defaultOption.textContent = 'Select Item';
  defaultOption.value = '';
  itemList.appendChild(defaultOption);

  let items = getAllItems();

 
  items.forEach(item => {
    let option = document.createElement('option');
    option.textContent = item._code;
    option.value = item._code;
    itemList.appendChild(option);
  });
}

document.getElementById('item-list').addEventListener('change', function(){
  let selectedItemId = document.getElementById('item-list').value;
  let selectedItem = getAllItems().find(item => item._code === selectedItemId);
  document.getElementById('item-code-order').value = selectedItem._code;
  document.getElementById('item-name-order').value = selectedItem._name;
  document.getElementById('item-qty-order').value = selectedItem._qty;
  document.getElementById('item-price-order').value = selectedItem._unitPrice;
});

function addItemBtnOnAction(){

  event.preventDefault();

  let orderId = document.getElementById('order-id').value;
  let itemCode = document.getElementById('item-code-order').value;
  let itemName = document.getElementById('item-name-order').value;
  let itemQty = document.getElementById('item-qty-order').value;
  let itemPrice = document.getElementById('item-price-order').value;
  let orderQty = document.getElementById('ordered-qty').value;
  
 

  if(orderId === '' || itemCode === '' || itemName === '' || itemQty === '' || itemPrice === '' || orderQty === ''){
    alert('Select an item and add order quantity!');
  }else{

    let orderDetail = new OrderDetailDto(

      orderId,
      itemCode,
      itemName,
      itemPrice,
      itemQty,
      orderQty,
      itemPrice * orderQty

    );

    addOrderDetailToTable(orderDetail);
    clearItemFields();
    updateTheQuantity(orderDetail._itemCode, orderDetail._orderedQty);
    updateTotal();

  }

}

function updateTotal(){

    let table = document.getElementById('cart-table').getElementsByTagName('tbody')[0];
    let rows = table.rows;
    let total = 0;
    for(let i = 0; i < rows.length; i++){
      total += parseInt(rows[i].cells[4].innerHTML);
    }
    document.getElementById('sub-total-order').innerText = total;
    document.getElementById('total-order').innerText = total;
  
}

function updateDiscountedTotal(){
  let subTotal = document.getElementById('sub-total-order').innerText;
  let discount = document.getElementById('discount').value;
  let discountedTotal = subTotal - (subTotal * discount / 100);
  document.getElementById('total-order').innerText = discountedTotal;

  generateTheBalance(discountedTotal);
}

function generateTheBalance(discountedTotal){
  let paidAmount = document.getElementById('paidAmount').value;
  let balance = paidAmount - discountedTotal;
  document.getElementById('balance').value = balance;
}

function updateTheQuantity(itemCode, orderedQty){
  let items = getAllItems();
  let item = items.find(item => item._code === itemCode);
  let index = items.indexOf(item);
  items[index]._qty -= orderedQty;
}



function addOrderDetailToTable(orderDetail){

  let table = document.getElementById('cart-table').getElementsByTagName('tbody')[0];

  let existingItem = Array.from(table.rows).find(row => row.cells[0].innerHTML === orderDetail._itemCode);
  if (existingItem) {
    let existingQty = parseInt(existingItem.cells[3].innerHTML);
    let newQty = existingQty + parseInt(orderDetail._orderedQty);
    existingItem.cells[3].innerHTML = newQty;
    existingItem.cells[4].innerHTML = orderDetail._itemPrice * newQty;
  } else {
    let newRow = table.insertRow(table.rows.length);
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);
    let cell5 = newRow.insertCell(4);
    let cell6 = newRow.insertCell(5);

    cell1.innerHTML = orderDetail._itemCode;
    cell2.innerHTML = orderDetail._itemName;
    cell3.innerHTML = orderDetail._itemPrice;
    cell4.innerHTML = orderDetail._orderedQty;
    cell5.innerHTML = orderDetail._totalPrice;
    cell6.innerHTML = `<button type="button" class="btn btn-danger" >Remove</button>`;
  }


}

document.getElementById('cart-table').addEventListener('click', function(event) {
  if (event.target && event.target.nodeName === 'BUTTON') {
    deleteOrderDetail(event.target);
  }
});

function deleteOrderDetail(row){
  let i = row.parentNode.parentNode.rowIndex;
  document.getElementById('cart-table').deleteRow(i);
  updateQtyAfterDelete(row.parentNode.parentNode.cells[0].innerHTML, row.parentNode.parentNode.cells[3].innerHTML); 
  updateTotal();
}

function updateQtyAfterDelete(itemCode, orderedQty){
  let items = getAllItems();
  let item = items.find(item => item._code === itemCode);
  let index = items.indexOf(item);
  items[index]._qty += parseInt(orderedQty);

}

function clearItemFields(){
  document.getElementById('item-code-order').value = '';
  document.getElementById('item-name-order').value = '';
  document.getElementById('item-qty-order').value = '';
  document.getElementById('item-price-order').value = '';
  document.getElementById('ordered-qty').value = '';
}

function clearFields(){
  document.getElementById('order-id').value = '';
  document.getElementById('order-date').value = '';
  document.getElementById('cus-id-order').value = '';
  document.getElementById('cus-name-order').value = '';
  document.getElementById('cus-address-order').value = '';
  document.getElementById('cus-salary-order').value = '';
  document.getElementById('total-order').innerText = '0.00';
  document.getElementById('sub-total-order').innerText = '0.00';
  document.getElementById('discount').value = '';
  document.getElementById('paidAmount').value = '';
  document.getElementById('balance').value = '';
  document.getElementById('cart-table').getElementsByTagName('tbody')[0].innerHTML = '';

  setCustomerList();
  setItemList();
}