// Sélection de l'élément paragraphe à partir du DOM en utilisant son ID
// document désigne l'objet DOM global qui représente toute la page HTML
// getElementById() est une méthode qui retourne l'élément avec l'ID spécifié
const paragraph = document.getElementById("paragraph");

// Sélection de l'élément bouton à partir du DOM en utilisant son ID
// Cette référence nous permettra d'ajouter des interactions dessus
const btn = document.getElementById("btn");

// Déclaration de la fonction qui sera exécutée lors du clic sur le bouton
// Cette fonction modifie l'apparence du paragraphe en manipulant ses classes CSS
function styliser() {
  // classList est une propriété qui permet de manipuler les classes d'un élément DOM
  // toggle() ajoute la classe si elle n'est pas présente, ou la supprime si elle l'est déjà
  // Cela permet de basculer entre les styles "normal" et "bold" définis dans le CSS
  paragraph.classList.toggle("bold");
}

// Ajout d'un écouteur d'événement au bouton
// Le premier paramètre "click" spécifie le type d'événement à écouter
// Le second paramètre est la fonction à exécuter lorsque l'événement se produit
// Quand l'utilisateur clique sur le bouton, la fonction styliser() est appelée
btn.addEventListener("click", styliser);
