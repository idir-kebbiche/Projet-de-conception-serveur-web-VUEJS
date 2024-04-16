<template>
  <div class="students-management">
    <h2 class="title">Gestion des étudiants</h2>
    <div class="students-table-container">
      <table class="students-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Date de naissance</th>
            <th>Adresse</th>
            <th>Numéro de téléphone</th>
            <th>Email</th>
            <th>Classe</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="etudiant in etudiants" :key="etudiant.ID_etudiant">
            <td>{{ etudiant.ID_etudiant }}</td>
            <td>{{ etudiant.Nom }}</td>
            <td>{{ etudiant.Prenom }}</td>
            <td>{{ etudiant.Date_naissance }}</td>
            <td>{{ etudiant.Adresse }}</td>
            <td>{{ etudiant.Numero_telephone }}</td>
            <td>{{ etudiant.Email }}</td>
            <td>{{ etudiant.classe.Nom_classe }}</td>
            <td>
              <button @click="editEtudiant(etudiant)" class="edit-button">Modifier</button>
              <button @click="deleteEtudiant(etudiant.ID_etudiant)" class="delete-button">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="student-form">
      <h3 v-if="!editMode">{{ editMode ? 'Modifier l\'étudiant' : 'Ajouter un nouvel étudiant' }}</h3>
      <form @submit.prevent="submitForm" class="form">
        <label for="nom">Nom :</label>
        <input type="text" id="nom" v-model="formData.Nom" required class="input">
        <label for="prenom">Prénom :</label>
        <input type="text" id="prenom" v-model="formData.Prenom" required class="input">
        <label for="date_naissance">Date de naissance :</label>
        <input type="date" id="date_naissance" v-model="formData.Date_naissance" required class="input">
        <label for="adresse">Adresse :</label>
        <input type="text" id="adresse" v-model="formData.Adresse" class="input">
        <label for="numero_telephone">Numéro de téléphone :</label>
        <input type="text" id="numero_telephone" v-model="formData.Numero_telephone" class="input">
        <label for="email">Email :</label>
        <input type="email" id="email" v-model="formData.Email" class="input">
        <label for="mot_de_passe">Mot de passe :</label>
        <input type="password" id="mot_de_passe" v-model="formData.Mot_de_passe" required class="input">
        <label for="classe">Classe :</label>
        <select id="classeID" v-model="formData.classeIDClasse" required class="select">
          <option value="">Sélectionner une classe</option>
          <option v-for="classe in classes" :key="classe.ID_classe" :value="classe.ID_classe">
            {{ classe.Nom_classe }}
          </option>
        </select>
        <button type="submit" class="submit-button">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>
  </div>
</template>



<script>
import useEtudiant from '../service/ServiceStudentsManagement';
import useClasses from '../service/ServiceClassesManagement';

export default {
  name: 'EtudiantsManagement',
  data() {
    return {
      etudiants: [],
      classes: [],
      editMode: false,
      formData: {
        Nom: '',
        Prenom: '',
        Date_naissance: '',
        Adresse: '',
        Numero_telephone: '',
        Email: '',
        Mot_de_passe: '',
        classeIDClasse: null
      },
      editedEtudiantId: null
    };
  },
  async mounted() {
    await this.loadEtudiants();
    await this.loadClasses();
  },
  methods: {
    async loadEtudiants() {
  const { getAllStudents } = useEtudiant();
  const { getAllClasses } = useClasses(); // Assurez-vous d'avoir cette méthode dans votre service de classes

  try {
    const [studentsResponse, classesResponse] = await Promise.all([
      getAllStudents(),
      getAllClasses(),
    ]);

    this.classes = classesResponse.data || []; // Stocker les données de classes pour les utiliser dans d'autres parties du composant

    // S'assurer que les données étudiantes sont dans un tableau
    const etudiantsData = studentsResponse.data;
    if (Array.isArray(etudiantsData)) {
      this.etudiants = etudiantsData.map(etudiant => {
        // Trouver les données de classe correspondantes pour chaque étudiant
        const classeData = this.classes.find(classe => classe.ID_classe === etudiant.classeIDClasse) || { Nom_classe: 'Classe non spécifiée' };
        return {
          ...etudiant,
          classe: classeData // Ajoutez les données de classe enrichies à chaque étudiant
        };
      });
    } else {
      console.error('La réponse de l\'API n\'est pas un tableau:', etudiantsData);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des étudiants:', error);
  }
},

async loadClasses() {
      try {
        const { getAllClasses } = useClasses();
        const response = await getAllClasses();
        this.classes = response.data || [];
      } catch (error) {
        console.error('Erreur lors du chargement des classes :', error);
      }
    },
    async editEtudiant(etudiant) {
      this.editMode = true;
      this.formData = { ...etudiant };
      this.editedEtudiantId = etudiant.ID_etudiant;
    },
    async deleteEtudiant(etudiantId) {
      if (etudiantId === undefined) {
        console.error('Erreur: ID de l\'étudiant non défini');
        return;
      }
      if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
        try {
          const { deleteStudent } = useEtudiant();
          await deleteStudent(etudiantId);
          this.etudiants = this.etudiants.filter(etudiant => etudiant.ID_etudiant !== etudiantId);
        } catch (error) {
          console.error('Erreur:', error);
        }
      }
    },
    async submitForm() {
            const { addStudent, updateStudent } = useEtudiant();
            const { getClasseById } = useClasses(); // Utilisation correcte ici

            try {
                let classeSelectionnee = null;
                if (this.formData.classeIDClasse) {
                    const response = await getClasseById(this.formData.classeIDClasse);
                    classeSelectionnee = response;
                }

                const etudiantData = {
    ...this.formData,
    classeIDClasse: this.formData.classeIDClasse // Utilisez directement l'ID du formulaire
};

                if (this.editMode) {
                    await updateStudent(this.editedEtudiantId, etudiantData);
                } else {
                    await addStudent(etudiantData);
                }
                await this.loadEtudiants();
                this.editMode = false;
            } catch (error) {
                console.error('Erreur lors de la soumission du formulaire :', error);
                if (error.response) {
                    console.error('Réponse du serveur :', error.response.data);
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
        classeIDClasse: null
      };
    }
  }
};
</script>

<style scoped>
.students-management {
  padding: 20px;
  background-color: #f4f4f4;
}

.title {
  text-align: center;
  color: #005A9C;
  margin-bottom: 20px;
}

.logout-button, .edit-button, .delete-button {
  padding: 5px 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button {
  background-color: #ff4d4d;
  color: white;
}

.edit-button {
  background-color: #4CAF50;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.students-list {
  margin-bottom: 20px;
}

.student-item {
  background-color: white;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
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

.students-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.students-table th, .students-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.students-table th {
  background-color: #f2f2f2;
  color: black;
}

.edit-button, .delete-button {
  /* Votre style précédent pour les boutons */
  margin-left: 4px; /* Ajoute un peu d'espace entre les boutons */
}

/* Style supplémentaire pour améliorer la lisibilité sur de grandes tables */
.students-table tr:nth-child(even){background-color: #f9f9f9;}

.students-table tr:hover {background-color: #ddd;}
</style>
