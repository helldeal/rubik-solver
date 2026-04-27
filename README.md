# 🎲 Rubik's Solver - Application Interactive 3D

Une Single Page Application (SPA) complète permettant de visualiser, configurer et résoudre un Rubik's Cube 3D interactif, avec un guide pas-à-pas pédagogique.

## 🎨 Stack Technique

- **Framework**: React 18 + TypeScript (strict mode)
- **Build Tool**: Vite
- **3D Rendering**: Three.js via @react-three/fiber + @react-three/drei
- **Animations**: Framer Motion
- **UI Framework**: Tailwind CSS
- **State Management**: Zustand
- **CSS Preprocessor**: PostCSS avec @tailwindcss/postcss

## 📁 Architecture du Projet

```
src/
├── components/        # Composants React (UI)
├── engine/           # Moteur sans dépendances React
├── hooks/            # Hooks React réutilisables
├── store/            # Store Zustand global
├── types/            # Types TypeScript centralisés
└── constants/        # Constantes (algorithmes, etc.)
```

## 🚀 Démarrage Rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

L'application s'ouvrira sur `http://localhost:5174`

### Build pour Production

```bash
npm run build
```

### Vérification du Code

```bash
npm run lint
```

## ✨ Fonctionnalités Implémentées

- ✅ Visualisation 3D du Rubik's Cube (Three.js + React Three Fiber)
- ✅ 18 mouvements standards (U, D, L, R, F, B + variantes)
- ✅ Animations fluides de rotations 3D
- ✅ Générateur de scrambles aléatoires
- ✅ Éditeur complet pour éditer manuellement chaque facette
- ✅ Trois solveurs (LBL, CFOP, Kociemba)
- ✅ Panneau pédagogique avec:
	- Explications en français de chaque étape
	- Navigation entre les étapes (clic directe)
	- Boutons Précédent/Suivant
	- Lecture automatique avec Play/Pause
	- Contrôle de vitesse (0.25x - 4x)
- ✅ Design responsive et moderne
- ✅ TypeScript strict mode
- ✅ 28 fichiers TypeScript/TSX organisés
## 🔧 Configuration

Le projet utilise:
- **TypeScript strict mode** pour une meilleure sécurité des types
- **Vite** pour le développement rapide et les builds optimisés
- **Tailwind CSS** pour les styles utilitaires
- **Zustand** pour une gestion d'état légère

## 📝 Licence

MIT - Libre d'utilisation

---

**Développé avec ❤️ en React + TypeScript**
# rubik-solver
