function showToast(type, message) {
  // Hide any existing toasts first
  $(".toast").each(function () {
    const toast = bootstrap.Toast.getInstance(this);
    if (toast) {
      toast.hide();
    }
  });

  // Set the toast content based on type and message
  const toast = type === "success" ? $("#success-toast") : $("#error-toast");
  toast.find(".toast-body").text(message);

  // Initialize Bootstrap Toast with options
  const bsToast = new bootstrap.Toast(toast[0], {
    animation: true,
    autohide: true,
    delay: 5000
  });

  // Show the toast
  bsToast.show();
}
