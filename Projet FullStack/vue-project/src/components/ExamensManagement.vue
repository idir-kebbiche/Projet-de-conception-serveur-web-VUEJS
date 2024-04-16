<template>
  <div class="exams-management">
    <h2 class="title">Gestion des examens</h2>
    <div class="exams-table-container">
      <table class="exams-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date de l'examen</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="examen in examens" :key="examen.ID_examen">
            <td>{{ examen.ID_examen }}</td>
            <td>{{ examen.Date_examen }}</td>
            <td>{{ examen.Description }}</td>
            <td>
              <button @click="editExamen(examen)" class="edit-button">Modifier</button>
              <button @click="deleteExamen(examen.ID_examen)" class="delete-button">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="exam-form">
      <h3 v-if="!editMode">{{ editMode ? 'Modifier l\'examen' : 'Ajouter un nouvel examen' }}</h3>
      <form @submit.prevent="submitForm" class="form">
        <label for="date_examen">Date de l'examen :</label>
        <input type="date" id="date_examen" v-model="formData.Date_examen" required class="input">
        <label for="description">Description :</label>
        <textarea id="description" v-model="formData.Description" class="input"></textarea>
        <button type="submit" class="submit-button">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>
  </div>
</template>
  
  <script>
  import useExamen from '../service/ServiceExamensManagement';
  
  export default {
    name: 'ExamensManagement',
    data() {
      return {
        examens: [],
        editMode: false,
        formData: {
          Date_examen: '',
          Description: ''
        },
        editedExamenId: null
      };
    },
    async mounted() {
      this.loadExamens();
    },
    methods: {
      async loadExamens() {
        try {
          const { getAllExamens } = useExamen();
          const response = await getAllExamens();
          this.examens = response.data || [];
        } catch (error) {
          console.error('Erreur lors du chargement des examens :', error);
        }
      },
      async editExamen(examen) {
        this.editMode = true;
        this.formData.Date_examen = examen.Date_examen;
        this.formData.Description = examen.Description;
        this.editedExamenId = examen.ID_examen;
      },
      async deleteExamen(ID_examen) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
          try {
            const { deleteExamen } = useExamen();
            await deleteExamen(ID_examen);
            this.loadExamens(); // Recharger les examens après la suppression
          } catch (error) {
            console.error('Erreur lors de la suppression de l\'examen :', error);
          }
        }
      },
      async submitForm() {
        const { addExamen, updateExamen } = useExamen();
        try {
          if (this.editMode) {
            await updateExamen(this.editedExamenId, this.formData);
          } else {
            await addExamen(this.formData);
          }
          this.clearForm();
          this.loadExamens(); // Recharger les examens après l'ajout ou la mise à jour
        } catch (error) {
          console.error('Erreur lors de la soumission du formulaire :', error);
        }
      },
      clearForm() {
        this.formData.Date_examen = '';
        this.formData.Description = '';
        this.editMode = false;
        this.editedExamenId = null;
      }
    }
  }
  </script>
  
  <style scoped>
.exams-management {
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

.exams-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.exams-table th, .exams-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.exams-table th {
  background-color: #f2f2f2;
  color: black;
}

.exams-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.exams-table tr:hover {
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
  