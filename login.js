const passwordInput = document.getElementById("password");
const togglePasswordVisibilityButton = document.querySelector(
  "#toggle-password-visibility"
);

function handleFormSubmit(event) {
  event.preventDefault();

  const password = passwordInput.value.trim();
  const username = document.querySelector("#username").value.trim();

  if (username === "" && password === "") {
    showCustomAlert("Please enter your password!");
  } else if (username.length > 0 && password === "") {
    showCustomAlert(
      "Please enter only the password and leave the username blank!"
    );
    console.log("Please enter only the password and leave the username blank!");
  } else if (username === "" && password === "password123") {
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 10);
  } else {
    showCustomAlert("Incorrect password!");

    console.log("Typed password is: " + password);
    console.log("Username should be empty, you typed this: " + username);
  }
  passwordInput.value = "";
  document.querySelector("#username").value = "";
  event.stopPropagation();

  return false;
}

passwordInput.focus();

if (togglePasswordVisibilityButton) {
  togglePasswordVisibilityButton.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePasswordVisibilityButton
        .querySelector("i")
        .classList.remove("fa-eye");
      togglePasswordVisibilityButton
        .querySelector("i")
        .classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      togglePasswordVisibilityButton
        .querySelector("i")
        .classList.remove("fa-eye-slash");
      togglePasswordVisibilityButton.querySelector("i").classList.add("fa-eye");
    }
  });
}

const form = document.querySelector("form");
form.addEventListener("submit", handleFormSubmit);

function showCustomAlert(message) {
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("custom-alert");
  const alertMessage = document.createElement("p");
  alertMessage.textContent = message;
  alertDiv.appendChild(alertMessage);

  const okayButton = document.createElement("button");
  okayButton.textContent = "Okay";
  okayButton.classList.add("custom-alert-button");
  okayButton.style.backgroundColor = "#fff";
  okayButton.style.color = "#fd7e14";
  okayButton.style.borderRadius = "10px";
  okayButton.style.boxShadow = "0 0 0 2px #ffffff, 0 0 0 4px #fd7e14";
  okayButton.style.border = "none";

  okayButton.addEventListener("mouseover", () => {
    okayButton.style.backgroundColor = "#fd7e14";
    okayButton.style.color = "#ffffff";
  });

  okayButton.addEventListener("mouseout", () => {
    okayButton.style.backgroundColor = "#ffffff";
    okayButton.style.color = "#fd7e14";
  });

  okayButton.addEventListener("click", () => {
    hideCustomAlert();
  });

  okayButton.addEventListener("focus", function (event) {
    setTimeout(() => {
      const keyboardEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        code: "Tab",
      });
      event.target.dispatchEvent(keyboardEvent);
    }, 0);
  });

  okayButton.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      okayButton.classList.add("button-active");
      okayButton.style.backgroundColor = "#fd7e14";
      okayButton.style.color = "#ffffff";
      okayButton.style.borderRadius = "10px";
      okayButton.style.boxShadow = "0 0 0 2px #ffffff, 0 0 0 4px #fd7e14";
      okayButton.style.border = "none";
    }
  });

  alertDiv.addEventListener("click", (event) => {
    event.preventDefault();
    okayButton.focus();
  });

  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (event) => {
    event.preventDefault();
    okayButton.focus();
  });

  alertDiv.appendChild(okayButton);
  document.body.appendChild(alertDiv);
  okayButton.focus();
}

function hideCustomAlert() {
  const alertDiv = document.querySelector(".custom-alert");
  if (alertDiv) {
    alertDiv.remove();
  }

  const overlay = document.querySelector(".overlay");
  if (overlay) {
    overlay.remove();
  }
}
