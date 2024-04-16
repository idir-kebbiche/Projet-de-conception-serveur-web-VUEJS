// Import des modules nécessaires
import express from 'express';
import MaterielCoursController from '../controllers/MaterielCoursController.js';

// Création d'un routeur Express
const router = express.Router();

// Route pour ajouter une relation entre un cours et un matériel
router.post('/materiel-cours', MaterielCoursController.addRelation);

// Route pour récupérer toutes les relations
router.get('/materiel-cours', MaterielCoursController.getAllRelations);

// Route pour mettre à jour une relation
router.put('/materiel-cours', MaterielCoursController.updateRelation);

// Route pour supprimer une relation
router.delete('/materiel-cours/:relationId', MaterielCoursController.deleteRelation);

// Export du routeur pour utilisation dans l'application principale
export default router;
