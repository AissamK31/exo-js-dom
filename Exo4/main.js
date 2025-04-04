const liste = document.getElementById("liste");
const btn = document.getElementById("btn");
const btn2 = document.getElementById("btn2");

function supprimer() {
  if (liste.lastChild) {
    liste.removeChild(liste.lastChild);
  }
}

btn2.addEventListener("click", supprimer);

function ajouter() {
  liste.appendChild(document.createElement("li"));
}

btn.addEventListener("click", ajouter);
