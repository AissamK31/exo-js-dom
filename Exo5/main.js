let modal = document.getElementById("modal");
let openModal = document.getElementById("openModal");

openModal.addEventListener("click", () => {
  modal.style.display = "block";
});

let closeModal = document.getElementById("fermer");

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
