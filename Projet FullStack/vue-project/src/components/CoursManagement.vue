<template>
  <div class="courses-management">
    <h2 class="title">Gestion des cours</h2>
    <div class="courses-table-container">
      <table class="courses-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom du cours</th>
            <th>Description</th>
            <th>Enseignant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cours in cours" :key="cours.ID_cours">
            <td>{{ cours.ID_cours }}</td>
            <td>{{ cours.Nom_cours }}</td>
            <td>{{ cours.Description }}</td>
            <td>{{ cours.enseignant?.Nom }} {{ cours.enseignant?.Prenom }}</td>
            <td>
              <button @click="editCours(cours)" class="edit-button">Modifier</button>
              <button @click="deleteCours(cours.ID_cours)" class="delete-button">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="course-form">
      <h3 v-if="!editMode">{{ editMode ? 'Modifier le cours' : 'Ajouter un nouveau cours' }}</h3>
      <form @submit.prevent="submitForm" class="form">
        <label for="nom_cours">Nom du cours :</label>
        <input type="text" id="nom_cours" v-model="formData.Nom_cours" required class="input">
        <label for="description">Description :</label>
        <textarea id="description" v-model="formData.Description" class="input"></textarea>
        <label for="enseignant">Enseignant :</label>
        <select id="enseignant" v-model="formData.enseignantIDEnseignant" required class="select">
          <option value="">Sélectionner un enseignant</option>
          <option v-for="enseignant in enseignants" :value="enseignant.ID_enseignant" :key="enseignant.ID_enseignant">
            {{ enseignant.Nom }} {{ enseignant.Prenom }}
          </option>
        </select>
        <button type="submit" class="submit-button">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import useCours from '../service/ServiceCoursManagement';
import useEnseignant from '../service/ServiceTeachersManagement';

export default {
  name: 'CoursManagement',
  data() {
    return {
      cours: [],
      enseignants: [],
      editMode: false,
      formData: {
        Nom_cours: '',
        Description: '',
        enseignantIDEnseignant: null
      },
      editedCoursId: null
    };
  },
  async mounted() {
    this.loadCours();
    this.loadEnseignants();
  },
  methods: {
    async loadCours() {
  try {
    const { getAllCours } = useCours();
    const response = await getAllCours();
    this.cours = response.data || [];

    // Charger les informations sur l'enseignant pour chaque cours
    for (const cours of this.cours) {
      const { getTeacherById } = useEnseignant();
      const enseignant = await getTeacherById(cours.enseignantIDEnseignant);
      cours.enseignant = enseignant.data;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des cours :', error);
  }
},
    async loadEnseignants() {
      try {
        const { getAllTeachers } = useEnseignant();
        const enseignantsResponse = await getAllTeachers();
        this.enseignants = enseignantsResponse.data || [];
      } catch (error) {
        console.error('Erreur lors du chargement des enseignants :', error);
      }
    },
    async editCours(cours) {
  this.editMode = true;
  this.formData.Nom_cours = cours.Nom_cours;
  this.formData.Description = cours.Description;
  this.formData.enseignantIDEnseignant = cours.enseignant?.ID_enseignant; // Utilisation de l'opérateur optionnel
  this.editedCoursId = cours.ID_cours;
},
    async deleteCours(coursId) {
      if (coursId === undefined) {
        console.error('Erreur: ID du cours non défini');
        return;
      }
      if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
        try {
          const { deleteCours } = useCours();
          await deleteCours(coursId);
          this.cours = this.cours.filter(cours => cours.ID_cours !== coursId);
        } catch (error) {
          console.error('Erreur:', error);
        }
      }
    },
    async submitForm() {
      const { addCours, updateCours } = useCours();
      const selectedTeacher = this.enseignants.find(enseignant => enseignant.ID_enseignant === this.formData.enseignantIDEnseignant);

      if (this.editMode) {
        try {
          const coursData = {
            Nom_cours: this.formData.Nom_cours,
            Description: this.formData.Description,
            enseignantIDEnseignant: selectedTeacher.ID_enseignant
          };
          await updateCours(this.editedCoursId, coursData);
          this.loadCours();
          this.editMode = false;
          this.clearForm();
        } catch (error) {
          console.error('Erreur lors de la modification du cours :', error);
        }
      } else {
        try {
          const coursData = {
            Nom_cours: this.formData.Nom_cours,
            Description: this.formData.Description,
            enseignantIDEnseignant: selectedTeacher.ID_enseignant
          };
          await addCours(coursData);
          this.loadCours();
          this.clearForm();
        } catch (error) {
          console.error('Erreur lors de l\'ajout du cours :', error);
        }
      }
    },
    clearForm() {
      this.formData.Nom_cours = '';
      this.formData.Description = '';
      this.formData.enseignantIDEnseignant = null;
      this.editMode = false;
      this.editedCoursId = null;
    }
  }
};
</script>

<style scoped>
.courses-management {
  padding: 20px;
  background-color: #f4f4f4;
}

.title {
  text-align: center;
  color: #005A9C;
  margin-bottom: 20px;
}

.edit-button, .delete-button {
  padding: 5px 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button {
  background-color: #4CAF50;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.courses-table th, .courses-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.courses-table th {
  background-color: #f2f2f2;
  color: black;
}

.courses-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.courses-table tr:hover {
  background-color: #ddd;
}

.form {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

.input, .select {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #004494;
}
</style>