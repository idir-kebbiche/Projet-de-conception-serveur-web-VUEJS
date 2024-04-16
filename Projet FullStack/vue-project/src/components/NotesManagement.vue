<template>
  <div class="notes-management">
    <h2 class="title">Gestion des Notes</h2>
    <div class="notes-table-container">
      <table class="notes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Note</th>
            <th>Étudiant</th>
            <th>Cours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="note in notes" :key="note.ID_note">
            <td>{{ note.ID_note }}</td>
            <td>{{ note.Note }}</td>
            <td>{{ findEtudiantName(note.etudiantIDEtudiant) }}</td>
            <td>{{ findCoursName(note.courIDCours) }}</td>
            <td>
              <button @click="editNote(note)" class="edit-button">Modifier</button>
              <button @click="deleteNote(note.ID_note)" class="delete-button">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="note-form">
      <h3 v-if="!editMode">{{ editMode ? 'Modifier la note' : 'Ajouter une nouvelle note' }}</h3>
      <form @submit.prevent="submitForm" class="form">
        <label for="note">Note :</label>
        <input type="number" step="0.1" id="note" v-model="formData.Note" required class="input">
        <label for="etudiant">Étudiant :</label>
        <select id="etudiant" v-model="formData.Etudiant" required class="select">
          <option value="">Sélectionner un étudiant</option>
          <option v-for="etudiant in etudiants" :key="etudiant.ID_etudiant" :value="etudiant.ID_etudiant">
            {{ etudiant.Nom }} {{ etudiant.Prenom }}
          </option>
        </select>
        <label for="cours">Cours :</label>
        <select id="cours" v-model="formData.Cours" required class="select">
          <option value="">Sélectionner un cours</option>
          <option v-for="cours in coursList" :key="cours.ID_cours" :value="cours.ID_cours">
            {{ cours.Nom_cours }}
          </option>
        </select>
        <button type="submit" class="submit-button">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import useNotes from '../service/ServiceNotesManagement'; // Assurez-vous d'ajuster le chemin d'accès selon votre structure de projet
import useEtudiant from '../service/ServiceStudentsManagement'; // Ajustez le chemin si nécessaire
import useCours from '../service/ServiceCoursManagement'; // Ajustez le chemin si nécessaire

export default {
  name: 'NotesManagement',
  data() {
    return {
      notes: [],
      etudiants: [], // Consolidé
      coursList: [], // Nom consolidé
      editMode: false,
      formData: {
        Note: 0,
        Etudiant: '',
        Cours: ''
      },
      editedNoteId: null
    };
  },

  async mounted() {
    this.loadNotes();
    this.loadEtudiants();
    this.loadCoursList(); // Nom corrigé
  },
  methods: {
    async loadNotes() {
      const { getAllNotes } = useNotes();
      try {
        const response = await getAllNotes();
        this.notes = response.data || []; // Assurez-vous que votre API renvoie une structure adaptée ici
      } catch (error) {
        console.error('Erreur lors du chargement des notes :', error);
      }
    },
    async loadEtudiants() {
      try {
        const { getAllStudents } = useEtudiant();
        const etudiantsResponse = await getAllStudents();
        this.etudiants = etudiantsResponse.data || [];
      } catch (error) {
        console.error('Erreur lors du chargement des étudiants :', error);
      }
    },
    async loadCoursList() {
      try {
        const { getAllCours } = useCours();
        const coursResponse = await getAllCours();
        this.coursList = coursResponse.data || [];
      } catch (error) {
        console.error('Erreur lors du chargement de la liste des cours :', error);
      }
    },
    findEtudiantName(ID_etudiant) {
  const etudiant = this.etudiants.find(et => et.ID_etudiant === ID_etudiant);
  return etudiant ? `${etudiant.Nom} ${etudiant.Prenom}` : 'Non trouvé';
},
findCoursName(ID_cours) {
  const cours = this.coursList.find(c => c.ID_cours === ID_cours);
  return cours ? cours.Nom_cours : 'Non trouvé';
},
    async editNote(note) {
      this.editMode = true;
      this.formData.Note = note.Note;
      this.formData.etudiantIDEtudiant = note.etudiantIDEtudiant;
      this.formData.courIDCours = note.courIDCours;
      this.editedNoteId = note.ID_note;
    },
    async deleteNote(noteId) {
      if (noteId === undefined) {
        console.error('Erreur: ID de la note non défini');
        return;
      }

      if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
        const { deleteNote } = useNotes();
        try {
          await deleteNote(noteId);
          this.notes = this.notes.filter(note => note.ID_note !== noteId);
        } catch (error) {
          console.error('Erreur:', error);
        }
      }
    },
    async submitForm() {
  const { addNote, updateNote } = useNotes();
  const noteData = {
    Note: this.formData.Note,
    etudiantIDEtudiant: this.formData.Etudiant,
    courIDCours: this.formData.Cours
  };
  if (this.editMode) {
    try {
      await updateNote(this.editedNoteId, noteData);
      this.editMode = false;
      this.loadNotes(); // Recharger les notes après modification
    } catch (error) {
      console.error('Erreur lors de la modification de la note :', error);
    }
  } else {
    try {
      await addNote(noteData);
      this.loadNotes(); // Recharger les notes après ajout
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note.', error);
    }
  }
  this.clearForm();
},
    clearForm() {
      this.formData.Note = 0;
      this.formData.etudiantIDEtudiant = '';
      this.formData.courIDCours = '';
      this.editMode = false;
      this.editedNoteId = null;
    }
  }
}
</script>

<style scoped>
.notes-management {
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

.notes-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.notes-table th, .notes-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.notes-table th {
  background-color: #f2f2f2;
  color: black;
}

.notes-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.notes-table tr:hover {
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
