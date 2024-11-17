import { CustomerDto } from "../dto/CustomerDto.js";
import { getAllCustomers,AddCustomer,isCustomerExist,RemoveCustomer, UpdateCustomer} from "../model/CustomerModel.js";

clearTable();
loadAllCustomers();
generateNextCustomerID();

document.getElementById('save-cus').addEventListener('click',addCustomer);
document.getElementById('clear').addEventListener('click',clearFields);
document.getElementById('remove-cus').addEventListener('click',removeCustomer);
document.getElementById('update-cus').addEventListener('click',updateCustomer);
document.getElementById('getall-cus').addEventListener('click',getAll);

document.getElementById('cus-table-body').addEventListener('click', function(event) {
  let target = event.target;
  if (target.tagName === 'TD') {
    let row = target.parentNode;
    let id = row.cells[0].textContent;
    let name = row.cells[1].textContent;
    let address = row.cells[2].textContent;
    let salary = row.cells[3].textContent;

    document.getElementById('cus-ID').value = id;
    document.getElementById('cus-name').value = name;
    document.getElementById('cus-address').value = address;
    document.getElementById('cus-salary').value = salary;
  }
});

function loadAllCustomers(){

    clearTable();
  
    let customers = getAllCustomers();
    customers.forEach(
      customer => {
        reloadTable(customer);
      }
    );
  }
  
  function reloadTable( customer ){

    if (customer !== null && customer !== undefined && customer instanceof CustomerDto && customer._id !== null && customer._id !== undefined) {
      let tableBody = document.getElementById('cus-table-body');
      let newRow = tableBody.insertRow();
    
      let cellId = newRow.insertCell(0);
      let cellName = newRow.insertCell(1);
      let cellAddress = newRow.insertCell(2);
      let cellSalary = newRow.insertCell(3);
    
      cellId.textContent = customer._id;
      cellName.textContent = customer._name;
      cellAddress.textContent = customer._address;
      cellSalary.textContent = customer._salary;
    }
  
  }
  
  
  function getAll(){
    event.preventDefault();
    clearTable();
    loadAllCustomers();
  }
  
  function addCustomer(){
    event.preventDefault();
    const id = document.getElementById('cus-ID').value;
    const name = document.getElementById('cus-name').value;
    const address = document.getElementById('cus-address').value;
    const salary = document.getElementById('cus-salary').value;
    
    const customer = new CustomerDto(
      id,
      name,
      address,
      salary
    );
  
      try{
        if(!isCustomerExist(id)){
          if(confirm("Are you sure you want to add this customer?")){
            AddCustomer(customer);
            clearTable();
            clearFields();
            loadAllCustomers();
            generateNextCustomerID();
            alert('Customer Added Successfully!');
        }else{
        
        }
      }else{
        alert("Customer already exist!");
      }  
        
      } catch(error) {
        throw new Error(error);
      }
  }
  
  function removeCustomer(){
  
    event.preventDefault();
    const id = document.getElementById('cus-ID').value;
  
   
      try{
        if(isCustomerExist(id)){
          if(confirm("Are you sure you want to delete this customer?")){
          RemoveCustomer(id);
          clearTable();
          clearFields();
          loadAllCustomers();
          }
        }else {
          alert("Coudn't find customer!");
        }
      }catch(error){
       throw new Error(error);
      }
  
   
  }
  
  function updateCustomer(){
  
    event.preventDefault();
  
    const id = document.getElementById('cus-ID').value;
    const name = document.getElementById('cus-name').value;
    const address = document.getElementById('cus-address').value;
    const salary = document.getElementById('cus-salary').value;
    
    const updatedCustomer = new CustomerDto(
      id,
      name,
      address,
      salary
    );
    
  
    try{
      if(isCustomerExist(id)){
        if(confirm("Are you sure you want to update this customer?")){
        UpdateCustomer(updatedCustomer);
        clearTable();
        clearFields();
        loadAllCustomers();
        }
      }else{
        alert("Coudn't find customer!");
      }
    } catch(error) {
      throw new Error(error);
    }
  }
  
  function generateNextCustomerID(){
  
    let customers = getAllCustomers();
    let lastCustomer = customers[customers.length - 1];
    let lastID = lastCustomer ? lastCustomer._id : "C00-000";
    let idParts = lastID.split("-");
    let prefix = idParts[0];
    let number = parseInt(idParts[1]) + 1;
    let nextID = prefix + "-" + number.toString().padStart(3, "0");
  
    document.getElementById('cus-ID').value = nextID;
  
  }
  
  function clearFields(){
    event.preventDefault();
    document.getElementById('cus-ID').value = "";
    document.getElementById('cus-name').value = "";
    document.getElementById('cus-address').value = "";
    document.getElementById('cus-salary').value = "";
  
    const errorTags = document.querySelectorAll('p.error');
    errorTags.forEach(tag => tag.textContent = '');
  
    generateNextCustomerID();
  }
  
  function clearTable(){
    let tableBody = document.getElementById('cus-table-body');
    tableBody.innerHTML = "";
  }
  