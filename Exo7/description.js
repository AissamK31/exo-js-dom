/**
 * description.js - Traitement des paramètres d'URL et mise à jour de l'interface
 *
 * Ce script récupère les données transmises via l'URL et met à jour dynamiquement
 * le contenu de la page de description du produit. Il illustre la communication
 * entre pages via les paramètres d'URL (query string).
 *
 * Méthodes principales utilisées :
 * - URLSearchParams() : Constructeur qui crée un objet permettant de travailler facilement
 *   avec les paramètres d'une URL. Simplifie considérablement l'extraction des données.
 * - get() : Méthode de URLSearchParams qui retourne la première valeur associée au paramètre donné.
 *   Retourne null si le paramètre n'existe pas.
 * - getElementById() : Méthode du DOM qui retourne l'élément avec l'identifiant spécifié.
 *   Méthode rapide et directe pour accéder à un élément unique.
 * - textContent : Propriété qui permet de lire ou définir le contenu textuel d'un élément
 *   sans interpréter le HTML (contrairement à innerHTML).
 * - Template literals (backticks `) : Syntaxe ES6 qui permet l'interpolation de variables
 *   directement dans les chaînes de caractères avec ${variable}.
 */

// Création d'une instance de URLSearchParams qui facilite l'extraction des paramètres
// Cette approche moderne est préférable à l'analyse manuelle de la chaîne de requête
const urlParams = new URLSearchParams(window.location.search);

// Extraction du paramètre 'produit' de l'URL
// Si le paramètre n'existe pas, get() retournera null
const productTitle = urlParams.get("produit");

/**
 * Mise à jour conditionnelle du contenu de la page
 * Cette logique permet de gérer élégamment le cas où le paramètre serait absent
 */
if (productTitle) {
  // Mise à jour du titre affiché dans la page
  document.getElementById("product-title").textContent = productTitle;

  // Mise à jour dynamique du titre de l'onglet/fenêtre du navigateur
  // Cela améliore l'expérience utilisateur et le référencement SEO
  document.title = `${productTitle} - MakersBrico`;
} else {
  // Message par défaut en cas d'absence du paramètre
  // Cela évite une interface vide et informe l'utilisateur du problème
  document.getElementById("product-title").textContent = "Produit non spécifié";
}
