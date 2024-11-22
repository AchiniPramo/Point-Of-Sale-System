function showTab(value) {
  $(".d-block").first().addClass("d-none").removeClass("d-block");
  $(`#tab-content-${value}`).removeClass("d-none").addClass("d-block");
  $(".active").first().addClass("text-success").removeClass("active");
  $(`#tab-${value} a`).addClass("active").removeClass("text-success");

  const navbarCollapse = new bootstrap.Collapse($("#navbarNav"), {
    toggle: false
  });
  navbarCollapse.hide();
}

$(document).keydown((event) => {
  if (event.key === "Tab") {
    event.preventDefault(); // Prevent the default tab behavior
  }
});
