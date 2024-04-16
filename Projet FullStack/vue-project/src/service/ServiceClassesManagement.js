import axios from "axios";

const useClasses = () => {
    const getAllClasses = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/classes`);
          return response.data; // Retourne directement les données de la réponse
        } catch (error) {
          console.error("Erreur lors de la récupération des classes :", error);
          throw error; // Propage l'erreur pour la gérer ailleurs
        }
    };    

    const getClasseById = async (ID_classe) => {
        if (!ID_classe) {
          console.error('Erreur : l\'ID de la classe est null ou undefined');
          return null;
        }
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/classes/${ID_classe}`);
          return response.data;
        } catch (error) {
          console.error("Erreur lors de la récupération de la classe par ID :", error);
          throw error;
        }
      };
  

    const deleteClasse = async (ID_classe) => {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/classes/${ID_classe}`);
    };

    const addClasse = async (classe) => {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/classes`, classe);
        return response.data;
    };

    const updateClasse = async (ID_classe, classe) => {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/classes/${ID_classe}`, classe);
    };

    return { getAllClasses, getClasseById, deleteClasse, addClasse, updateClasse };
};

export default useClasses;