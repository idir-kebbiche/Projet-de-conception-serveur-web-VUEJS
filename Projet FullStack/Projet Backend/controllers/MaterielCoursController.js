// Import du modèle MaterielCours ainsi que des autres modèles nécessaires
import MaterielCours from '../models/MaterielCours.js';
import Cours from '../models/Cours.js';
import Materiel from '../models/Matériel.js';

class MaterielCoursController {
    // Ajouter une relation entre un cours et un matériel
    async addRelation(req, res) {
        const { coursId, materielId } = req.body;
        try {
            const relation = await MaterielCours.create({ coursId, materielId });
            res.status(201).json(relation);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Récupérer toutes les relations
    async getAllRelations(req, res) {
        try {
            const relations = await MaterielCours.findAll({
                include: [Cours, Materiel]
            });
            res.status(200).json(relations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Mettre à jour une relation
    async updateRelation(req, res) {
        const { relationId, coursId, materielId } = req.body;
        try {
            const updated = await MaterielCours.update({ coursId, materielId }, {
                where: { ID: relationId }
            });
            if (updated[0] > 0) {
                res.status(200).json({ message: "Relation updated successfully." });
            } else {
                res.status(404).json({ message: "Relation not found." });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Supprimer une relation
    async deleteRelation(req, res) {
        const { relationId } = req.params;
        try {
            const deleted = await MaterielCours.destroy({
                where: { ID: relationId }
            });
            if (deleted) {
                res.status(200).json({ message: "Relation deleted successfully." });
            } else {
                res.status(404).json({ message: "Relation not found." });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

// Exporter l'instance du contrôleur
export default new MaterielCoursController();
