function realTimeValidate() {
  const input = $(this);
  const value = input.val();

  // Skip if it's the order quantity input (handled separately)
  if (
    input.attr("id") === "txt-order-qty" ||
    input.attr("id") === "txt-order-cash"
  ) {
    return;
  }

  // Check if this is a date input
  if (input.attr("type") === "date") {
    if (value) {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      // Reset time part for accurate date comparison
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate <= currentDate) {
        input.removeClass("is-invalid").addClass("is-valid");
        input.next().hide();
      } else {
        input.removeClass("is-valid").addClass("is-invalid");
        input.next().show();
      }
    } else {
      input.removeClass("is-valid").addClass("is-invalid");
      input.next().show();
    }
  } else {
    // For non-date inputs, use pattern validation
    const pattern = new RegExp(input.attr("pattern")); // Get the pattern from the input field

    if (pattern.test(value)) {
      // If the input matches the pattern, show valid feedback
      input.removeClass("is-invalid").addClass("is-valid");
      input.next().hide(); // Hide error message
    } else {
      // If the input doesn't match the pattern, show invalid feedback
      input.removeClass("is-valid").addClass("is-invalid");
      input.next().show(); // Show error message
    }
  }
}

function realTimeValidateInput(input, pattern, textFieldId) {
  if (pattern.test(input)) {
    $(textFieldId).removeClass("is-invalid").addClass("is-valid");
    $(textFieldId).next().hide();
  } else {
    $(textFieldId).removeClass("is-valid").addClass("is-invalid");
    $(textFieldId).next().show();
  }
}
