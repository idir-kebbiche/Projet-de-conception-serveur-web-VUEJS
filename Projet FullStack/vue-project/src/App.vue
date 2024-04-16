<template>
  <div>
    <nav class="main-nav">
      <ul class="nav-list">
        <li class="nav-item"><router-link to="/" class="nav-link">Accueil</router-link></li>
        <li class="nav-item" v-if="!isLoggedIn"><router-link to="/connexion" class="nav-link">Connexion</router-link></li>
        <li class="nav-item"><router-link to="/etudiant" class="nav-link">Gestion des étudiants et des classes</router-link></li>
        <li class="nav-item"><router-link to="/enseignant" class="nav-link">Gestion des enseignants et des cours</router-link></li>
        <li class="nav-item"><router-link to="/note" class="nav-link">Gestion des Notes et des Résultats</router-link></li>
        <li class="nav-item"><router-link to="/examen" class="nav-link">Gestion des examens et des absences</router-link></li>
        <li class="nav-item"><router-link to="/emploidutemps" class="nav-link">Gestion des Emplois du Temps et du Matériel</router-link></li>
      </ul>
    </nav>
    <router-view @login="handleLogin" @logout="logout"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      welcomeMessage: ''
    }
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
  },
  methods: {
    handleLogin() {
      localStorage.setItem('isLoggedIn', 'true');
      this.welcomeMessage = 'Bienvenue !';
    },
    logout() {
      localStorage.setItem('isLoggedIn', 'false');
      this.welcomeMessage = '';
    }
  }
}
</script>


<style src="./assets/style.css"></style>