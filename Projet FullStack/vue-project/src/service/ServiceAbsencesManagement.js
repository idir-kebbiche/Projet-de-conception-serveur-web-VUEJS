import axios from "axios";

const useAbsence = () => {
    const getAllAbsences = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/absences`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des absences :', error);
            return []; // Retourner un tableau vide ou gérer l'erreur autrement
        }
    };
    

    const deleteAbsence = async (id) => {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/absences/${id}`);
    };

    const addAbsence = async (absence) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/absences`, absence, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'absence :', error);
            return {};
        }
    };

    const updateAbsence = async (id, absence) => {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/absences/${id}`, absence, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    return { getAllAbsences, deleteAbsence, addAbsence, updateAbsence };
};

export default useAbsence;
