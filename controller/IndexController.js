import {setCustomerList, setItemList} from './OrderController.js';

$(document).ready(function() {
  $('#homePage').show();

  $('.nav-link').click(function(event) {
    event.preventDefault();

    $('section').hide();

    var targetSection = $(this).attr('href');

    $(targetSection).show();
    switch (targetSection) {
      case '#CustomerManage':
        $('.sec-name').text('Customer Manage');
        document.title = "Customer Manage";
        break;
      case '#ItemManage':
        $('.sec-name').text('Item Manage');
        document.title = "Item Manage";
        break;
      case '#OrderManage':
        $('.sec-name').text('Order Manage');
        document.title = "Order Manage";
        setCustomerList();
        setItemList();
        break;
      default:
        $('.sec-name').text('POS System');
        document.title = "POS System";
    }
  });
});
