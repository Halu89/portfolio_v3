import sendMail from "./sendMail";

const sendBtn = document.querySelector("#sendMail");
const closeBtn = document.querySelector("#closeForm");
const openBtn = document.querySelector("#cta__contact");

const modal = document.querySelector("#modal");

function closeForm() {
  modal.classList.add("hide");
}
function openForm() {
  modal.classList.remove("hide");
}

closeBtn.onclick = closeForm;
openBtn.onclick = openForm;

sendBtn.onclick = () => {
  const data = validate(getData());
  if (data.error) {
    console.log(data.message);
    showError(data.message);
  }
  if (!data.error) sendMail(data.validated);
  // closeBtn.click();
};

function getData() {
  const email = document.querySelector("#modal #email").value;
  const subject = document.querySelector("#modal #subject").value;
  const message = document.querySelector("#modal #message").value;
  return {
    email,
    subject,
    message,
  };
}

function showError(message) {
  const form = document.querySelector("#modal form");
  let errorDisplay = document.querySelector("#form__error");
  errorDisplay.textContent = `Error : ${message}`;
}

function validate(data) {
  const { email, subject, message } = data;
  if (!(email.trim() && subject.trim() && message.trim())) {
    return {
      error: true,
      message: "Please fill out all fields",
    };
  }
  // https://ihateregex.io/expr/email/
  // (group)@(group).(group) with no @, empty space, or tab, or new line in every group
  const regExp = new RegExp("[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+");
  if (!regExp.test(email)) {
    return {
      error: true,
      message: "Invalid Email Adress",
    };
  }

  return {
    error: false,
    validated: data,
  };
}
