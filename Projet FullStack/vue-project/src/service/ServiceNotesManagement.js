import axios from "axios";

const useNotes = () => {
  const getAllNotes = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/notes`);
    return response.data;
  };

  const deleteNote = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/notes/${id}`);
  };

  const addNote = async (noteData) => {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/notes`, noteData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  };
  

  const updateNote = async (id, noteData) => {
    await axios.put(`${import.meta.env.VITE_BASE_URL}/notes/${id}`, noteData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return { getAllNotes, deleteNote, addNote, updateNote };
};

export default useNotes;
