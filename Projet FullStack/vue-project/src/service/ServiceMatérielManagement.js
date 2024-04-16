import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

const useMateriel = () => {
  const getAllMateriels = async () => {
    const response = await axios.get(`${API_URL}/materiels`);
    return response.data;
  };

  const deleteMateriel = async (id) => {
    await axios.delete(`${API_URL}/materiels/${id}`);
  };

  const getMaterielById = async (id) => {
    const response = await axios.get(`${API_URL}/materiels/${id}`);
    return response.data;
  };

  const addMateriel = async (materiel) => {
    const response = await axios.post(`${API_URL}/materiels`, materiel);
    return response.data;
  };

  const updateMateriel = async (id, materiel) => {
    await axios.put(`${API_URL}/materiels/${id}`, materiel);
  };

  const createMaterielCoursRelation = async (materielID, courID) => {
    try {
      const response = await axios.post(`${API_URL}/materiel-cours`, {
        materielIDMateriel: materielID,
        courIDCours: courID,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteMaterielCoursRelation = async (materielID, courID) => {
    try {
      const response = await axios.delete(
        `${API_URL}/materiel-cours/${materielID}/${courID}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getMaterielsByCours = async (coursID) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/cours/${coursID}/materiels`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getAllMateriels,
    deleteMateriel,
    getMaterielById,
    addMateriel,
    updateMateriel,
    createMaterielCoursRelation,
    deleteMaterielCoursRelation,
    getMaterielsByCours,
  };
};

export default useMateriel;
