import axios from "axios";

const useCours = () => {
    // Récupérer tous les cours
    const getAllCours = async () => {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/cours`);
        return response.data;
    };

    // Supprimer un cours par ID
    const deleteCours = async (id) => {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/cours/${id}`);
    };

    // Récupérer un cours par ID
    const getCoursById = async (id) => {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/cours/${id}`);
        return response.data;
    };

    // Ajouter un cours
    const addCours = async (cours) => {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/cours`, cours);
        return response.data;
    };

    // Mettre à jour un cours
    const updateCours = async (id, cours) => {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/cours/${id}`, cours);
    };

    const createCoursMaterielRelation = async (coursID, materielID) => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/materiel-cours`, {
            courIDCours: coursID,
            materielIDMateriel: materielID,
          });
          return response.data;
        } catch (error) {
          throw error;
        }
      };
    
      const deleteCoursMaterielRelation = async (coursID, materielID) => {
        try {
          const response = await axios.delete(
            `${import.meta.env.VITE_BASE_URL}/materiel-cours/${coursID}/${materielID}`
          );
          return response.data;
        } catch (error) {
          throw error;
        }
      };

    return { getAllCours, deleteCours, getCoursById, addCours, updateCours, createCoursMaterielRelation, deleteCoursMaterielRelation, };
};

export default useCours;
