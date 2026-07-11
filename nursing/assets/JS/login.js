const container = document.querySelector(".login-container");
const showLogin = () => container.classList.add("show-login");
const hideLogin = () => container.classList.remove("show-login");

const redirectLink = (e) => {
  window.location.href = `${e}`;
};

const confirmRedirectLink = (link, message) => {
  if (confirm(`${message}`)) {
    redirectLink(link);
  }
};
