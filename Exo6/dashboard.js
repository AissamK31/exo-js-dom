document.addEventListener("DOMContentLoaded", function () {
  const authContent = document.getElementById("auth-content");

  // Vérifier si l'utilisateur est connecté
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && currentUser.isLoggedIn) {
    // Utilisateur connecté - afficher les informations
    displayUserInfo(currentUser);
  } else {
    // Utilisateur non connecté - afficher un message
    displayLoginRequired();
  }

  // Fonction pour afficher les informations de l'utilisateur
  function displayUserInfo(user) {
    const loginDate = new Date(user.loginTime);
    const formattedDate = `${loginDate.toLocaleDateString()} à ${loginDate.toLocaleTimeString()}`;

    authContent.innerHTML = `
      <h1>Tableau de bord</h1>
      <div class="user-info">
        <h2>Bienvenue, ${user.username}</h2>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Dernière connexion:</strong> ${formattedDate}</p>
      </div>
      <button id="logout-btn" class="logout-btn">Se déconnecter</button>
    `;

    // Ajouter l'événement de déconnexion
    document
      .getElementById("logout-btn")
      .addEventListener("click", function () {
        // Supprimer les informations de l'utilisateur connecté
        localStorage.removeItem("currentUser");
        // Rediriger vers la page de connexion
        window.location.href = "login.html";
      });
  }

  // Fonction pour afficher le message de connexion requise
  function displayLoginRequired() {
    authContent.innerHTML = `
      <div class="auth-required">
        <h2>Accès restreint</h2>
        <p>Vous devez être connecté pour accéder à cette page.</p>
      </div>
      <a href="login.html" class="login-link">Se connecter</a>
    `;
  }
});
