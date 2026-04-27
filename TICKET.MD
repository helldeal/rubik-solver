🎯 Ticket — Application d'assistance Rubik's Cube 3D
Contexte & objectif
Créer une Single Page Application (SPA) complète permettant à un utilisateur de visualiser, configurer et résoudre un Rubik's Cube 3D interactif, avec un guide pas-à-pas pédagogique.
Stack : Vite + React 18 + TypeScript · Tailwind CSS · Framer Motion · Three.js (via @react-three/fiber + @react-three/drei)

Structure du projet
src/
├── components/
│   ├── cube/
│   │   ├── CubeScene.tsx          # Canvas Three.js (R3F)
│   │   ├── CubeMesh.tsx           # Géométrie 3D + matériaux
│   │   ├── MoveAnimator.tsx       # Animations de rotation par face
│   │   └── CubeEditor.tsx         # Sélecteur de couleur par facette
│   ├── solver/
│   │   ├── SolverPanel.tsx        # Panneau latéral de résolution
│   │   ├── StepCard.tsx           # Carte d'une étape (titre + description + moves)
│   │   └── MoveNotation.tsx       # Affichage notation Singmaster
│   ├── ui/
│   │   ├── Controls.tsx           # Boutons : Random, Reset, Solve, Play/Pause
│   │   ├── ProgressBar.tsx        # Avancement dans la résolution
│   │   └── SpeedSlider.tsx        # Vitesse d'animation
│   └── layout/
│       ├── Header.tsx
│       └── Layout.tsx
├── engine/
│   ├── cube/
│   │   ├── CubeModel.ts           # Modèle de données : matrice 6×3×3
│   │   ├── moves.ts               # 18 mouvements de base (U U' U2, R R'…)
│   │   ├── scrambler.ts           # Génération de mélanges aléatoires valides
│   │   └── validator.ts           # Vérification état valide du cube
│   └── solver/
│       ├── kociemba.ts            # Algorithme de résolution (Kociemba two-phase)
│       ├── cfop.ts                # Méthode CFOP step-by-step (Cross, F2L, OLL, PLL)
│       ├── lbl.ts                 # Méthode LBL (débutant)
│       └── explainer.ts           # Génération des explications texte par étape
├── hooks/
│   ├── useCubeState.ts            # Gestion state + dispatch moves
│   ├── useSolver.ts               # Lancement résolution + gestion steps
│   ├── useAnimationPlayer.ts      # Lecture automatique des étapes
│   └── useHistory.ts              # Undo/Redo
├── store/
│   └── cubeStore.ts               # Zustand store global
├── types/
│   └── cube.ts                    # Types TypeScript (FaceColor, Move, SolveStep…)
├── constants/
│   └── algorithms.ts              # Base d'algorithmes OLL/PLL + descriptions
└── App.tsx

Modèle de données
typescript// types/cube.ts

type FaceColor = 'W' | 'Y' | 'R' | 'O' | 'B' | 'G';

// État du cube : 6 faces × 3 rangées × 3 colonnes
type CubeState = FaceColor[][][]; // [face][row][col]
// Faces : 0=Up 1=Down 2=Front 3=Back 4=Left 5=Right

type MoveNotation = 'U' | "U'" | 'U2' | 'D' | "D'" | 'D2'
  | 'R' | "R'" | 'R2' | 'L' | "L'" | 'L2'
  | 'F' | "F'" | 'F2' | 'B' | "B'" | 'B2';

type SolveMethod = 'lbl' | 'cfop' | 'kociemba';

type SolveStep = {
  id: string;
  phaseLabel: string;       // ex. "Croix blanche"
  description: string;      // Explication pédagogique
  moves: MoveNotation[];    // Séquence de mouvements
  tipUrl?: string;          // Lien vers un schéma d'algo OLL/PLL
  highlightFaces?: number[]; // Faces à mettre en évidence dans la vue 3D
};

Fonctionnalités — détail
1. Visualisation 3D

Rendu avec @react-three/fiber + @react-three/drei
26 pièces (cubies) avec matériaux MeshStandardMaterial par couleur de face
OrbitControls pour rotation libre de la caméra à la souris / tactile
Animation fluide de chaque mouvement : rotation d'une tranche de 90° avec useSpring (react-spring) ou GSAP intégré dans R3F
Surbrillance de la face active pendant chaque étape de résolution
Raycaster pour sélection de facette en mode édition

2. Configuration du cube
Mode aléatoire

Bouton "Mélanger" génère N mouvements valides (défaut : 20)
Paramètre de nombre de mouvements via slider

Mode édition manuelle

Clic sur une facette → palette de 6 couleurs
Validation temps réel de l'état (vérification de parité, nb de pièces par couleur)
Message d'erreur si état impossible à résoudre

3. Moteur de résolution
Deux méthodes au choix :
LBL (Layer By Layer) — pour débutants

Croix blanche
Coins de la face blanche
Deuxième couronne
Croix jaune (OLL partiel)
Orientation des arêtes jaunes
Positionnement des coins jaunes
Orientation des coins jaunes

CFOP — pour intermédiaires

Cross
F2L (4 paires)
OLL (57 cas → recognition + algo)
PLL (21 cas → recognition + algo)

Le solveur retourne un tableau SolveStep[]. Chaque étape contient la description pédagogique + la séquence de mouvements exacts.
Pour la résolution optimale (Kociemba), utiliser le package npm rubiks-cube-solver ou min2phase porté en WASM.
4. Suivi de résolution

Barre de progression globale (étapes complétées / total)
Panneau latéral scrollable avec liste des étapes
Étape courante mise en avant (card expansée, autres réduites)
Lecture automatique : chaque mouvement s'anime à la vitesse choisie
Boutons : ▶ Play · ⏸ Pause · ⏮ Précédent · ⏭ Suivant · ⏩ +1 move
Mode "apprentissage" : afficher le move, attendre confirmation avant d'appliquer

5. Pédagogie
Chaque étape affiche :

Titre de la phase (ex. "F2L — Paire 2/4")
Explication en français (générée par explainer.ts selon le cas OLL/PLL reconnu)
Notation Singmaster des mouvements avec code couleur (U=jaune, R=rouge…)
Indicateur visuel sur le cube 3D (faces concernées en surbrillance ou légère transparence des autres)
Lien optionnel vers schéma de l'algorithme


Dépendances npm à installer
bash# Rendu 3D
npm install three @react-three/fiber @react-three/drei
npm install @types/three

# Animations UI
npm install framer-motion

# State management
npm install zustand

# Solver (choisir un)
npm install rubiks-cube-solver   # ou solution WASM

# Utils
npm install clsx tailwind-merge

Conventions de code

TypeScript strict : strict: true dans tsconfig.json
Pas de any explicite
Chaque hook dans son fichier dédié avec JSDoc minimal
Les composants Three.js (R3F) sont séparés des composants React DOM
Les fonctions pures du moteur (engine/) n'importent rien de React
Taille max d'un composant : 150 lignes → découper sinon
Tailwind uniquement via classes utilitaires (pas de style={} sauf pour les valeurs dynamiques Three.js)


Critères d'acceptation
#Critère1Le cube 3D s'affiche et tourne librement à la souris2Le bouton "Mélanger" produit un état valide animé3L'utilisateur peut colorier chaque facette manuellement4Un état invalide est détecté et signalé à l'utilisateur5Le solveur retourne une solution et la liste des étapes6Chaque mouvement s'anime fluidement en 3D7Le panneau pédagogique explique l'étape en cours8Play/Pause/Step fonctionne correctement9L'app est responsive (desktop + tablette)10Aucune erreur TypeScript en strict mode

Ordre de développement recommandé

Setup : Vite + React + TS + Tailwind + R3F, vérifier le canvas vide
CubeModel : implémenter la matrice et les 18 moves en pur TS + tests unitaires
CubeMesh : rendre les 26 cubies avec les bonnes couleurs
OrbitControls + MoveAnimator : animer un mouvement unique
useCubeState + Controls : wiring état ↔ UI ↔ 3D
Scrambler : mélange aléatoire
CubeEditor : édition manuelle + validation
Solver LBL : implémenter + explainer.ts
SolverPanel + StepCard : UI de résolution
Animation Player : lecture automatique
CFOP + Kociemba : ajout des méthodes avancées
Polish : transitions Framer Motion, responsive, dark mode