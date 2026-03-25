class NavbarView {
  update(currentUser) {
    const guestItems = document.querySelectorAll(".guest-only");
    const authItems = document.querySelectorAll(".auth-only");
    const userNameSpans = document.querySelectorAll(".nav-user-name");

    guestItems.forEach(item => {
      item.style.display = currentUser ? "none" : "";
    });

    authItems.forEach(item => {
      item.style.display = currentUser ? "" : "none";
    });

    userNameSpans.forEach(item => {
      item.textContent = currentUser ? currentUser.firstName : "";
    });
  }
}

window.NavbarView = NavbarView;