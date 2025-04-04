const loginForm = document.querySelector("#login");
const emailEl = document.querySelector("#login-email");
const passwordEl = document.querySelector("#login-password");

// Fonction pour vérifier si le champ est vide
const isRequired = (value) => (value === "" ? false : true);

// Validation de l'email
const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

// Afficher les erreurs
const showError = (input, message) => {
  const formField = input.parentElement;
  formField.classList.remove("success");
  formField.classList.add("error");
  const error = formField.querySelector("small");
  error.textContent = message;
};

// Afficher le succès
const showSuccess = (input) => {
  const formField = input.parentElement;
  formField.classList.remove("error");
  formField.classList.add("success");
  const error = formField.querySelector("small");
  error.textContent = "";
};

// Vérifier l'email
const checkEmail = () => {
  let valid = false;
  const email = emailEl.value.trim();
  if (!isRequired(email)) {
    showError(emailEl, "Le champ email ne peut être vide");
  } else if (!validateEmail(email)) {
    showError(emailEl, "L'adresse email n'est pas valide");
  } else {
    showSuccess(emailEl);
    valid = true;
  }
  return valid;
};

// Vérifier le mot de passe
const checkPassword = () => {
  let valid = false;
  const password = passwordEl.value.trim();
  if (!isRequired(password)) {
    showError(passwordEl, "Le mot de passe ne peut être vide");
  } else {
    showSuccess(passwordEl);
    valid = true;
  }
  return valid;
};

// Événement de soumission du formulaire
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Valider les champs
  let isEmailValid = checkEmail();
  let isPasswordValid = checkPassword();
  let isFormValid = isEmailValid && isPasswordValid;

  if (isFormValid) {
    // Vérifier les identifiants
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Stockage de l'information de connexion
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: user.email,
          username: user.username,
          isLoggedIn: true,
          loginTime: new Date().toISOString(),
        })
      );

      alert("Connexion réussie!");
      // Redirection vers le dashboard
      window.location.href = "dashboard.html";
    } else {
      alert("Email ou mot de passe incorrect!");
    }
  }
});
