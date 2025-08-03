# Commandes Git et Tauri pour le projet Nalem

## 🚀 Démarrage du projet

### Lancer l'application en mode développement
```bash
npm run tauri dev
```

### Lancer uniquement le frontend (React)
```bash
npm run dev
```

### Lancer uniquement le backend (Rust/Tauri)
```bash
npm run tauri dev -- --no-frontend
```

## 📦 Commandes Git essentielles 

### État du repository
```bash
# Voir l'état des fichiers
git status

# Voir l'historique des commits
git log --oneline

# Voir les différences
git diff
git diff --staged
```

### Gestion des fichiers
```bash
# Ajouter tous les fichiers modifiés
git add .

# Ajouter un fichier spécifique
git add nom_du_fichier

# Supprimer un fichier du staging
git reset nom_du_fichier

# Annuler les modifications d'un fichier
git checkout -- nom_du_fichier
```

### Commits
```bash
# Créer un commit avec message
git commit -m "Description du commit"

# Ajouter et commiter en une commande
git commit -am "Description du commit"

# Modifier le dernier commit
git commit --amend -m "Nouveau message"
```

### Branches
```bash
# Voir toutes les branches
git branch -a

# Créer une nouvelle branche
git branch nom_de_la_branche

# Créer et basculer sur une nouvelle branche
git checkout -b nom_de_la_branche

# Basculer sur une branche existante
git checkout nom_de_la_branche

# Supprimer une branche locale
git branch -d nom_de_la_branche

# Supprimer une branche distante
git push origin --delete nom_de_la_branche
```

### Synchronisation avec le remote
```bash
# Récupérer les dernières modifications
git fetch origin

# Récupérer et fusionner les modifications
git pull origin main

# Pousser vos modifications
git push origin nom_de_la_branche

# Pousser sur la branche actuelle
git push
```

### Gestion des conflits
```bash
# Voir les fichiers en conflit
git status

# Annuler un merge en cours
git merge --abort

# Annuler un rebase en cours
git rebase --abort
```

### Historique et navigation
```bash
# Voir l'historique détaillé
git log --graph --oneline --all

# Voir les modifications d'un commit
git show commit_hash

# Revenir à un commit précédent
git reset --hard commit_hash

# Créer un tag
git tag -a v1.0.0 -m "Version 1.0.0"
```

## 🔧 Commandes Tauri spécifiques

### Build et packaging
```bash
# Build pour développement
npm run tauri dev

# Build pour production
npm run tauri build

# Build pour une plateforme spécifique
npm run tauri build -- --target x86_64-unknown-linux-gnu
npm run tauri build -- --target x86_64-pc-windows-msvc
npm run tauri build -- --target x86_64-apple-darwin
```

### Debug et logs
```bash
# Lancer avec logs détaillés
RUST_LOG=debug npm run tauri dev

# Lancer avec logs Tauri
RUST_LOG=tauri=debug npm run tauri dev
```

## 🛠️ Workflow recommandé pour le projet

### 1. Développement quotidien
```bash
# 1. Récupérer les dernières modifications
git fetch origin
git pull origin main

# 2. Créer une branche pour votre feature
git checkout -b feature/nouvelle-fonctionnalite

# 3. Développer et tester
npm run tauri dev

# 4. Ajouter et commiter vos changements
git add .
git commit -m "feat: ajout de la nouvelle fonctionnalité"

# 5. Pousser votre branche
git push origin feature/nouvelle-fonctionnalite
```

### 2. Merge et release
```bash
# 1. Basculer sur main
git checkout main
git pull origin main

# 2. Merger votre branche
git merge feature/nouvelle-fonctionnalite

# 3. Pousser les changements
git push origin main

# 4. Supprimer la branche locale
git branch -d feature/nouvelle-fonctionnalite
```

## 📝 Conventions de commit

### Format recommandé
```
type(scope): description

feat(network): ajout du scanner nmap
fix(ui): correction de l'affichage des résultats
docs(readme): mise à jour de la documentation
style(components): amélioration du CSS
refactor(api): simplification du code
test(scan): ajout de tests unitaires
```

### Types de commit
- `feat`: nouvelle fonctionnalité
- `fix`: correction de bug
- `docs`: documentation
- `style`: formatage, espaces, etc.
- `refactor`: refactoring
- `test`: ajout de tests
- `chore`: tâches de maintenance

## ⚠️ Bonnes pratiques

### Sécurité
- Ne jamais commiter de clés API ou secrets
- Utiliser `.gitignore` pour exclure les fichiers sensibles
- Vérifier le contenu avant de commiter (`git diff --cached`)

### Performance
- Faire des commits atomiques (une fonctionnalité par commit)
- Écrire des messages de commit clairs et descriptifs
- Utiliser des branches pour chaque feature

### Collaboration
- Toujours faire un `git pull` avant de commencer à travailler
- Communiquer avec l'équipe avant de merger
- Utiliser des Pull Requests pour les reviews

## 🔍 Commandes de diagnostic

```bash
# Voir la taille du repository
git count-objects -vH

# Nettoyer les objets non référencés
git gc --prune=now

# Voir les branches non mergées
git branch --no-merged

# Voir les commits non poussés
git log origin/main..HEAD
```

## 📚 Ressources utiles

- [Documentation Git officielle](https://git-scm.com/doc)
- [Documentation Tauri](https://tauri.app/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/) 