<template>
  <div class="connexion-container">
    <!-- Message de bienvenue qui s'affiche seulement si isConnected est vrai -->
    <div v-if="isConnected" class="welcome-message">
      Bienvenue à nouveau !
    </div>

    <!-- Formulaire qui se masque si isConnected est vrai -->
    <div v-if="!isConnected">
      <h2 class="connexion-title">Connexion</h2>
      <form @submit.prevent="handleLogin" class="connexion-form">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" v-model="email" type="email" required class="form-control">
        </div>
        <div class="form-group">
          <label for="motDePasse">Mot de passe:</label>
          <input id="motDePasse" v-model="motDePasse" type="password" required class="form-control">
        </div>
        <button type="submit" class="connexion-button">Connexion</button>
      </form>
    </div>
  </div>
</template>





<script>
import { ref } from 'vue';
import useAuth from '../service/ServiceAuth';

export default {
  emits: ['login'],
  setup(_, { emit }) {
    const { login } = useAuth();
    const email = ref('');
    const motDePasse = ref('');
    const errorMessage = ref('');
    const isConnected = ref(false);  // Variable pour gérer l'état de connexion

    const handleLogin = async () => {
      const { success, token, message } = await login(email.value, motDePasse.value);
      if (success) {
        console.log("Connecté avec succès", token);
        isConnected.value = true;  // Mettre à jour l'état de connexion
        emit('login'); // Émet l'événement 'login'
      } else {
        console.error(message);
        errorMessage.value = "Erreur : Email ou mot de passe incorrect.";
      }
    };

    return { email, motDePasse, handleLogin, errorMessage, isConnected };
  }
};
</script>



<style scoped>
/* Styles pour la page de connexion */
.connexion-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 5px;
}

.connexion-title {
  text-align: center;
  margin-bottom: 20px;
}

.connexion-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.connexion-button {
  background-color: #005A9C;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.connexion-button:hover {
  background-color: #0370E4;
}

.error-message {
  color: red;
  margin-bottom: 15px;
  font-size: 16px;
  text-align: center;
}

.welcome-message {
  margin-top: 200px;
  color: green;
  font-size: 20px;
  text-align: center;
  animation: fadeIn 1s ease-in-out; /* Animation de fondu en entrée */
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
