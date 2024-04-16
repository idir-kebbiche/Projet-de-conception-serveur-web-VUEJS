import axios from "axios";

const useEmploisDuTemps = () => {
  const getAllEmploisDuTemps = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/emplois-du-temps`);
    return response.data;
  }

  const addEmploiDuTemps = async (emploiDuTemps) => {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/emplois-du-temps`, emploiDuTemps);
    return response.data;
  }

  const updateEmploiDuTemps = async (ID_EDT, emploiDuTemps) => {
    await axios.put(`${import.meta.env.VITE_BASE_URL}/emplois-du-temps/${ID_EDT}`, emploiDuTemps);
  }

  const deleteEmploiDuTemps = async (ID_EDT) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/emplois-du-temps/${ID_EDT}`);
  }

  return { getAllEmploisDuTemps, addEmploiDuTemps, updateEmploiDuTemps, deleteEmploiDuTemps };
}

export default useEmploisDuTemps;
