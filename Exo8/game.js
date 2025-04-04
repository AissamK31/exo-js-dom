/**
 * QUIZ DES DRAPEAUX - LOGIQUE DU JEU
 *
 * Ce script gère toute la logique de l'application:
 * - Authentification des utilisateurs
 * - Récupération des drapeaux depuis une API
 * - Mécanique de jeu (affichage, vérification, timer)
 * - Gestion des scores et du classement
 */

// Attendre que le DOM soit complètement chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", () => {
  // ======= SÉLECTION DES ÉLÉMENTS DU DOM =======
  // Récupération des écrans principaux
  const authScreen = document.getElementById("auth-screen"); // Écran d'authentification
  const gameScreen = document.getElementById("game-screen"); // Écran de jeu
  const resultsScreen = document.getElementById("results-screen"); // Écran des résultats

  // Récupération des formulaires d'authentification
  const loginForm = document.querySelector(".auth-form"); // Premier formulaire (connexion)
  const registerForm = document.querySelectorAll(".auth-form")[1]; // Second formulaire (inscription)

  // Liens pour basculer entre les formulaires
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");

  // Boutons d'authentification
  const loginBtn = document.getElementById("login-btn"); // Bouton de connexion
  const registerBtn = document.getElementById("register-btn"); // Bouton d'inscription

  // Éléments de l'écran de jeu
  const timeDisplay = document.getElementById("time"); // Affichage du temps restant
  const scoreDisplay = document.getElementById("current-score"); // Affichage du score actuel
  const flagImg = document.getElementById("flag-img"); // Image du drapeau
  const countryInput = document.getElementById("country-input"); // Champ de saisie du pays
  const submitAnswerBtn = document.getElementById("submit-answer"); // Bouton de validation
  const feedbackDisplay = document.getElementById("feedback"); // Zone de feedback

  // Éléments de l'écran des résultats
  const finalScoreDisplay = document.getElementById("final-score"); // Score final
  const leaderboardBody = document.getElementById("leaderboard-body"); // Corps du tableau de classement
  const playAgainBtn = document.getElementById("play-again"); // Bouton rejouer
  const logoutBtn = document.getElementById("logout-btn"); // Bouton déconnexion

  // ======= VARIABLES DU JEU =======
  let countries = []; // Liste de tous les pays disponibles
  let currentGameCountries = []; // 10 pays sélectionnés pour la partie en cours
  let currentCountryIndex = 0; // Index du pays actuel dans la partie
  let score = 0; // Score du joueur (nombre de bonnes réponses)
  let timer; // Référence au timer pour pouvoir l'arrêter
  let timeLeft = 20; // Temps restant en secondes pour répondre
  let currentUser = null; // Utilisateur connecté actuellement

  // URL de l'API qui fournit les données sur les pays
  const API_URL = "https://restcountries.com/v3.1/all";

  // ======= NAVIGATION ENTRE LES FORMULAIRES =======

  // Affiche le formulaire d'inscription quand on clique sur "S'inscrire"
  showRegisterLink.addEventListener("click", (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du lien (navigation)
    loginForm.style.display = "none"; // Cache le formulaire de connexion
    registerForm.style.display = "block"; // Affiche le formulaire d'inscription
  });

  // Affiche le formulaire de connexion quand on clique sur "Se connecter"
  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    registerForm.style.display = "none"; // Cache le formulaire d'inscription
    loginForm.style.display = "block"; // Affiche le formulaire de connexion
  });

  // ======= GESTION DE L'INSCRIPTION =======
  registerBtn.addEventListener("click", () => {
    // Récupère et nettoie les valeurs des champs
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();

    // Validation basique des champs
    if (!username || !password) {
      alert("Veuillez remplir tous les champs");
      return; // Arrête l'exécution de la fonction
    }

    // Récupère les utilisateurs existants depuis le localStorage ou crée un tableau vide
    // localStorage est une API du navigateur qui permet de stocker des données localement
    const users = JSON.parse(localStorage.getItem("flagQuizUsers")) || [];

    // Vérifie si le nom d'utilisateur existe déjà
    if (users.some((user) => user.username === username)) {
      alert("Ce nom d'utilisateur est déjà pris");
      return;
    }

    // Ajoute le nouvel utilisateur à la liste
    users.push({ username, password, scores: [] });

    // Enregistre la liste mise à jour dans le localStorage
    // JSON.stringify convertit l'objet JavaScript en chaîne JSON
    localStorage.setItem("flagQuizUsers", JSON.stringify(users));

    // Notifie l'utilisateur et affiche le formulaire de connexion
    alert("Inscription réussie! Vous pouvez maintenant vous connecter.");
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  // ======= GESTION DE LA CONNEXION =======
  loginBtn.addEventListener("click", () => {
    // Récupère et nettoie les valeurs des champs
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    // Validation basique des champs
    if (!username || !password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // Récupère les utilisateurs existants
    const users = JSON.parse(localStorage.getItem("flagQuizUsers")) || [];

    // Recherche un utilisateur avec le nom et mot de passe correspondants
    // La méthode find() retourne le premier élément qui satisfait la condition
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    // Si aucun utilisateur n'est trouvé, affiche une erreur
    if (!user) {
      alert("Nom d'utilisateur ou mot de passe incorrect");
      return;
    }

    // Stocke l'utilisateur connecté et démarre le jeu
    currentUser = user;
    startGame();
  });

  // ======= DÉCONNEXION =======
  logoutBtn.addEventListener("click", () => {
    currentUser = null; // Réinitialise l'utilisateur connecté

    // Affiche l'écran d'authentification et cache les autres
    authScreen.style.display = "block";
    gameScreen.style.display = "none";
    resultsScreen.style.display = "none";
  });

  // ======= COMMENCER UNE NOUVELLE PARTIE =======
  playAgainBtn.addEventListener("click", startGame);

  // ======= RÉCUPÉRATION DES PAYS DEPUIS L'API =======
  // Fonction asynchrone qui récupère les données des pays
  async function fetchCountries() {
    try {
      // Requête HTTP vers l'API
      const response = await fetch(API_URL);

      // Vérifie si la réponse est valide
      if (!response.ok) throw new Error("Erreur de chargement des pays");

      // Convertit la réponse en objet JavaScript
      const data = await response.json();

      // Filtre les pays qui ont un drapeau et un nom, puis simplifie les données
      // Le ? est l'opérateur de chaînage optionnel qui évite les erreurs si la propriété n'existe pas
      return data
        .filter((country) => country.flags?.png && country.name?.common)
        .map((country) => ({
          name: country.name.common, // Extrait uniquement le nom commun
          flag: country.flags.png, // Et l'URL du drapeau
        }));
    } catch (error) {
      // Gestion des erreurs (ex: problème réseau)
      console.error("Erreur:", error);
      return []; // Retourne un tableau vide en cas d'erreur
    }
  }

  // ======= DÉMARRAGE D'UNE PARTIE =======
  async function startGame() {
    // Charge les pays depuis l'API si ce n'est pas déjà fait
    if (countries.length === 0) {
      countries = await fetchCountries();

      // Vérifie que les pays ont bien été chargés
      if (countries.length === 0) {
        alert("Impossible de charger les pays. Veuillez réessayer plus tard.");
        return;
      }
    }

    // Sélectionne aléatoirement 10 pays pour la partie
    currentGameCountries = [];

    // Mélange le tableau des pays de façon aléatoire
    // La méthode sort() avec une fonction qui retourne 0.5 - Math.random() mélange aléatoirement
    const shuffled = [...countries].sort(() => 0.5 - Math.random());

    // Prend les 10 premiers pays du tableau mélangé
    currentGameCountries = shuffled.slice(0, 10);

    // Réinitialise les variables de jeu
    currentCountryIndex = 0;
    score = 0;
    scoreDisplay.textContent = score;

    // Affiche l'écran de jeu et cache les autres
    authScreen.style.display = "none";
    gameScreen.style.display = "block";
    resultsScreen.style.display = "none";

    // Charge le premier pays
    loadNextCountry();
  }

  // ======= CHARGEMENT D'UN PAYS =======
  function loadNextCountry() {
    // Vérifie si tous les pays ont été joués
    if (currentCountryIndex >= currentGameCountries.length) {
      endGame(); // Termine la partie
      return;
    }

    // Récupère le pays actuel à deviner
    const currentCountry = currentGameCountries[currentCountryIndex];

    // Met à jour l'interface avec le drapeau du pays
    flagImg.src = currentCountry.flag;

    // Réinitialise le champ de saisie et le focus
    countryInput.value = "";
    countryInput.focus();

    // Efface le message de feedback précédent
    feedbackDisplay.textContent = "";
    feedbackDisplay.className = "feedback";

    // Réinitialise et démarre le timer
    clearInterval(timer); // Arrête un éventuel timer en cours
    timeLeft = 20; // Remet le temps à 20 secondes
    timeDisplay.textContent = timeLeft;
    timeDisplay.classList.remove("warning");

    // Démarre un nouveau timer
    timer = setInterval(() => {
      timeLeft--; // Décrémente le temps restant
      timeDisplay.textContent = timeLeft; // Met à jour l'affichage

      // Ajoute une classe d'alerte si le temps devient critique
      if (timeLeft <= 5) {
        timeDisplay.classList.add("warning");
      }

      // Si le temps est écoulé
      if (timeLeft <= 0) {
        clearInterval(timer); // Arrête le timer
        handleTimeOut(); // Gère la fin du temps
      }
    }, 1000); // Répète toutes les 1000ms (1 seconde)
  }

  // ======= GESTION DU TEMPS ÉCOULÉ =======
  function handleTimeOut() {
    // Affiche la réponse correcte
    feedbackDisplay.textContent = `Temps écoulé! La réponse était: ${currentGameCountries[currentCountryIndex].name}`;
    feedbackDisplay.className = "feedback incorrect";

    // Attend 2 secondes avant de passer au pays suivant
    setTimeout(() => {
      currentCountryIndex++; // Passe au pays suivant
      loadNextCountry(); // Charge le prochain pays
    }, 2000);
  }

  // ======= VÉRIFICATION DE LA RÉPONSE =======
  // Ajout d'un écouteur d'événement sur le bouton de validation
  submitAnswerBtn.addEventListener("click", checkAnswer);

  // Ajout d'un écouteur d'événement pour valider avec la touche Entrée
  countryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkAnswer();
  });

  function checkAnswer() {
    // Récupère et normalise la réponse de l'utilisateur
    const userAnswer = countryInput.value.trim().toLowerCase();

    // Récupère et normalise la réponse correcte
    const correctAnswer =
      currentGameCountries[currentCountryIndex].name.toLowerCase();

    // Arrête le timer
    clearInterval(timer);

    // Vérifie si la réponse est correcte
    if (userAnswer === correctAnswer) {
      // Si correct, incrémente le score et affiche un message positif
      score++;
      scoreDisplay.textContent = score;
      feedbackDisplay.textContent = "Correct!";
      feedbackDisplay.className = "feedback correct";
    } else {
      // Si incorrect, affiche la réponse correcte
      feedbackDisplay.textContent = `Incorrect! La réponse était: ${currentGameCountries[currentCountryIndex].name}`;
      feedbackDisplay.className = "feedback incorrect";
    }

    // Attend 2 secondes avant de passer au pays suivant
    setTimeout(() => {
      currentCountryIndex++; // Passe au pays suivant
      loadNextCountry(); // Charge le prochain pays
    }, 2000);
  }

  // ======= FIN DE LA PARTIE =======
  function endGame() {
    // Cache l'écran de jeu et affiche l'écran des résultats
    gameScreen.style.display = "none";
    resultsScreen.style.display = "block";

    // Affiche le score final
    finalScoreDisplay.textContent = score;

    // Sauvegarde le score si un utilisateur est connecté
    if (currentUser) {
      // Récupère la liste des utilisateurs
      const users = JSON.parse(localStorage.getItem("flagQuizUsers"));

      // Trouve l'indice de l'utilisateur actuel
      const userIndex = users.findIndex(
        (u) => u.username === currentUser.username
      );

      // Ajoute le nouveau score à l'historique de l'utilisateur
      users[userIndex].scores.push({
        score,
        date: new Date().toISOString(), // Ajoute la date actuelle au format ISO
      });

      // Trie les scores du plus élevé au plus bas
      users[userIndex].scores.sort((a, b) => b.score - a.score);

      // Limite à 10 meilleurs scores
      if (users[userIndex].scores.length > 10) {
        users[userIndex].scores = users[userIndex].scores.slice(0, 10);
      }

      // Enregistre les modifications dans le localStorage
      localStorage.setItem("flagQuizUsers", JSON.stringify(users));
    }

    // Met à jour le tableau des meilleurs scores
    updateLeaderboard();
  }

  // ======= MISE À JOUR DU CLASSEMENT =======
  function updateLeaderboard() {
    // Récupère tous les utilisateurs
    const users = JSON.parse(localStorage.getItem("flagQuizUsers")) || [];

    // Calcule le meilleur score pour chaque utilisateur
    // La méthode map() crée un nouveau tableau transformé
    const sortedUsers = users
      .map((user) => ({
        username: user.username,
        // Math.max(...array, 0) trouve la valeur maximale dans le tableau ou 0 si vide
        bestScore: Math.max(...user.scores.map((s) => s.score), 0),
      }))
      .sort((a, b) => b.bestScore - a.bestScore); // Trie par score décroissant

    // Vide le tableau existant
    leaderboardBody.innerHTML = "";

    // Affiche les 10 meilleurs joueurs
    sortedUsers.slice(0, 10).forEach((user, index) => {
      // Crée une nouvelle ligne de tableau
      const row = document.createElement("tr");

      // Met en évidence l'utilisateur actuel
      if (currentUser && user.username === currentUser.username) {
        row.classList.add("current-user");
      }

      // Remplit la ligne avec les données (position, nom, score)
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.bestScore}</td>
            `;

      // Ajoute la ligne au tableau
      leaderboardBody.appendChild(row);
    });
  }
});
