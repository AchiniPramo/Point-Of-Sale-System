import { customers } from '../db/DB.js';
import { CustomerDto } from '../dto/CustomerDto.js';



export function getAllCustomers(){
  return customers;
}

export function AddCustomer(customer){

  if (customer instanceof CustomerDto && customer.id !== null && customer.id !== '' && customer.name !== null && customer.name !== '' && customer.address !== null && customer.address !== '' && customer.salary !== null && customer.salary !== '' && !isNaN(customer.salary) && customer.salary > 0){

      customers.push(customer);
     
  } else {
    throw new Error ('Invalid Customer');
  }

}

export function RemoveCustomer(id){
  const index = customers.findIndex(customer => customer.id === id);
  if (index !== -1) {
    customers.splice(index, 1);
  }
}

export function isCustomerExist(id){
  return customers.find(customer => customer.id === id) !== undefined;
}

export function UpdateCustomer(updateCustomer){
  const index = customers.findIndex(customer => customer.id === updateCustomer.id);
  if (index !== -1) {
    customers[index] = updateCustomer;
    alert('Customer Updated Successfully!');
  } else {
    throw new Error('Customer not found');
  }
}

