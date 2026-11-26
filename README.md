# Portfolio — Fadyl Akolawole Eisse

Portfolio bilingue (FR / EN) avec visionneuse de CV intégrée.
Technologies : React 19, Vite 8, Tailwind CSS 4, icônes Lucide et react-pdf (pdf.js).

## Lancer le site en local

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:5173
```

Version de production :

```bash
npm run build      # génère le dossier dist/
npm run preview    # http://localhost:4173
```

## Architecture

```
portfolio/
├── index.html                 # Métadonnées, polices, thème initial, formulaire Netlify caché
├── netlify.toml               # Configuration Netlify
├── vercel.json                # Configuration Vercel
├── public/
│   ├── favicon.svg
│   ├── og-image.jpg       # Image d'aperçu lors du partage du lien
│   └── cv/
│       ├── CV-FR.pdf          # ← CV en français
│       └── CV-EN.pdf          # ← CV en anglais
└── src/
    ├── main.jsx               # Point d'entrée
    ├── App.jsx                # Assemblage des sections + pied de page
    ├── index.css              # Palette (clair/sombre), animations
    ├── assets/photo.jpg       # Photo de profil (extraite du CV)
    ├── content/content.js     # TOUT le texte du site, en FR et en EN
    ├── context/Preferences.jsx# Langue + thème (mémorisés dans le navigateur)
    └── components/
        ├── Navbar.jsx         # Barre noire, bascule FR/EN, thème, menu mobile
        ├── Hero.jsx           # Accueil plein écran animé (effet machine à écrire)
        ├── Profile.jsx        # Profil + frises Expériences / Formations
        ├── Skills.jsx         # Cartes de compétences
        ├── Projects.jsx       # Cartes de projets + fiche détaillée
        ├── CvSection.jsx      # Sélecteur FR/EN, téléchargements, ouverture
        ├── CvViewer.jsx       # Visionneuse PDF (chargée à la demande)
        ├── Contact.jsx        # Formulaire, coordonnées, réseaux
        ├── BrandIcons.jsx     # Logos LinkedIn / GitHub
        └── ui.jsx             # Section, titres, Reveal (animation au défilement)
```

## Mettre à jour le contenu

- **Textes** : modifiez uniquement `src/content/content.js` (bloc `fr` et bloc `en`).
- **CV** : remplacez `public/cv/CV-FR.pdf` et `public/cv/CV-EN.pdf` en gardant ces noms exacts.
- **Photo** : remplacez `src/assets/photo.jpg` (format carré conseillé).
- **Emplacements à compléter** (repérés par « À COMPLÉTER » dans `content.js`) :
  - `certifications` : vide, donc la rubrique est masquée. Ajoutez vos certifications dès que vous les obtenez.
  - `projects.items[].link` : lien GitHub ou démo d'un projet. Le lien s'affiche automatiquement s'il est renseigné.

## Aperçu lors du partage du lien

`public/og-image.jpg` est l'image affichée quand le lien est partagé (LinkedIn, WhatsApp…).
Son adresse complète est remplie automatiquement au build sur Netlify et Vercel.
Avec un nom de domaine personnalisé, définissez la variable d'environnement
`SITE_URL` (ex. `https://mondomaine.com`) dans les réglages de l'hébergeur.

## Formulaire de contact

- **Sur Netlify** : le formulaire fonctionne sans configuration (Netlify Forms). Les messages arrivent
  dans *Netlify → Site → Forms*. Activez les notifications par e-mail dans *Forms → Form notifications*.
- **Ailleurs (Vercel, local)** : le formulaire ouvre la messagerie du visiteur avec le message pré-rempli.

## Déploiement

### Netlify (recommandé)
1. Publiez ce dossier sur GitHub.
2. Netlify → *Add new site → Import an existing project* → choisissez le dépôt.
3. Les réglages sont lus dans `netlify.toml` (build : `npm run build`, dossier : `dist`).
4. *Site configuration → Change site name* → `fadyl-portfolio` → `https://fadyl-portfolio.netlify.app`.

Sans GitHub : `npm run build`, puis glissez le dossier `dist/` sur https://app.netlify.com/drop.

### Vercel
Importez le dépôt sur vercel.com : le framework Vite est détecté et `vercel.json` fixe le reste.
