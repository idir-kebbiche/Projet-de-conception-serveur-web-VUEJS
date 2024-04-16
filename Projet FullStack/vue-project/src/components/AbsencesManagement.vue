<template>
  <div class="absences-management">
    <h2 class="title">Gestion des absences</h2>
    <div class="absences-list-container">
      <ul class="absences-list">
        <li v-for="absence in absences" :key="absence.ID_absence" class="absence-item">
          <div class="absence-info">
            <span class="date">{{ formatDate(absence.Date) }}</span>
            <span class="justified">Justifiée : {{ absence.Justifiee ? 'Oui' : 'Non' }}</span>
            <span class="student">Étudiant : {{ findEtudiantName(absence.etudiantIDEtudiant) }}</span>
          </div>
          <div class="absence-actions">
            <button @click="editAbsence(absence)" class="edit-button">Modifier</button>
            <button @click="deleteAbsence(absence.ID_absence)" class="delete-button">Supprimer</button>
          </div>
        </li>
      </ul>
    </div>
    <div class="absence-form">
      <h3 v-if="!editMode">{{ editMode ? 'Modifier l\'absence' : 'Ajouter une nouvelle absence' }}</h3>
      <form @submit.prevent="submitForm" class="form">
        <label for="date">Date :</label>
        <input type="date" id="date" v-model="formData.Date" required class="input">
        <label for="justifiee">Justifiée :</label>
        <select id="justifiee" v-model="formData.Justifiee" required class="select">
          <option value="">Sélectionner</option>
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </select>
        <label for="etudiant">Étudiant :</label>
        <select id="etudiant" v-model="formData.Etudiant" required class="select">
          <option value="">Sélectionner un étudiant</option>
          <option v-for="etudiant in etudiants" :key="etudiant.ID_etudiant" :value="etudiant.ID_etudiant">
            {{ etudiant.Nom }} {{ etudiant.Prenom }}
          </option>
        </select>
        <button type="submit" class="submit-button">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import useAbsence from '../service/ServiceAbsencesManagement';
import useEtudiant from '../service/ServiceStudentsManagement';

export default {
  name: 'AbsencesManagement',
  data() {
    return {
      absences: [],
      etudiants: [],
      editMode: false,
      formData: {
        Date: '',
        Justifiee: '',
        Etudiant: '',
      },
      editedAbsenceId: null,
      absenceService: null,
    };
  },
  async mounted() {
    this.absenceService = useAbsence();
    this.loadAbsences();
    this.loadEtudiants();
  },
  methods: {
    async loadAbsences() {
      try {
        console.log("Chargement des absences...");
        const response = await this.absenceService.getAllAbsences();
        this.absences = response.data.map(absence => {
          if (absence.Date) {
            const formattedDate = new Date(absence.Date).toISOString().substring(0, 10);
            return {
              ...absence,
              Date: formattedDate
            };
          } else {
            console.error('Absence sans date:', absence);
            return { ...absence, Date: 'Date inconnue' };
          }
        });
        console.log("Absences chargées :", this.absences);
      } catch (error) {
        console.error('Erreur lors du chargement des absences :', error);
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

    editAbsence(absence) {
      this.editMode = true;
      this.formData = { ...absence };
      this.editedAbsenceId = absence.ID_absence;
    },
    async deleteAbsence(id) {
      try {
        await this.absenceService.deleteAbsence(id);
        this.loadAbsences();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'absence :', error);
      }
    },
    async submitForm() {
      try {
        const absenceData = {
          Date: this.formData.Date,
          Justifiee: this.formData.Justifiee,
          etudiantIDEtudiant: this.formData.Etudiant,
        };
        if (this.editMode) {
          await this.absenceService.updateAbsence(this.editedAbsenceId, absenceData);
        } else {
          await this.absenceService.addAbsence(absenceData);
        }
        this.clearForm();
        this.loadAbsences();
      } catch (error) {
        console.error('Erreur lors de l\'ajout/modification de l\'absence :', error);
      }
    },
    clearForm() {
      this.formData = {
        Date: '',
        Justifiee: '',
        Etudiant: '',
      };
      this.editMode = false;
      this.editedAbsenceId = null;
    },
    formatDate(dateStr) {
      if (!dateStr) {
        return 'Date non spécifiée';
      }
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const isoDate = date.toISOString();
        return isoDate.substring(0, 10);
      } else {
        console.error('Format de date invalide reçu:', dateStr);
        return 'Format de date invalide';
      }
    },
    findEtudiantName(ID_etudiant) {
      const etudiant = this.etudiants.find(et => et.ID_etudiant === ID_etudiant);
      return etudiant ? `${etudiant.Nom} ${etudiant.Prenom}` : 'Non trouvé';
    },
  },
};
</script>

<style scoped>
.absences-management {
  padding: 20px;
  background-color: #f4f4f4;
}

.title {
  text-align: center;
  color: #005A9C;
  margin-bottom: 20px;
}

.absences-list-container {
  margin-bottom: 20px;
}

.absence-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  margin-bottom: 10px;
}

.absence-info {
  display: flex;
  flex-direction: column;
}

.date, .justified, .student {
  margin-right: 10px;
}

.edit-button, .delete-button {
  padding: 5px 10px;
  margin: 0 5px;
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