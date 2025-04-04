// Sélection de l'élément div par son ID "container" dans le DOM
// Cette méthode renvoie l'élément DOM correspondant à l'ID spécifié
const container = document.getElementById("container");

// Fonction qui sera exécutée lorsque l'événement de clic est déclenché
// Cette fonction modifie l'apparence de l'élément en basculant une classe CSS
function ChangColor() {
  // toggle() ajoute la classe si elle n'est pas présente, ou la supprime si elle l'est déjà
  // Cette méthode permet de basculer facilement entre deux états visuels
  container.classList.toggle("mode-actif");
}

// Ajout d'un écouteur d'événement sur l'élément container
// Premier paramètre : type d'événement ("click")
// Second paramètre : fonction à exécuter (ChangColor)
// Quand l'utilisateur clique sur le container, la fonction ChangColor sera exécutée
container.addEventListener("click", ChangColor);
