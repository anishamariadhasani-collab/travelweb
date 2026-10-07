document.addEventListener("DOMContentLoaded", function () {
  const loginTab = document.getElementById("login-tab");
  const signupTab = document.getElementById("signup-tab");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  if (!loginForm || !signupForm) return;

  function showForm(mode) {
    const signup = mode === "signup";
    loginForm.style.display = signup ? "none" : "block";
    signupForm.style.display = signup ? "block" : "none";
    loginTab.classList.toggle("active", !signup);
    signupTab.classList.toggle("active", signup);
  }

  loginTab.addEventListener("click", () => showForm("login"));
  signupTab.addEventListener("click", () => showForm("signup"));

  signupForm.addEventListener("submit", event => {
    event.preventDefault();
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("confirm-password").value;
    if (password !== confirm) { alert("Password does not match."); return; }
    const email = document.getElementById("signup-email").value.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem("jerryTravelUsers") || "{}");
    if (users[email]) { alert("This email already has an account. Please log in."); showForm("login"); return; }
    users[email] = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      password
    };
    localStorage.setItem("jerryTravelUsers", JSON.stringify(users));
    alert("Account created. Please log in.");
    document.getElementById("login-email").value = email;
    showForm("login");
  });

  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;
    const users = JSON.parse(localStorage.getItem("jerryTravelUsers") || "{}");
    const user = users[email];
    if (!user || user.password !== password) { alert("Wrong email or password."); return; }
    localStorage.setItem("jerryTravelUser", JSON.stringify({ name: user.name, email }));
    localStorage.setItem("email", email);
    localStorage.setItem("name", user.name);
    alert("Login successful!");
    const params = new URLSearchParams(location.search);
    const packageName = params.get("package") || "";
    location.href = params.get("next") === "booking"
      ? "booking.html?package=" + encodeURIComponent(packageName)
      : "index.html";
  });

  showForm("login");
});
