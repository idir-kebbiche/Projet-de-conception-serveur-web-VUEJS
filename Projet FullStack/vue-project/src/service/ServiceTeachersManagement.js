import axios from "axios";

const useEnseignant = () => {
    // Récupérer tous les enseignants
    const getAllTeachers = async () => {
        const enseignants = await axios.get(`${import.meta.env.VITE_BASE_URL}/enseignants`);
        return enseignants.data;
    };

    // Supprimer un enseignant par ID
    const deleteTeacher = async (id) => {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/enseignants/${id}`);
    };

    // Récupérer un enseignant par ID
    const getTeacherById = async (id) => {
        const enseignant = await axios.get(`${import.meta.env.VITE_BASE_URL}/enseignants/${id}`);
        return enseignant.data;
    };

    // Ajouter un enseignant
    const addTeacher = async (enseignant) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/enseignants`, enseignant);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'enseignant :', error);
            return {};
        }
    };

    // Mettre à jour un enseignant
    const updateTeacher = async (id, enseignant) => {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/enseignants/${id}`, enseignant);
    };

    return { getAllTeachers, deleteTeacher, getTeacherById, addTeacher, updateTeacher };
};

export default useEnseignant;
