const defaultUser = {
  username: "p",
  password: "testuser",
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  birthDate: "01-01-2000"
};

let users = JSON.parse(localStorage.getItem("users")) || [];

// Ensure default user is always present
const defaultExists = users.some(user => user.username === defaultUser.username);
if (!defaultExists) {
  users.push(defaultUser);
  localStorage.setItem("users", JSON.stringify(users));
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(div => div.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Populate birth date dropdowns
window.onload = () => {
  const daySelect = document.querySelector("select[name='day']");
  const monthSelect = document.querySelector("select[name='month']");
  const yearSelect = document.querySelector("select[name='year']");

  for (let i = 1; i <= 31; i++) {
    const opt = document.createElement('option');
    opt.value = opt.textContent = i;
    daySelect.appendChild(opt);
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  months.forEach((month, i) => {
    const opt = document.createElement('option');
    opt.value = i + 1;
    opt.textContent = month;
    monthSelect.appendChild(opt);
  });

  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 100; i++) {
    const year = currentYear - i;
    const opt = document.createElement('option');
    opt.value = opt.textContent = year;
    yearSelect.appendChild(opt);
  }
}

function togglePassword(fieldId, button) {
  const field = document.getElementById(fieldId);
  const eyeOpen = button.querySelector(".eye-open");
  const eyeClosed = button.querySelector(".eye-closed");

  const isHidden = field.type === "password";
  field.type = isHidden ? "text" : "password";

  eyeOpen.style.display = isHidden ? "none" : "inline";
  eyeClosed.style.display = isHidden ? "inline" : "none";
}

// Register form
document.getElementById("form-register").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = this.querySelector("input[placeholder='Username']").value;
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-confirm-password").value;
  const firstName = this.querySelector("input[placeholder='First Name']").value;
  const lastName = this.querySelector("input[placeholder='Last Name']").value;
  const email = this.querySelector("input[placeholder='Email']").value;
  const day = this.querySelector("select[name='day']").value;
  const month = this.querySelector("select[name='month']").value;
  const year = this.querySelector("select[name='year']").value;

  // Check if username exists
  if (users.some(user => user.username === username)) {
    const confirmField = document.getElementById("reg-username");
    confirmField.setCustomValidity("This username is already taken.");
    confirmField.reportValidity();
    setTimeout(() => confirmField.setCustomValidity(""), 3000);
    return;
  }

  // ✅ Check password strength
  const isValidLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!isValidLength || !hasLetter || !hasNumber) {
    const confirmField = document.getElementById("reg-password");
    confirmField.setCustomValidity("Must be at least 8 characters long and contain both letters and numbers.");
    confirmField.reportValidity();
    setTimeout(() => confirmField.setCustomValidity(""), 3000);
    return;
  }

  if (password !== confirmPassword) {
    const confirmField = document.getElementById("reg-confirm-password");
    confirmField.setCustomValidity("Passwords do not match");
    confirmField.reportValidity();
    setTimeout(() => confirmField.setCustomValidity(""), 3000);
    return;
  }

  const newUser = {
    username,
    password,
    firstName,
    lastName,
    email,
    birthDate: `${day}-${month}-${year}`
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert(`User "${username}" registered successfully!`);
  this.reset();
  showScreen("login-form");
});

// Login form
document.getElementById("form-login").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = this.querySelector("input[placeholder='Username']").value;
  const password = this.querySelector("input[placeholder='Password']").value;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    alert(`Welcome back, ${user.firstName}!`);
    showScreen("config-screen");
    document.getElementById("logout-bar").style.display = "block";
  } else {
    alert("Incorrect username or password.");
  }
});

function logout() {
  showScreen("welcome");
  document.getElementById("logout-bar").style.display = "none";
}
