<template>
  <div class="classes-management">
    <h1>Gestion des Classes</h1>
    <div v-if="loading">Chargement...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <table v-else class="classes-table">
      <thead>
        <tr>
          <th>ID Classe</th>
          <th>Nom de la classe</th>
          <th>Niveau</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="classe in classes" :key="classe.ID_classe">
          <td>{{ classe.ID_classe }}</td>
          <td>{{ classe.Nom_classe }}</td>
          <td>{{ classe.Niveau }}</td>
          <td>
            <button @click="editClasse(classe)" class="edit-button">Modifier</button>
            <button @click="deleteClasse(classe.ID_classe)" class="delete-button">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="classe-form">
      <h2>{{ editMode ? 'Modifier la Classe' : 'Ajouter une Classe' }}</h2>
      <form @submit.prevent="submitForm" class="form">
        <label for="nom_classe">Nom de la classe :</label>
        <input type="text" id="nom_classe" v-model="form.Nom_classe" required class="input">
        <label for="niveau">Niveau :</label>
        <input type="text" id="niveau" v-model="form.Niveau" required class="input">
        <button type="submit" class="submit-button">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>
  </div>
</template>


<script>
import useClasses from '../service/ServiceClassesManagement';

export default {
  name: 'ClassesManagement',
  data() {
    return {
      classes: [],
      editMode: false,
      form: {
        Nom_classe: '',
        Niveau: ''
      },
      editedClasseId: null,
      loading: false,
      error: null
    };
  },
  methods: {
    async loadClasses() {
      try {
        const { getAllClasses } = useClasses();
        const response = await getAllClasses();
        this.classes = response.data || [];
      } catch (error) {
        console.error('Erreur lors du chargement des classes :', error);
      }
    },
editClasse(classe) {
  if (classe.ID_classe) {
    this.editMode = true;
    this.form.Nom_classe = classe.Nom_classe;
    this.form.Niveau = classe.Niveau;
    this.editedClasseId = classe.ID_classe;
  } else {
    console.error('Erreur : l\'ID de la classe est null');
  }
},
    async deleteClasse(ID_classe) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
        const { deleteClasse } = useClasses();
        try {
          await deleteClasse(ID_classe);
          this.loadClasses(); // Recharger les classes après suppression
        } catch (error) {
          console.error('Erreur lors de la suppression de la classe :', error);
          this.error = 'Erreur lors de la suppression de la classe';
        }
      }
    },
    async submitForm() {
      const { addClasse, updateClasse } = useClasses();
      if (this.editMode) {
        try {
          await updateClasse(this.editedClasseId, this.form);
        } catch (error) {
          console.error('Erreur lors de la modification de la classe :', error);
          this.error = 'Erreur lors de la modification de la classe';
        }
      } else {
        try {
          await addClasse(this.form);
        } catch (error) {
          console.error('Erreur lors de l\'ajout de la classe :', error);
          this.error = 'Erreur lors de l\'ajout de la classe';
        }
      }
      this.loadClasses(); // Recharger les classes après ajout/modification
      this.resetForm();
    },
    resetForm() {
      this.form = { Nom_classe: '', Niveau: '' };
      this.editMode = false;
      this.editedClasseId = null;
    }
  },
  mounted() {
    this.loadClasses();
  }
};
</script>

<style scoped>
.classes-management {
  padding: 20px;
  background-color: #f4f4f4;
}

.classes-management h1, .title {
  text-align: center;
  color: #005A9C;
  margin-bottom: 20px;
}

.edit-button {
  background-color: #4CAF50; /* Vert */
  color: white;
  padding: 5px 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #218721; /* Vert foncé */
}

.delete-button {
  background-color: #f44336; /* Rouge */
  color: white;
  padding: 5px 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #d32f2f; /* Rouge foncé */
}

.classes-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
}

.classes-table th, .classes-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.classes-table th {
  background-color: #f2f2f2; /* Gris clair */
}

.classes-table tr:nth-child(even) {
  background-color: #f9f9f9; /* Gris très clair */
}

.classes-table tr:hover {
  background-color: #ddd; /* Gris moyen */
}

.error {
  color: #f44336; /* Rouge */
  margin: 10px 0;
}

.classe-form {
  margin-top: 20px;
  background-color: white;
  padding: 15px;
  border-radius: 5px;
}

.form {
  display: flex;
  flex-direction: column;
}

.input, .select {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  padding: 10px;
  margin-top: 10px;
  background-color: #0056b3; /* Bleu */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #004494; /* Bleu foncé */
}
</style>


