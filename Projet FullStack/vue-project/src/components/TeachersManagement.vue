<template>
  <div class="teachers-management">
    <h2 class="title">Gestion des enseignants</h2>
    <div class="teachers-table-container">
      <table class="teachers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Date de naissance</th>
            <th>Adresse</th>
            <th>Numéro de téléphone</th>
            <th>Email</th>
            <th>Matière enseignée</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="enseignant in enseignants" :key="enseignant.ID_enseignant">
            <td>{{ enseignant.ID_enseignant }}</td>
            <td>{{ enseignant.Nom }}</td>
            <td>{{ enseignant.Prenom }}</td>
            <td>{{ enseignant.Date_naissance }}</td>
            <td>{{ enseignant.Adresse }}</td>
            <td>{{ enseignant.Numero_telephone }}</td>
            <td>{{ enseignant.Email }}</td>
            <td>{{ enseignant.Matiere_enseignee }}</td>
            <td>
              <button @click="editEnseignant(enseignant)" class="edit-button">Modifier</button>
              <button @click="deleteEnseignant(enseignant.ID_enseignant)" class="delete-button">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="teacher-form">
      <h3 v-if="!editMode">{{ editMode ? 'Modifier l\'enseignant' : 'Ajouter un nouvel enseignant' }}</h3>
      <form @submit.prevent="submitForm" class="form">
        <label for="nom">Nom :</label>
        <input type="text" id="nom" v-model="formData.Nom" required class="input">
        <label for="prenom">Prénom :</label>
        <input type="text" id="prenom" v-model="formData.Prenom" required class="input">
        <label for="date_naissance">Date de naissance :</label>
        <input type="date" id="date_naissance" v-model="formData.Date_naissance" class="input">
        <label for="adresse">Adresse :</label>
        <input type="text" id="adresse" v-model="formData.Adresse" class="input">
        <label for="numero_telephone">Numéro de téléphone :</label>
        <input type="text" id="numero_telephone" v-model="formData.Numero_telephone" class="input">
        <label for="email">Email :</label>
        <input type="email" id="email" v-model="formData.Email" class="input">
        <label for="mot_de_passe">Mot de passe :</label>
        <input type="password" id="mot_de_passe" v-model="formData.Mot_de_passe" required class="input">
        <label for="matiere_enseignee">Matière enseignée :</label>
        <input type="text" id="matiere_enseignee" v-model="formData.Matiere_enseignee" class="input">
        <button type="submit" class="submit-button">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>
  </div>
</template>
  
  <script>
  import useEnseignant from '../service/ServiceTeachersManagement';
  
  export default {
    name: 'TeachersManagement',
    data() {
      return {
        enseignants: [],
        editMode: false,
        formData: {
          Nom: '',
          Prenom: '',
          Date_naissance: '',
          Adresse: '',
          Numero_telephone: '',
          Email: '',
          Mot_de_passe: '',
          Matiere_enseignee: '',
        },
        editedEnseignantId: null
      };
    },
    async mounted() {
      this.loadEnseignants();
    },
    methods: {
      async loadEnseignants() {
        try {
          const { getAllTeachers } = useEnseignant();
          const enseignantsResponse = await getAllTeachers();
          this.enseignants = enseignantsResponse.data || [];
        } catch (error) {
          console.error('Erreur lors du chargement des enseignants :', error);
        }
      },
      async editEnseignant(enseignant) {
        this.editMode = true;
        this.formData = { ...enseignant };
        this.editedEnseignantId = enseignant.ID_enseignant;
      },
      async deleteEnseignant(enseignantId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
          try {
            const { deleteTeacher } = useEnseignant();
            await deleteTeacher(enseignantId);
            this.loadEnseignants(); // Recharger la liste après suppression
          } catch (error) {
            console.error('Erreur lors de la suppression de l\'enseignant :', error);
          }
        }
      },
      async submitForm() {
        const { addTeacher, updateTeacher } = useEnseignant();
        if (this.editMode) {
          try {
            await updateTeacher(this.editedEnseignantId, this.formData);
            this.loadEnseignants(); // Recharger la liste après mise à jour
            this.editMode = false;
          } catch (error) {
            console.error('Erreur lors de la modification de l\'enseignant :', error);
          }
        } else {
          try {
            await addTeacher(this.formData);
            this.loadEnseignants(); // Recharger la liste après ajout
          } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'enseignant :', error);
          }
        }
        this.clearForm();
      },
      clearForm() {
        this.formData = {
          Nom: '',
          Prenom: '',
          Date_naissance: '',
          Adresse: '',
          Numero_telephone: '',
          Email: '',
          Mot_de_passe: '',
          Matiere_enseignee: '',
        };
        this.editMode = false;
        this.editedEnseignantId = null;
      }
    }
  }
  </script>
  
  <style scoped>
.teachers-management {
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

.teachers-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.teachers-table th, .teachers-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.teachers-table th {
  background-color: #f2f2f2;
  color: black;
}

.teachers-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.teachers-table tr:hover {
  background-color: #ddd;
}

.form {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

.input {
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

  