<template>
  <div class="equipment-management">
    <h2 class="title">Gestion du Matériel</h2>
    <div class="equipment-list-container">
      <ul class="equipment-list">
        <li v-for="equipment in equipments" :key="equipment.ID_materiel" class="equipment-item">
          <div class="equipment-info">
            <span class="id">ID : {{ equipment.ID_materiel }}</span>
            <span class="name">{{ equipment.Nom_materiel }}</span>
          </div>
          <div class="equipment-actions">
            <button @click="editEquipment(equipment)" class="edit-button">Modifier</button>
            <button @click="deleteEquipment(equipment.ID_materiel)" class="delete-button">Supprimer</button>
          </div>
        </li>
      </ul>
    </div>
    <div class="equipment-form">
      <h3 v-if="!editMode">Ajouter un nouveau matériel</h3>
      <h3 v-else>Modifier le matériel</h3>
      <form @submit.prevent="submitForm" class="form">
        <label for="equipment_name">Nom du matériel :</label>
        <input type="text" id="equipment_name" v-model="formData.Nom_materiel" required class="input">
        <button type="submit" class="submit-button">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import useEquipment from '../service/ServiceMatérielManagement';

export default {
  name: 'EquipmentManagement',
  data() {
    return {
      equipments: [],
      editMode: false,
      formData: {
        Nom_materiel: '',
      },
      editedEquipmentId: null
    };
  },
  async mounted() {
    this.loadEquipments();
  },
  methods: {
    async loadEquipments() {
      try {
        const { getAllMateriels } = useEquipment();
        const response = await getAllMateriels();
        this.equipments = response.data;
      } catch (error) {
        console.error('Erreur lors du chargement du matériel :', error);
      }
    },
    editEquipment(equipment) {
      this.editMode = true;
      this.formData = { ...equipment };
      this.editedEquipmentId = equipment.ID_materiel;
    },
    async deleteEquipment(ID_materiel) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) {
        const { deleteMateriel } = useEquipment();
        try {
          await deleteMateriel(ID_materiel);
          this.loadEquipments(); // Recharger la liste après suppression
        } catch (error) {
          console.error('Erreur lors de la suppression :', error);
        }
      }
    },
    async submitForm() {
      const { addMateriel, updateMateriel } = useEquipment();
      if (this.editMode) {
        try {
          await updateMateriel(this.editedEquipmentId, this.formData);
          this.editMode = false;
          this.loadEquipments(); // Recharger la liste après modification
        } catch (error) {
          console.error('Erreur lors de la modification :', error);
        }
      } else {
        try {
          await addMateriel(this.formData);
          this.loadEquipments(); // Recharger la liste après ajout
        } catch (error) {
          console.error('Erreur lors de l\'ajout :', error);
        }
      }
      this.clearForm();
    },
    clearForm() {
      this.formData = {
        Nom_materiel: '',
      };
      this.editMode = false;
      this.editedEquipmentId = null;
    }
  }
};
</script>

<style scoped>
.equipment-management {
  padding: 20px;
  background-color: #f4f4f4;
}

.title {
  text-align: center;
  color: #005A9C;
  margin-bottom: 20px;
}

.equipment-list-container {
  margin-bottom: 20px;
}

.equipment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  margin-bottom: 10px;
}

.equipment-info {
  display: flex;
  flex-direction: column;
}

.id, .name {
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