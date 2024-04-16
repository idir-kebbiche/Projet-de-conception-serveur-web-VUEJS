import {Cours} from "../models/relations.js";
import { validationResult } from "express-validator";

// Lister tous les cours
export const listerCours = async (req, res) => {
    try {
        const cours = await Cours.findAll(); // Utilisation de la classe RelationsManager pour accéder à Cours
        res.status(200).json({ data: cours });
    } catch (error) {
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des cours." });
    }
}

// Obtenir un cours spécifique par son ID
export const obtenirCoursParID = async (req, res) => {
    try {
        const cours = await Cours.findByPk(req.params.id); // Utilisation de la classe RelationsManager pour accéder à Cours
        if (!cours) {
            res.status(404).json({ message: "Cours introuvable." });
        } else {
            res.status(200).json({ data: cours });
        }
    } catch (error) {
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération du cours." });
    }
}

// Créer un nouveau cours
export const creerCours = async (req, res) => {
    // Validation des données
    const erreursValidation = validationResult(req);
    if (!erreursValidation.isEmpty()) {
        return res.status(400).json({ erreurs: erreursValidation.array() });
    }

    try {
        const nouveauCours = await Cours.create(req.body); // Utilisation de la classe RelationsManager pour accéder à Cours
        res.status(201).json({ data: nouveauCours, message: "Cours créé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Une erreur s'est produite lors de la création du cours." });
    }
}

// Mettre à jour un cours existant
export const mettreAJourCours = async (req, res) => {
    // Validation des données
    const erreursValidation = validationResult(req);
    if (!erreursValidation.isEmpty()) {
        return res.status(400).json({ erreurs: erreursValidation.array() });
    }

    try {
        const cours = await Cours.findByPk(req.params.id); // Utilisation de la classe RelationsManager pour accéder à Cours
        if (!cours) {
            res.status(404).json({ message: "Cours introuvable." });
        } else {
            await cours.update(req.body);
            res.status(200).json({ data: cours, message: "Cours mis à jour avec succès." });
        }
    } catch (error) {
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour du cours." });
    }
}

// Supprimer un cours existant
export const supprimerCours = async (req, res) => {
    try {
        const cours = await Cours.findByPk(req.params.id); // Utilisation de la classe RelationsManager pour accéder à Cours
        if (!cours) {
            res.status(404).json({ message: "Cours introuvable." });
        } else {
            await cours.destroy();
            res.status(200).json({ message: "Cours supprimé avec succès." });
        }
    } catch (error) {
        res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du cours." });
    }
}

export const getMaterielsByCours = async (req, res) => {
    const { id } = req.params;
  
    try {
      const cours = await Cours.findByPk(id);
      if (!cours) {
        return res.status(404).json({ message: 'Cours introuvable' });
      }
  
      const materiels = await cours.getMateriels();
      res.json(materiels);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des matériels', error: error.message });
    }
  };

  export const addMaterielToCours = async (req, res) => {
    const { courId, materielId } = req.body;
  
    try {
      await sequelize.transaction(async (t) => {
        const cours = await Cours.findByPk(courId, { transaction: t });
        if (!cours) {
          return res.status(404).json({ message: 'Cours introuvable' });
        }
  
        const materiel = await Materiel.findByPk(materielId, { transaction: t });
        if (!materiel) {
          return res.status(404).json({ message: 'Matériel introuvable' });
        }
  
        await cours.addMateriel(materiel, { transaction: t });
        await cours.save({ transaction: t });
  
        res.status(201).json({ message: 'Matériel ajouté au cours avec succès' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'ajout du matériel au cours', error: error.message });
    }
  };