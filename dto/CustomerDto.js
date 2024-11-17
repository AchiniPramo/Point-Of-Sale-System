export class CustomerDto {

    constructor(id = null, name = '', address = '', salary = 0) {
  
      if(this.isValidated(id,name,address,salary)) {
        this._id = id;
        this._name = name;
        this._address = address;
        this._salary = salary;
      }
  
    
    }
  
    isValidated(id,name,address,salary) {
      let isValid = true;
  
      if ( this.checkIdPattern(id) === false){
          $('#cusId-error').text("Item Code is a required field and should be in the format 'C00-001'");
          isValid = false;
      } else  {
          $('#cusId-error').text("");
  
      }
  
      if (name === null || name === '') {
          $('#cusName-error').text("Please enter your Customer Name");
          isValid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        $('#cusName-error').text("Please enter a valid Customer Name");
        isValid = false;
      } else {
          $('#cusName-error').text("");
      }
      if (address === null || address === '') {
          $('#cusAddress-error').text("Please enter your Customer Address");
          isValid = false;
      } else if( address.length < 5){
        console.log(address.length);
          $('#cusAddress-error').text("Please enter a valid Customer Address");
          isValid = false;
      } else{
          $('#cusAddress-error').text("");
      }
  
      if (salary === null || salary === '' || isNaN(salary) || salary <= 0 || salary.length < 3 || salary.length > 6){
        $('#cusSalary-error').text("Please enter a valid Customer Salary");
        isValid = false;
      } else {
        $('#cusSalary-error').text("");
      }
  
      return isValid;
    }
  
    checkIdPattern(id) {  
      let idPattern = /^C\d{2}-\d{3}$/;
      return idPattern.test(id);
    }
  
  
  
    get id() {
      return this._id;
    }
  
    get name() {
      return this._name;
    }
  
    get address() {
      return this._address;
    }
  
    get salary() {
      return this._salary;
    }
  
    set id(value) {
  
        this._id = value;
     
    }
  
    set name(value) {
     
        this._name = value;
    
    }
  
    set address(value) {
     
        this._address = value;
     
    }
  
    set salary(value) {
    
        this._salary = value;
    
    }
  
    toString() {
      return `Customer { id: ${this._id}, name: ${this._name}, address: ${this._address}, salary: ${this._salary} }`;
    }
  }
  