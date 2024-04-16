<!-- Gestion.vue -->

<template>
    <div>
      <h1>Gestion du collège</h1>
      <button @click="logout" class="logout-button">Déconnexion</button>
      <div>
        <!-- Ajoutez ici les composants pour gérer les enseignants -->
        <TeachersManagement />
      </div>
      <div>
        <!-- Ajoutez ici les composants pour gérer les classes -->
        <CoursManagement />
      </div>
    </div>
  </template>
  
  <script>
  // Importez ici les composants nécessaires
  import TeachersManagement from '../components/TeachersManagement.vue'
  import CoursManagement from '../components/CoursManagement.vue'
  
  export default {
    name: 'Gestion',
    components: {
      TeachersManagement,
      CoursManagement,
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
  padding: 100px; /* Assurer le même padding que dans le premier composant */
  background-color: #f4f4f4; /* Fond uniforme pour tous les conteneurs de gestion */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #005A9C; /* Utiliser la même couleur pour les titres */
  margin-bottom: 20px; /* Espacement conséquent pour harmoniser le titre */
}

.logout-button {
  background-color: #ff4d4d; /* Couleur rouge pour les boutons de déconnexion */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  float: right; /* Alignement à droite */
  margin-top: 10px; /* Espacement par rapport au haut */
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #d32f2f; /* Assombrissement pour le hover */
}

/* Sections pour enseignants et cours avec des styles similaires à ceux des élèves, enseignants, et classes */
div > div {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #e9ecef; /* Utiliser différentes nuances de gris pour distinguer les sections */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Boutons d'action uniformes à travers les composants */
.edit-button, .delete-button {
  padding: 5px 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #4CAF50; /* Vert pour modifier */
  color: white;
}

.edit-button:hover {
  background-color: #388E3C; /* Vert plus sombre pour hover */
}

.delete-button {
  background-color: #f44336; /* Rouge pour supprimer */
  color: white;
}

.delete-button:hover {
  background-color: #d32f2f; /* Rouge plus sombre pour hover */
}

/* Styles pour les formulaires, les inputs, et les boutons de soumission */
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
  background-color: #0056b3; /* Bleu pour les boutons d'ajout */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #004494; /* Bleu plus sombre pour hover */
}
</style>

  