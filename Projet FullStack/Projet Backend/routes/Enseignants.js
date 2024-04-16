import { Router } from "express";
import { listerEnseignants, obtenirEnseignantParID, creerEnseignant, mettreAJourEnseignant, supprimerEnseignant } from "../controllers/Enseignants.js";
import enseignantRules from "../validations/Enseignants.js";
const router6 = Router();

router6
    .get("/", listerEnseignants)
    .get("/:id", obtenirEnseignantParID)
    .post("/",enseignantRules, creerEnseignant)
    .put("/:id",enseignantRules, mettreAJourEnseignant)
    .delete("/:id", supprimerEnseignant);

export default router6;
