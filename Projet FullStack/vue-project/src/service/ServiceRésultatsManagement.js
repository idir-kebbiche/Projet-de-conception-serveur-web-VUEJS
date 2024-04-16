import axios from 'axios'

const useResultat = () => {
  const getAllResultats = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/resultats`)
    return response.data
  }

  const deleteResultat = async (ID_resultat) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/resultats/${ID_resultat}`)
  }

  const addResultat = async (resultat) => {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/resultats`, resultat)
    return response.data
  }

  const updateResultat = async (ID_resultat, resultat) => {
    await axios.put(`${import.meta.env.VITE_BASE_URL}/resultats/${ID_resultat}`, resultat)
  }

  return { getAllResultats, deleteResultat, addResultat, updateResultat }
}

export default useResultat
