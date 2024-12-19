function resetForm(formId, textFieldIds) {
  let form = $(formId);
  form[0].reset(); // Clear all  fields
  $(textFieldIds).removeClass("is-invalid is-valid"); // Remove validation classes
  $(textFieldIds).next().hide(); // Hide error messages
}

function getCustomerById(id) {
  return customerDatabase.find((c) => c.id === id);
}

function getItemByCode(code) {
  return itemDatabase.find((i) => i.code === code);
}
