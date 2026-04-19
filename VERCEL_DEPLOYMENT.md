# Guide de Déploiement Vercel

## 📋 Prérequis

- Compte Vercel (gratuit ou payant)
- GitHub/GitLab/Bitbucket account
- Projet prêt pour la production

## 🚀 Déploiement sur Vercel

### Méthode 1: Déploiement via Dashboard Vercel (Recommandé)

#### Étape 1: Préparer le projet

1. **Pousser le code sur GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ready for Vercel deployment"
   git branch -M main
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Générer un secret NextAuth sécurisé**
   ```bash
   openssl rand -base64 32
   ```
   Copiez la valeur générée, vous en aurez besoin.

#### Étape 2: Configurer sur Vercel

1. **Connectez-vous à [Vercel](https://vercel.com)**

2. **Cliquez sur "Add New" → "Project"**

3. **Importez votre repository**
   - Connectez votre compte GitHub/GitLab/Bitbucket
   - Sélectionnez le repository de ce projet

4. **Configurez le projet**
   - **Framework Preset:** Next.js (auto-detecté)
   - **Build Command:** `next build` (par défaut)
   - **Output Directory:** `.next` (par défaut)
   - **Install Command:** `npm install` (par défaut)

5. **Ajoutez les variables d'environnement**
   
   Cliquez sur "Environment Variables" et ajoutez:
   
   | Variable | Valeur |
   |----------|--------|
   | `NEXTAUTH_SECRET` | La valeur générée avec `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | `https://your-project.vercel.app` (sera mise à jour après déploiement) |
   | `EMAIL_SERVER_HOST` | `smtp.example.com` (optionnel) |
   | `EMAIL_SERVER_PORT` | `587` (optionnel) |
   | `EMAIL_SERVER_USER` | votre utilisateur (optionnel) |
   | `EMAIL_SERVER_PASSWORD` | votre mot de passe (optionnel) |
   | `EMAIL_FROM` | `noreply@your-domain.com` (optionnel) |

6. **Déployez**
   - Cliquez sur "Deploy"
   - Attendez la fin du déploiement (~2-5 minutes)

7. **Mettez à jour NEXTAUTH_URL**
   - Après le déploiement, copiez l'URL de votre projet (ex: `https://mon-projet.vercel.app`)
   - Allez dans **Settings → Environment Variables**
   - Modifiez `NEXTAUTH_URL` avec l'URL de production
   - Redéployez le projet pour appliquer les changements

#### Étape 3: Vérifier le déploiement

1. **Visitez votre URL de production**
   - Site public: `https://your-project.vercel.app`
   - Admin: `https://your-project.vercel.app/admin/login`

2. **Testez avec les identifiants demo**
   - Email: `admin@car-rental.com`
   - Password: `admin123`

### Méthode 2: Déploiement via Vercel CLI

```bash
# 1. Installez Vercel CLI
npm i -g vercel

# 2. Connectez-vous à Vercel
vercel login

# 3. Déployez en environnement de preview
vercel

# 4. Déployez en production
vercel --prod
```

## ⚙️ Configuration Post-Déploiement

### Domaine Personnalisé

1. Allez dans **Settings → Domains**
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions de Vercel
4. Mettez à jour `NEXTAUTH_URL` avec votre domaine

### Variables d'Environnement

Après avoir ajouté un domaine personnalisé:

```
NEXTAUTH_URL=https://your-custom-domain.com
```

### Limitations Importantes

#### 📁 Upload de Fichiers

**⚠️ Important:** Vercel utilise des fonctions serverless avec un système de fichiers éphémère.

**Problème:** Les fichiers uploadés via `/api/admin/upload` seront stockés dans `/public/uploads` mais:
- ❌ Ne persistent pas entre les déploiements
- ❌ Ne sont pas partagés entre les instances serverless

**Solutions recommandées:**

1. **Vercel Blob Storage (Recommandé)**
   ```bash
   npm install @vercel/blob
   ```
   Modifiez `src/app/api/admin/upload/route.ts` pour utiliser Vercel Blob.

2. **AWS S3 / Cloudinary**
   - Configurez un service de stockage cloud
   - Modifiez l'API d'upload pour utiliser le service cloud

3. **Pour le mode démo uniquement**
   - Les uploads fonctionneront mais seront perdus après chaque déploiement
   - Acceptable pour une démonstration

#### 📧 Configuration Email

Pour les emails de confirmation de réservation:

**Option 1: Resend (Recommandé pour Vercel)**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**Option 2: SMTP**
```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com
```

## 🔧 Optimisations pour Vercel

### 1. Régions de Déploiement

Le fichier `vercel.json` est configuré pour utiliser la région Paris (`cdg1`). Vous pouvez modifier:

```json
{
  "regions": ["cdg1"]  // Paris
  // Autres options: "sfo1" (San Francisco), "iad1" (Washington), etc.
}
```

### 2. Cache et Performance

Le fichier `next.config.js` inclut déjà:
- ✅ Compression activée
- ✅ Optimisation CSS
- ✅ SWC Minifier
- ✅ Headers de cache optimisés
- ✅ Formats d'image WebP/AVIF

### 3. Monitoring

Activez Vercel Analytics et Speed Insights:
- Allez dans **Settings → Analytics**
- Activez les métriques de performance

## 🐛 Dépannage

### Erreur de Build

**Problème:** `Module not found`
```bash
# Vérifiez que toutes les dépendances sont installées
npm install

# Vérifiez le fichier package.json
cat package.json
```

**Problème:** `NEXTAUTH_SECRET manquant`
- Ajoutez la variable dans Vercel Settings → Environment Variables
- Redéployez

### Erreur 500 sur les Uploads

- Vérifiez les logs Vercel: **Functions → Logs**
- Le système de fichiers serverless est en lecture seule après le build
- Utilisez Vercel Blob ou un service cloud pour les uploads persistants

### NextAuth ne fonctionne pas

1. Vérifiez que `NEXTAUTH_URL` correspond exactement à votre domaine
2. Vérifiez que `NEXTAUTH_SECRET` est correctement configuré
3. Redéployez après modification des variables d'environnement

## 📊 Métriques et Analytics

Vercel fournit automatiquement:
- ✅ Analytics de trafic
- ✅ Speed Insights (Core Web Vitals)
- ✅ Logs de fonctions serverless
- ✅ Métriques de build

## 🔄 CI/CD Automatique

Après le déploiement initial:
- Chaque push sur `main` déclenche un déploiement automatique
- Les pull requests créent des déploiements de preview
- Vous pouvez configurer des déploiements manuels si nécessaire

## 📞 Support

- [Documentation Vercel](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI](https://vercel.com/docs/cli)

---

## ✅ Checklist de Déploiement

- [ ] Code poussé sur GitHub/GitLab/Bitbucket
- [ ] Projet créé sur Vercel
- [ ] `NEXTAUTH_SECRET` généré et configuré
- [ ] `NEXTAUTH_URL` configuré (mis à jour après déploiement)
- [ ] Variables email configurées (optionnel)
- [ ] Premier déploiement réussi
- [ ] `NEXTAUTH_URL` mis à jour avec l'URL de production
- [ ] Site testé et fonctionnel
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Solution de stockage cloud pour uploads (si nécessaire)

---

**Bon déploiement! 🚀**
