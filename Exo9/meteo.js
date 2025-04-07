/**
 * APPLICATION MÉTÉO
 *
 * Ce script permet de récupérer et afficher les informations météorologiques
 * d'une ville en utilisant l'API OpenWeatherMap.
 *
 * Concepts abordés:
 * - Événements et écouteurs d'événements
 * - Fonctions asynchrones (async/await)
 * - Appels d'API avec fetch
 * - Manipulation du DOM
 * - Gestion des erreurs (try/catch)
 */

// Attendre que le document HTML soit complètement chargé avant d'exécuter le code
// C'est une bonne pratique pour s'assurer que tous les éléments HTML sont disponibles
document.addEventListener("DOMContentLoaded", () => {
  // Variables et constantes
  const apiKey = "31690f4eaf1d7d0d5ec9d82798c16bde"; // Clé API pour accéder au service OpenWeatherMap

  // Sélection des éléments HTML que nous allons manipuler
  const weatherResult = document.getElementById("weather-result"); // Élément où afficher les résultats
  const getWeatherBtn = document.getElementById("get-weather"); // Bouton pour déclencher la recherche
  const cityInput = document.getElementById("city-input"); // Champ de saisie pour la ville

  // Ajout d'un écouteur d'événement sur le bouton
  // Quand l'utilisateur clique, la fonction anonyme async est exécutée
  getWeatherBtn.addEventListener("click", async () => {
    // Récupération et nettoyage de la valeur saisie par l'utilisateur
    // trim() supprime les espaces en début et fin de chaîne
    const city = cityInput.value.trim();

    // Vérification si l'utilisateur a bien saisi une ville
    if (!city) {
      // Si le champ est vide, afficher un message d'erreur
      weatherResult.textContent = "Veuillez entrer le nom d'une ville.";
      return; // Arrêter l'exécution de la fonction
    }

    // Utilisation de try/catch pour gérer les erreurs potentielles
    try {
      // Appel à l'API météo avec fetch (fonction moderne pour les requêtes HTTP)
      // La syntaxe await permet d'attendre la réponse avant de continuer
      const response = await fetch(
        // Construction de l'URL de l'API avec les paramètres nécessaires:
        // - q: nom de la ville
        // - units: unité de mesure (metric pour °C)
        // - lang: langue pour les descriptions (fr pour français)
        // - appid: clé API pour l'authentification
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`
      );

      // Vérification si la réponse est valide (code HTTP 200-299)
      if (!response.ok)
        throw new Error("Ville introuvable ou problème avec l'API.");

      // Conversion de la réponse en objet JavaScript (format JSON)
      const data = await response.json();

      // Mise à jour de l'interface utilisateur avec les données météo
      // innerHTML permet d'insérer du HTML formaté
      // Les backticks (`) permettent d'utiliser des variables dans une chaîne (template literals)
      weatherResult.innerHTML = `
                <h2>Météo à ${data.name}</h2>
                <p>Température : ${data.main.temp}°C</p>
                <p>Conditions : ${data.weather[0].description}</p>
            `;
    } catch (error) {
      // En cas d'erreur, afficher un message à l'utilisateur
      weatherResult.textContent =
        "Erreur : Ville introuvable ou problème avec l'API.";
      // Et enregistrer l'erreur détaillée dans la console pour le développeur
      // C'est utile pour le débogage mais invisible pour l'utilisateur
      console.error(error.message);
    }
  });
});
