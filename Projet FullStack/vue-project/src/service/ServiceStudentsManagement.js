import axios from "axios";

const useEtudiant = () => {
    const baseUrl = `${import.meta.env.VITE_BASE_URL}/etudiants`;

    // Récupérer tous les étudiants
    const getAllStudents = async () => {
        const response = await axios.get(baseUrl);
        return response.data;
    };

    // Supprimer un étudiant par ID
    const deleteStudent = async (id) => {
        await axios.delete(`${baseUrl}/${id}`);
    };

    // Récupérer un étudiant par ID
    const getStudentById = async (id) => {
        const response = await axios.get(`${baseUrl}/${id}`);
        return response.data;
    };

    // Ajouter un étudiant
    const addStudent = async (student) => {
        try {
            const response = await axios.post(baseUrl, student);
            return response.data;
        } catch (error) {
            handleErrors(error);
            return {};
        }
    };

    // Mettre à jour un étudiant
    // Dans ServiceStudentsManagement.js
const updateStudent = async (ID_etudiant, studentData) => {
  try {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/etudiants/${ID_etudiant}`, studentData);
      return response.data;
  } catch (error) {
      console.error("Erreur lors de la mise à jour de l'étudiant :", error);
      throw error;
  }
};

    // Gérer les erreurs de requête
    const handleErrors = (error) => {
        if (error.response && error.response.status === 400) {
            console.error('Erreurs de validation :', error.response.data.errors);
        } else {
            console.error('Erreur lors de la requête :', error);
        }
    };

    return { getAllStudents, deleteStudent, getStudentById, addStudent, updateStudent };
};

export default useEtudiant;
