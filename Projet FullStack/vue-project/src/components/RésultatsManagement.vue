<template>
  <div class="results-management">
    <h2 class="title">Gestion des Résultats</h2>
    <div class="results-table-container">
      <table class="results-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Résultat</th>
            <th>Étudiant</th>
            <th>Examen</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resultat in resultats" :key="resultat.ID_resultat">
            <td>{{ resultat.ID_resultat }}</td>
            <td>{{ resultat.Resultat }}</td>
            <td>{{ findEtudiantName(resultat.etudiantIDEtudiant) }}</td>
            <td>{{ findExamenDescription(resultat.examenIDExamen) }}</td>
            <td>
              <button @click="editResultat(resultat)" class="edit-button">Modifier</button>
              <button @click="deleteResultat(resultat.ID_resultat)" class="delete-button">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="result-form">
      <h3 v-if="!editMode">{{ editMode ? 'Modifier le résultat' : 'Ajouter un nouveau résultat' }}</h3>
      <form @submit.prevent="submitForm" class="form">
        <label for="resultat">Résultat :</label>
        <input type="number" id="resultat" v-model="formData.Resultat" required class="input">
        <label for="etudiant">Étudiant :</label>
        <select id="etudiant" v-model="formData.Etudiant" required class="select">
          <option value="">Sélectionner un étudiant</option>
          <option v-for="etudiant in etudiants" :key="etudiant.ID_etudiant" :value="etudiant.ID_etudiant">
            {{ etudiant.Nom }} {{ etudiant.Prenom }}
          </option>
        </select>
        <label for="examen">Examen :</label>
        <select id="examen" v-model="formData.examenIDExamen" required class="select">
          <option value="">Sélectionner un examen</option>
          <option v-for="examen in examens" :key="examen.ID_examen" :value="examen.ID_examen">
            {{ examen.Date_examen }} - {{ examen.Description }}
          </option>
        </select>
        <button type="submit" class="submit-button">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>
  </div>
</template>
  
  <script>
  import useResultat from '../service/ServiceRésultatsManagement';
  import useEtudiant from '../service/ServiceStudentsManagement'; // Ajustez le chemin si nécessaire
  import useExamen from '../service/ServiceExamensManagement'; // Assurez-vous que le chemin d'accès est correct

  export default {
    name: 'ResultatsManagement',
    data() {
      return {
        resultats: [],
        etudiants: [], // Consolidé
        examens: [], // Ajoutez cette ligne pour stocker la liste des examens
        editMode: false,
        formData: {
          Resultat: 0,
          etudiantIDEtudiant: null,
          examenIDExamen: null // Ajoutez cette ligne
        },
        editedResultatId: null,
      };
    },
    async mounted() {
      this.loadResultats();
      this.loadEtudiants();
      this.loadExamens(); // Ajoutez cette ligne pour charger les examens
    },
    methods: {
      async loadExamens() {
    try {
      const { getAllExamens } = useExamen();
      const examensResponse = await getAllExamens();
      this.examens = examensResponse.data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des examens :', error);
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
      async loadResultats() {
        try {
          const { getAllResultats } = useResultat();
          const resultatsResponse = await getAllResultats();
          this.resultats = resultatsResponse.data || [];
        } catch (error) {
          console.error('Erreur lors du chargement des résultats :', error);
        }
      },
      findEtudiantName(ID_etudiant) {
  const etudiant = this.etudiants.find(et => et.ID_etudiant === ID_etudiant);
  return etudiant ? `${etudiant.Nom} ${etudiant.Prenom}` : 'Non trouvé';
},
findExamenDescription(ID_examen) {
  const examen = this.examens.find(ex => ex.ID_examen === ID_examen);
  return examen ? examen.Description : 'Non trouvé';
},
      async editResultat(resultat) {
        this.editMode = true;
        this.formData.Resultat = resultat.Resultat;
        this.editedResultatId = resultat.ID_resultat;
      },
      async deleteResultat(ID_resultat) {
        if (ID_resultat === undefined) {
          console.error('Erreur: ID du résultat non défini');
          return;
        }
  
        if (confirm('Êtes-vous sûr de vouloir supprimer ce résultat ?')) {
          try {
            const { deleteResultat } = useResultat();
            await deleteResultat(ID_resultat);
            this.resultats = this.resultats.filter(resultat => resultat.ID_resultat !== ID_resultat);
          } catch (error) {
            console.error('Erreur:', error);
          }
        }
      },
      async submitForm() {
  if (this.editMode) {
    try {
      const { updateResultat } = useResultat();
      await updateResultat(this.editedResultatId, {
        Resultat: this.formData.Resultat,
        etudiantIDEtudiant: this.formData.Etudiant,
        examenIDExamen: this.formData.examenIDExamen // Ajoutez cette ligne pour mettre à jour l'examen
      });
      const updatedResultatIndex = this.resultats.findIndex(resultat => resultat.ID_resultat === this.editedResultatId);
      if (updatedResultatIndex !== -1) {
        this.resultats[updatedResultatIndex] = {
          Resultat: this.formData.Resultat,
          etudiantIDEtudiant: this.formData.Etudiant,
          examenIDExamen: this.formData.examenIDExamen, // Ajoutez cette ligne pour mettre à jour l'examen
          ID_resultat: this.editedResultatId
        };
        this.editMode = false;
        this.clearForm();
      }
    } catch (error) {
      console.error('Erreur lors de la modification du résultat :', error);
    }
  } else {
    try {
      const { addResultat } = useResultat();
      const newResultat = await addResultat({
        Resultat: this.formData.Resultat,
        etudiantIDEtudiant: this.formData.Etudiant,
        examenIDExamen: this.formData.examenIDExamen // Ajoutez cette ligne pour ajouter l'examen
      });
      if (newResultat) {
        this.resultats.push(newResultat);
        this.clearForm();
        this.loadResultats(); // Recharger les résultats pour rafraîchir la liste
      } else {
        console.error('Erreur lors de l\'ajout du résultat.');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }
},
      clearForm() {
        this.formData.Resultat = 0;
      }
    }
  }
  </script>
  
  <style scoped>
.results-management {
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

.results-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.results-table th, .results-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.results-table th {
  background-color: #f2f2f2;
  color: black;
}

.results-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.results-table tr:hover {
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
  