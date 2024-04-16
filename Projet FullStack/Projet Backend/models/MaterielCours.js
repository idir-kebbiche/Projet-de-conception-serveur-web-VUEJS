// Import de la connexion à la base de données
import database from "../config/connexion.js";
import { DataTypes } from "sequelize";
import Cours from "./Cours.js";
import Materiel from "./Matériel.js";

// Création du modèle pour la table de relation entre Cours et Matériel
const MaterielCours = database.define('materiel_cours', {
    materielIDMateriel: {
        type: DataTypes.INTEGER,
        references: {
            model: Materiel,
            key: 'ID_materiel'
        }
    },
    courIDCours: {
        type: DataTypes.INTEGER,
        references: {
            model: Cours,
            key: 'ID_cours'
        }
    }
}, { timestamps: false });

// Définition des associations entre les modèles Cours et Matériel
Cours.belongsToMany(Materiel, { through: MaterielCours, foreignKey: 'courIDCours' });
Materiel.belongsToMany(Cours, { through: MaterielCours, foreignKey: 'materielIDMateriel' });

export default MaterielCours;