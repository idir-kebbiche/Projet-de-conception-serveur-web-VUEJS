// service/ServiceAuth.js
import axios from 'axios';

const useAuth = () => {
    const login = async (email, motDePasse) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, {
                Email: email, // Modifier ici
                Mot_de_passe: motDePasse // Et ici
            });
            // Stocke le token JWT dans le localStorage
            localStorage.setItem('userToken', response.data.token); // Ajouté ici
            // L'API renvoie un jeton (token) d'authentification
            return { success: true, token: response.data.token };
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return { success: false, message: 'Échec de la connexion' };
        }
    };

    return { login };
};

export default useAuth;
