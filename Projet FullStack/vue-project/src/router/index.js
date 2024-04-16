import { createRouter, createWebHistory } from 'vue-router';
import Accueil from '../views/Accueil.vue';
import Connexion from '../views/Connexion.vue';
import Etudiant from '../views/Gestion_1.vue';
import Enseignant from '../views/Gestion_2.vue';
import Note from '../views/Gestion_3.vue';
import Examen from '../views/Gestion_4.vue';
import EmploiDuTemps from '../views/Gestion_5.vue';

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: Accueil
  },
  {
    path: '/connexion',
    name: 'Connexion',
    component: Connexion
  },
  {
    path: '/etudiant',
    name: 'Etudiant',
    component: Etudiant,
    meta: { requiresAuth: true } // Ajout d'une métadonnée pour exiger l'authentification
  },
  {
    path: '/enseignant',
    name: 'Enseignant',
    component: Enseignant,
    meta: { requiresAuth: true } // Ajout d'une métadonnée pour exiger l'authentification
  },
  {
    path: '/note',
    name: 'Note',
    component: Note,
    meta: { requiresAuth: true } // Ajout d'une métadonnée pour exiger l'authentification
  },
  {
    path: '/examen',
    name: 'Examen',
    component: Examen,
    meta: { requiresAuth: true } // Ajout d'une métadonnée pour exiger l'authentification
  },
  {
    path: '/emploidutemps',
    name: 'EmploiDuTemps',
    component: EmploiDuTemps,
    meta: { requiresAuth: true } // Ajout d'une métadonnée pour exiger l'authentification
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Ajoute ici le guard de navigation
router.beforeEach((to, from, next) => {
  // Vérifie si la route requiert une authentification
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Vérifie si l'utilisateur n'est pas connecté
    if (!localStorage.getItem('userToken')) {
      // Redirige vers la page de connexion
      next('/connexion');
    } else {
      // Sinon, continue la navigation
      next();
    }
  } else {
    // Si la route ne requiert pas d'authentification, continue la navigation
    next();
  }
});

export default router;
