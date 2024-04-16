<template>
  <div class="planning-management">
    <h2 class="title">Gestion des Emplois du Temps</h2>
    <div class="planning-list-container">
      <ul class="planning-list">
        <li v-for="planning in plannings" :key="planning.ID_EDT" class="planning-item">
          <div class="planning-info">
            <span class="day">{{ planning.Jour }}</span>
            <span class="time">De {{ planning.Heure_debut }} à {{ planning.Heure_fin }}</span>
            <span class="class">Classe : {{ planning.classeData.Nom_classe }}</span>
            <span class="course">Cours : {{ planning.coursData.Nom_cours }}</span>
            <span class="teacher">Enseignant : {{ planning.enseignantData.Nom }} {{ planning.enseignantData.Prenom }}</span>
          </div>
          <div class="planning-actions">
            <button @click="editPlanning(planning)" class="edit-button">Modifier</button>
            <button @click="deletePlanning(planning.ID_EDT)" class="delete-button">Supprimer</button>
          </div>
        </li>
      </ul>
    </div>
    <div class="planning-form">
      <h3 v-if="!editMode">Ajouter un nouvel emploi du temps</h3>
      <h3 v-else>Modifier l'emploi du temps</h3>
      <form @submit.prevent="submitForm" class="form">
        <label for="day">Jour :</label>
        <input type="text" id="day" v-model="formData.Jour" required class="input">
        <label for="start_time">Heure de début :</label>
        <input type="time" id="start_time" v-model="formData.Heure_debut" required class="input">
        <label for="end_time">Heure de fin :</label>
        <input type="time" id="end_time" v-model="formData.Heure_fin" required class="input">
        <label for="class">Classe :</label>
        <select id="class" v-model="formData.classeIDClasse" required class="select">
          <option value="">Sélectionner une classe</option>
          <option v-for="classe in classes" :key="classe.ID_classe" :value="classe.ID_classe">
            {{ classe.Nom_classe }}
          </option>
        </select>
        <label for="course">Cours :</label>
        <select id="course" v-model="formData.courIDCours" required class="select">
          <option value="">Sélectionner un cours</option>
          <option v-for="cours in courses" :key="cours.ID_cours" :value="cours.ID_cours">
            {{ cours.Nom_cours }}
          </option>
        </select>
        <label for="teacher">Enseignant :</label>
        <select id="teacher" v-model="formData.enseignantIDEnseignant" required class="select">
          <option value="">Sélectionner un enseignant</option>
          <option v-for="teacher in teachers" :key="teacher.ID_enseignant" :value="teacher.ID_enseignant">
            {{ teacher.Nom }} {{ teacher.Prenom }}
          </option>
        </select>
        <button type="submit" class="submit-button">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import usePlanning from '../service/ServiceEmploisdutempsManagement';
import useClasses from '../service/ServiceClassesManagement';
import useCourses from '../service/ServiceCoursManagement';
import useTeachers from '../service/ServiceTeachersManagement';

export default {
  name: 'PlanningManagement',
  data() {
    return {
      plannings: [],
      classes: [],
      courses: [],
      teachers: [],
      editMode: false,
      formData: {
        Jour: '',
        Heure_debut: '',
        Heure_fin: '',
        classeIDClasse: null,
        courIDCours: null,
        enseignantIDEnseignant: null
      },
      editedPlanningId: null
    };
  },
  async mounted() {
    this.loadPlannings();
    this.loadClasses();
    this.loadCourses();
    this.loadTeachers();
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
    async loadCourses() {
      try {
        const { getAllCours } = useCourses();
        const response = await getAllCours();
        this.courses = response.data || [];
      } catch (error) {
        console.error('Erreur lors du chargement des cours :', error);
      }
    },
    async loadTeachers() {
      try {
        const { getAllTeachers } = useTeachers();
        const teachersResponse = await getAllTeachers();
        this.teachers = teachersResponse.data || [];
      } catch (error) {
        console.error('Erreur lors du chargement des enseignants :', error);
      }
    },
    async loadPlannings() {
      try {
        const { getAllEmploisDuTemps } = usePlanning();
        const { getAllClasses } = useClasses();
        const { getAllCours } = useCourses();
        const { getAllTeachers } = useTeachers();

        const [
          planningsResponse,
          classesResponse,
          coursesResponse,
          teachersResponse
        ] = await Promise.all([
          getAllEmploisDuTemps(),
          getAllClasses(),
          getAllCours(),
          getAllTeachers()
        ]);

        this.classes = classesResponse.data || [];
        this.courses = coursesResponse.data || [];
        this.teachers = teachersResponse.data || [];

        this.plannings = planningsResponse.data.map(planning => {
          const classeData = this.classes.find(classe => classe.ID_classe === planning.classeIDClasse) || { Nom_classe: 'Classe non assignée' };
          const coursData = this.courses.find(cours => cours.ID_cours === planning.courIDCours) || { Nom_cours: 'Cours non assigné' };
          const enseignantData = this.teachers.find(teacher => teacher.ID_enseignant === planning.enseignantIDEnseignant) || { Nom: 'Enseignant non assigné', Prenom: '' };
          return {
            ...planning,
            classeData,
            coursData,
            enseignantData
          };
        });
      } catch (error) {
        console.error('Erreur lors du chargement des emplois du temps :', error);
      }
    },
    async editPlanning(planning) {
      this.editMode = true;
      this.formData = { ...planning };
      this.editedPlanningId = planning.ID_EDT;
    },
    async deletePlanning(ID_EDT) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet emploi du temps ?')) {
        const { deleteEmploiDuTemps } = usePlanning();
        try {
          await deleteEmploiDuTemps(ID_EDT);
          this.loadPlannings();
        } catch (error) {
          console.error('Erreur lors de la suppression :', error);
        }
      }
    },
    async submitForm() {
      const { addEmploiDuTemps, updateEmploiDuTemps } = usePlanning();
      const planningData = {
        Jour: this.formData.Jour,
        Heure_debut: this.formData.Heure_debut,
        Heure_fin: this.formData.Heure_fin,
        classeIDClasse: this.formData.classeIDClasse,
        courIDCours: this.formData.courIDCours,
        enseignantIDEnseignant: this.formData.enseignantIDEnseignant
      };

      if (this.editMode) {
        try {
          await updateEmploiDuTemps(this.editedPlanningId, planningData);
          this.editMode = false;
          this.loadPlannings();
        } catch (error) {
          console.error('Erreur lors de la modification :', error);
        }
      } else {
        try {
          await addEmploiDuTemps(planningData);
          this.loadPlannings();
        } catch (error) {
          console.error('Erreur lors de l\'ajout :', error);
        }
      }
      this.clearForm();
    },
    clearForm() {
      this.formData = {
        Jour: '',
        Heure_debut: '',
        Heure_fin: '',
        classeIDClasse: null,
        courIDCours: null,
        enseignantIDEnseignant: null
      };
      this.editMode = false;
      this.editedPlanningId = null;
    }
  }
};
</script>

<style scoped>
.planning-management {
  padding: 20px;
  background-color: #f4f4f4;
}

.title {
  text-align: center;
  color: #005A9C;
  margin-bottom: 20px;
}

.planning-list-container {
  margin-bottom: 20px;
}

.planning-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  margin-bottom: 10px;
}

.planning-info {
  display: flex;
  flex-direction: column;
}

.day, .time, .class, .course, .teacher {
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