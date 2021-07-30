const nav = document.querySelector("nav");
const navlinks = document.querySelector(".navlinks");
const navToggle = document.querySelector("#navToggle");

window.addEventListener("scroll", () => {
  if (scrollY > 10) {
    nav.classList.add("minimized");
  } else {
    nav.classList.remove("minimized");
  }
});

navToggle.onclick = () => {
  navlinks.classList.toggle("show");
  if (navlinks.classList.contains("show")) {
    navToggle.textContent = "Close";
  } else {
    navToggle.textContent = "Menu";
  }
};
