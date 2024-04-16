import axios from "axios";

const useExamen = () => {
    const getAllExamens = async () => {
        const examens = await axios.get(`${import.meta.env.VITE_BASE_URL}/examens`)
        return examens.data
    }
    const deleteExamen = async (id) => {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/examens/${id}`)
    }

    const getExamenById = async (id) => {
        const examen = await axios.get(`${import.meta.env.VITE_BASE_URL}/examens/${id}`)
        return examen.data
    }
    const addExamen = async (examen) => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/examens`, examen);
          return response.data;
        } catch (error) {
          console.error('Erreur lors de l\'ajout de l\'examen :', error);
          return {};
        }
      }

    const updateExamen = async (id, examen) => {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/examens/${id}`, examen)
    }

    return { getAllExamens, deleteExamen, getExamenById, addExamen, updateExamen }
}

export default useExamen
