// Sélection de l'élément bouton par son ID dans le DOM
let btn = document.getElementById("btn");

// Fonction qui gère le changement de mode (clair/sombre)
function darkMode() {
  // Sélection de l'élément body dans le DOM
  let element = document.body;

  // Toggle permet d'ajouter/supprimer la classe 'dark-mode'
  // Si la classe existe, elle est supprimée
  // Si la classe n'existe pas, elle est ajoutée
  element.classList.toggle("dark-mode");
}

// Ajout d'un écouteur d'événement sur le document
// Il écoute les clics n'importe où sur la page
document.addEventListener("click", darkMode);
