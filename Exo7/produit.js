/**
 * produit.js - Gestion des interactions utilisateur sur la page des produits
 *
 * Ce script gère les redirections lorsqu'un utilisateur clique sur les boutons
 * "Description" ou "Ajouter au panier" pour chaque produit affiché.
 * Il utilise la délégation d'événements pour attacher des écouteurs à chaque bouton
 * et transmet les données pertinentes via les paramètres d'URL.
 *
 * Méthodes principales utilisées :
 * - querySelectorAll() : Sélectionne tous les éléments correspondant au sélecteur CSS spécifié
 *   et retourne une NodeList statique (ne se met pas à jour automatiquement)
 * - forEach() : Méthode d'itération qui exécute une fonction sur chaque élément d'un tableau ou NodeList
 * - addEventListener() : Attache une fonction de gestionnaire d'événement à un élément spécifique
 * - closest() : Cherche l'ancêtre le plus proche qui correspond au sélecteur CSS fourni
 * - querySelector() : Sélectionne le premier élément qui correspond au sélecteur CSS spécifié
 * - textContent : Propriété qui représente le contenu textuel d'un nœud et de ses descendants
 * - encodeURIComponent() : Encode un composant d'URI en échappant les caractères spéciaux
 * - window.location.href : Propriété qui contient l'URL complète de la page courante et permet la redirection
 */

// Sélection des éléments DOM en utilisant les sélecteurs de classe
// Cela permet de cibler plusieurs éléments partageant la même classe
const descriptionButtons = document.querySelectorAll(".btn-description");
const ajouterPanierButtons = document.querySelectorAll(".btn-ajouter-panier");

/**
 * Gestion des boutons "Description"
 * Pour chaque bouton trouvé, on attache un écouteur d'événement qui sera
 * déclenché lors du clic utilisateur
 */
descriptionButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Utilisation de closest() pour remonter au parent ayant la classe "card"
    // Cette technique est plus robuste que de naviguer avec parentNode
    const productCard = this.closest(".card");

    // Extraction du titre du produit depuis l'élément h3 de la carte
    const productTitle = productCard.querySelector("h3").textContent;

    // Redirection vers la page de description avec transmission du titre via l'URL
    // encodeURIComponent() assure que les caractères spéciaux sont correctement encodés
    window.location.href = `description.html?produit=${encodeURIComponent(
      productTitle
    )}`;
  });
});

/**
 * Gestion des boutons "Ajouter au panier"
 * Même principe que pour les boutons de description, mais avec transmission
 * de données supplémentaires (prix)
 */
ajouterPanierButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const productCard = this.closest(".card");

    // Extraction des données nécessaires à la commande
    const productTitle = productCard.querySelector("h3").textContent;
    const productPrice = productCard.querySelector(".prix p").textContent;

    // Redirection avec transmission de plusieurs paramètres via l'URL
    // On utilise le format standard param1=valeur1&param2=valeur2
    window.location.href = `commande.html?produit=${encodeURIComponent(
      productTitle
    )}&prix=${encodeURIComponent(productPrice)}`;
  });
});
