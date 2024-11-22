$("#login-btn").on("click", () => {
  $(".d-block").first().addClass("d-none").removeClass("d-block");
  $("#tab-content-1").addClass("d-block").removeClass("d-none");
  $("#burger-btn").removeClass("d-none");
  $("#nav-bar").removeClass("d-none");
});

$("#signup-btn").on("click", () => {
  $(".d-block").first().addClass("d-none").removeClass("d-block");
  $("#signup-content").addClass("d-block").removeClass("d-none");
});

$("#forgot-password-btn").on("click", () => {
  $(".d-block").first().addClass("d-none").removeClass("d-block");
  $("#forgot-password-content").addClass("d-block").removeClass("d-none");
});
