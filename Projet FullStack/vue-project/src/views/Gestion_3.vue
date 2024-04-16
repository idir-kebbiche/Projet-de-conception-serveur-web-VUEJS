<!-- Gestion.vue -->

<template>
    <div>
      <h1>Gestion du collège</h1>
      <button @click="logout" class="logout-button">Déconnexion</button>
      <div>
        <!-- Ajoutez ici les composants pour gérer les enseignants -->
        <NotesManagement />
      </div>
      <div>
        <!-- Ajoutez ici les composants pour gérer les classes -->
        <RésultatsManagement />
      </div>
    </div>
  </template>
  
  <script>
  // Importez ici les composants nécessaires
  import NotesManagement from '../components/NotesManagement.vue'
  import RésultatsManagement from '../components/RésultatsManagement.vue'
  
  export default {
    name: 'Gestion',
    components: {
        NotesManagement,
        RésultatsManagement,
    },
    methods: {
      logout() {
        localStorage.removeItem('userToken'); // Supprime le token du localStorage
        this.$router.push('/connexion'); // Redirige vers la page de connexion
      }
    }
  }
  </script>
  
  
  <style scoped>
div {
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: auto;
  padding: 100px; /* Espacement intérieur pour un alignement cohérent */
  background-color: #f4f4f4; /* Couleur de fond pour tous les conteneurs de gestion */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #005A9C; /* Utilisation d'un bleu standard pour les titres */
  margin-bottom: 20px; /* Espacement sous le titre pour une séparation claire */
}

.logout-button {
  background-color: #ff4d4d; /* Bouton de déconnexion en rouge pour une identification facile */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  float: right; /* Alignement à droite pour le bouton de déconnexion */
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #d32f2f; /* Assombrissement lors du survol */
}

div > div {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #e9ecef; /* Fond légèrement différent pour chaque section de gestion */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.edit-button, .delete-button {
  padding: 5px 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #4CAF50; /* Vert pour les actions modifier */
  color: white;
}

.edit-button:hover {
  background-color: #388E3C; /* Vert plus sombre au survol */
}

.delete-button {
  background-color: #f44336; /* Rouge pour les actions supprimer */
  color: white;
}

.delete-button:hover {
  background-color: #d32f2f; /* Rouge plus sombre au survol */
}

.form {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

.input, .select {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #0056b3; /* Bleu pour les boutons de soumission */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #004494; /* Bleu plus sombre au survol */
}
</style>

  