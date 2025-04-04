/**
 * commande.js - Gestion du formulaire de commande et traitement des paramètres
 *
 * Ce script remplit deux fonctions principales :
 * 1. Récupérer et afficher les informations de produit transmises via l'URL
 * 2. Gérer la soumission du formulaire de commande
 *
 * Il démontre la communication entre pages et la gestion d'événements de formulaire.
 *
 * Méthodes principales utilisées :
 * - URLSearchParams() : Constructeur qui crée un objet facilitant la manipulation des paramètres d'URL.
 *   Approche moderne qui remplace les méthodes manuelles de parsing d'URL.
 * - get() : Méthode de URLSearchParams qui extrait la valeur d'un paramètre spécifique.
 *   Gère bien les cas où le paramètre est absent (retourne null).
 * - getElementById() : Méthode du DOM qui accède directement à un élément via son attribut id.
 *   Plus performante que querySelector() quand on cible un id.
 * - textContent : Propriété pour manipuler le contenu textuel d'un élément.
 *   Plus sécurisée que innerHTML car elle n'interprète pas le HTML.
 * - addEventListener() : Méthode qui attache une fonction de rappel à un événement sur un élément.
 *   Permet une programmation événementielle non intrusive.
 * - preventDefault() : Méthode qui bloque le comportement par défaut d'un événement.
 *   Essentielle pour contrôler le processus de soumission d'un formulaire.
 * - alert() : Méthode qui affiche une boîte de dialogue modale avec un message.
 *   Utile pour les retours utilisateur simples (à remplacer par une UI plus élégante en production).
 * - window.location.href : Propriété qui permet de lire l'URL courante ou de rediriger l'utilisateur.
 *   Utilisée ici pour la navigation après traitement.
 * - Template literals (backticks `) : Syntaxe ES6 pour créer des chaînes avec interpolation de variables.
 */

// Extraction des paramètres de l'URL
const urlParams = new URLSearchParams(window.location.search);

// Récupération des données du produit transmises depuis la page précédente
const productTitle = urlParams.get("produit");
const productPrice = urlParams.get("prix");

/**
 * Mise à jour de l'interface avec les informations du produit
 * Cette section utilise une approche défensive avec vérification
 * des paramètres avant utilisation
 */

// Affichage du titre du produit avec gestion du cas où le paramètre est absent
if (productTitle) {
  // Template literals (`) permettant d'insérer des variables dans une chaîne
  document.getElementById(
    "product-title"
  ).textContent = `Produit : ${productTitle}`;
} else {
  // Message par défaut en cas d'absence du paramètre
  document.getElementById("product-title").textContent =
    "Produit : Non spécifié";
}

// Affichage du prix avec la même logique de gestion d'erreur
if (productPrice) {
  document.getElementById(
    "product-price"
  ).textContent = `Prix : ${productPrice}`;
} else {
  document.getElementById("product-price").textContent = "Prix : Non spécifié";
}

/**
 * Gestion de la soumission du formulaire
 *
 * La méthode addEventListener attache un gestionnaire d'événement qui sera
 * exécuté lorsque le formulaire est soumis (événement 'submit')
 */
document
  .getElementById("order-form")
  .addEventListener("submit", function (event) {
    // Empêche le comportement par défaut (rechargement de la page)
    // Cela permet de contrôler entièrement le processus de soumission
    event.preventDefault();

    // Affichage d'une confirmation à l'utilisateur
    // Note: Dans une application réelle, on effectuerait ici une requête AJAX
    // pour envoyer les données au serveur avant de confirmer la commande
    alert("Commande confirmée! Merci pour votre achat.");

    // Redirection après le traitement de la commande
    // Retour à la page des produits pour permettre d'autres achats
    window.location.href = "produit.html";
  });
