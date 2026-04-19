# 🚗 Premium Car Rental - Application de Location de Voitures

Une application web moderne de location de voitures construite avec **Next.js 14**, **TypeScript**, et **Tailwind CSS**.

## ✨ Fonctionnalités

### Partie Publique
- 🚘 Catalogue de voitures avec filtrage avancé
- 📅 Système de réservation en ligne
- 🖼️ Galeries photos pour chaque véhicule
- 📱 Design responsive (mobile, tablette, desktop)
- ⚡ Performance optimisée avec Next.js App Router
- 🎨 Animations fluides avec Framer Motion

### Panneau d'Administration
- 📊 Dashboard avec statistiques et graphiques
- 📋 Gestion des réservations (confirmation, annulation)
- 🚗 Gestion du parc automobile (ajout, modification, suppression)
- 👥 Gestion des clients
- 📄 Gestion des contrats
- 💰 Suivi des dépenses
- 📅 Planning visuel des locations
- 📈 Analyses et rapports détaillés
- 🔔 Système de notifications
- 💬 Gestion des messages clients

## 🛠️ Technologies Utilisées

- **Framework:** Next.js 14 (App Router)
- **Langage:** TypeScript
- **Styling:** Tailwind CSS 4
- **Authentification:** NextAuth.js
- **Formulaires:** React Hook Form + Zod
- **Graphiques:** Chart.js + react-chartjs-2
- **Animations:** Framer Motion
- **Icônes:** Lucide React
- **Emails:** Nodemailer + Resend
- **PDF:** @react-pdf/renderer
- **UI Components:** React Hot Toast

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte email (optionnel, pour les notifications)

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/sebbardev/rentalcar-demo.git
cd rentalcar-demo
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Modifiez `.env.local` avec vos configurations :

```env
# NextAuth
NEXTAUTH_SECRET="votre-secret-ici"
NEXTAUTH_URL="http://localhost:3000"

# Email (optionnel)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="votre_utilisateur"
EMAIL_SERVER_PASSWORD="votre_password"
EMAIL_FROM="noreply@car-rental.com"
```

**Générer un secret sécurisé :**
```bash
openssl rand -base64 32
```

### 4. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 👤 Accès Admin (Demo)

- **Email:** `admin@car-rental.com`
- **Password:** `admin123`

URL d'administration : [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 📁 Structure du Projet

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (site)/            # Pages publiques
│   │   ├── admin/             # Panneau d'administration
│   │   └── api/               # API Routes
│   ├── components/            # Composants React
│   │   ├── admin/             # Composants admin
│   │   ├── booking/           # Composants réservation
│   │   └── cars/              # Composants voitures
│   ├── services/              # Services métier
│   ├── lib/                   # Utilitaires
│   ├── hooks/                 # Custom hooks
│   ├── types/                 # Types TypeScript
│   └── emails/                # Templates d'emails
├── public/                    # Assets statiques
├── prisma/                    # Configuration base de données
└── data/                      # Données mock (demo mode)
```

## 🌐 Déploiement sur Vercel

### Méthode 1: Via le Dashboard Vercel

1. **Pousser sur GitHub** (déjà fait)
2. **Aller sur [Vercel](https://vercel.com)**
3. **Cliquer sur "Add New" → "Project"**
4. **Importer votre repository GitHub**
5. **Configurer les variables d'environnement :**
   - `NEXTAUTH_SECRET` : Générez avec `openssl rand -base64 32`
   - `NEXTAUTH_URL` : `https://votre-projet.vercel.app`
   - Variables email (optionnel)
6. **Cliquer sur "Deploy"**

### Méthode 2: Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

📖 **Guide complet de déploiement :** Voir [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## ⚙️ Scripts Disponibles

```bash
npm run dev          # Lancer en mode développement
npm run build        # Builder pour la production
npm run start        # Lancer en production
npm run lint         # Vérifier le code avec ESLint
```

## 📝 Mode Demo

Cette application fonctionne en **mode démo** avec des données fictives :
- ✅ Aucune base de données requise
- ✅ Aucun backend externe nécessaire
- ✅ Parfait pour la démonstration et le développement
- ⚠️ Les données sont réinitialisées à chaque redémarrage

## 🔧 Configuration pour la Production

### Base de Données

Pour passer en production avec une base de données réelle :
1. Configurer PostgreSQL ou MySQL
2. Ajouter Prisma avec schéma de base de données
3. Mettre à jour les services pour utiliser l'API backend

### Upload de Fichiers

⚠️ **Important :** Vercel utilise un système de fichiers éphémère. Pour les uploads persistants :
- Utilisez **Vercel Blob Storage**
- Ou **AWS S3** / **Cloudinary**

### Emails

Pour les emails en production :
- **Resend** (recommandé pour Vercel) : `RESEND_API_KEY`
- Ou configurez un serveur **SMTP**

## 📄 Licence

Ce projet est propriétaire. Tous droits réservés.

## 👨‍💻 Auteur

**Sebbar Dev**
- GitHub: [@sebbardev](https://github.com/sebbardev)

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

**Développé avec ❤️ en utilisant Next.js 14**
