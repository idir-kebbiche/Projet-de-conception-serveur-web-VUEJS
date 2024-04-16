import { Router } from "express";
import { listerCours, obtenirCoursParID, creerCours, mettreAJourCours, supprimerCours, getMaterielsByCours } from "../controllers/Cours.js";
import coursRules from "../validations/Cours.js";

const router8 = Router();

router8
  .get("/", listerCours)
  .get("/:id", obtenirCoursParID)
  .get("/:id/materiels", getMaterielsByCours) // Nouvelle route pour récupérer les matériels d'un cours
  .post("/", coursRules, creerCours)
  .put("/:id", coursRules, mettreAJourCours)
  .delete("/:id", supprimerCours);

export default router8;