import sendMail from "./sendMail";

const flashType = { SUCCESS: "success", DANGER: "danger" };

const flashDisp = document.querySelector("#flashMessage p");
const flashClose = document.querySelector("#flashMessage button");
const flash = document.querySelector("#flashMessage");

const sendBtn = document.querySelector("#sendMail");
const closeBtn = document.querySelector("#closeForm");
const openBtn = document.querySelector("#cta__contact");

const modal = document.querySelector("#modal");

closeBtn.onclick = () => modal.classList.add("hide");

openBtn.onclick = () => {
  modal.classList.remove("hide");

  // Remove any possible previous errors
  showFormError("");

  // Put the cursor in the email input field
  document.querySelector("#modal #email").focus();
};

document.addEventListener("keyup", e => {
  // Close the modal on escape
  if (e.code === "Escape") {
    closeBtn.click();
  }
});

let pending = false;

sendBtn.onclick = () => {
  const data = validate(getFormData());
  console.log("data :>> ", data);
  // Don't send if data invalid.
  if (data.error) {
    return showFormError(data.message);
  }
  // Don't double send
  if (pending) return;

  // Close the message form
  closeBtn.click();
  pending = true;
  sendMail(data.validated)
    .then(response => {
      pending = false;
      if (response.ok) {
        // Message sent successfully
        displayFlash(
          flashType.SUCCESS,
          "Message sent successfully. Thank you for your message."
        );

        resetForm();
      } else {
        // Error with the mail api
        // Display error message
        displayFlash(
          flashType.DANGER,
          "Error while sending your message. Please send your message directly at corentin.briand@gmail.com"
        );
      }
    })
    .catch(() => {
      // Possible network error
      displayFlash(
        flashType.DANGER,
        "Error while sending your message. Please send your message directly at corentin.briand@gmail.com"
      );
    });
};

function getFormData() {
  const email = document.querySelector("#modal #email").value;
  const subject = document.querySelector("#modal #subject").value;
  const message = document.querySelector("#modal #message").value;
  return {
    sender: email,
    subject,
    message,
  };
}
function resetForm() {
  document.querySelector("#modal #email").value = "";
  document.querySelector("#modal #subject").value = "";
  document.querySelector("#modal #message").value = "";
}

function validate(data) {
  const { sender, subject, message } = data;

  if (!(sender.trim() && subject.trim() && message.trim())) {
    return {
      error: true,
      message: "Error : Please fill out all fields",
    };
  }

  // https://ihateregex.io/expr/email/
  // (group)@(group).(group) with no @, empty space, or tab, or new line in every group
  const mailRE = new RegExp("[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+");
  if (!mailRE.test(sender)) {
    return {
      error: true,
      message: "Error : Invalid Email Adress",
    };
  }

  return {
    error: false,
    validated: data,
  };
}

function showFormError(message) {
  let errorDisplay = document.querySelector("#form__error");
  errorDisplay.textContent = message;
}

function displayFlash(type, message) {
  flashDisp.textContent = message;

  flash.classList.remove("hide");
  flash.classList.add(type);
}

flashClose.onclick = () => flash.classList.add("hide");
