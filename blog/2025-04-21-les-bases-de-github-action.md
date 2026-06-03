```markdown
---
title: "Les bases de GitHub Actions"
summary: "Découvrez les fondamentaux de GitHub Actions, un outil puissant pour automatiser vos workflows de développement directement sur GitHub."
tags:
  - GitHub
  - CI/CD
  - Automatisation
  - DevOps
  - GitHub Actions
---

# Les bases de GitHub Actions

GitHub Actions est une fonctionnalité intégrée à GitHub qui permet d'automatiser, de personnaliser et d'exécuter vos workflows de développement logiciel directement dans votre dépôt. Que ce soit pour la construction, le test, le déploiement ou la gestion des tâches répétitives, GitHub Actions offre une solution flexible et puissante.

Dans cet article, nous allons explorer les bases de GitHub Actions, comment configurer vos premiers workflows, et vous présenter des exemples concrets pour bien démarrer.

---

## Qu'est-ce que GitHub Actions ?

GitHub Actions est un système d'intégration continue/déploiement continu (CI/CD) qui s'intègre profondément à GitHub. Il vous permet de déclencher des actions automatisées en fonction d'événements sur votre dépôt, comme un push, une pull request, ou même le planning horaire.

Chaque workflow est défini dans un fichier YAML situé dans le répertoire `.github/workflows/` de votre dépôt.

---

## Concepts clés de GitHub Actions

### Workflow

Un workflow est un processus automatisé défini dans un fichier YAML. Il peut contenir un ou plusieurs jobs à exécuter en parallèle ou en série.

### Job

Un job est un ensemble de steps (étapes) qui s'exécutent sur un runner, une machine virtuelle fournie par GitHub ou autohébergée.

### Step

Une étape est une commande individuelle qui s'exécute dans le contexte du job, comme lancer un script, exécuter une action pré-existante, ou une commande shell.

### Action

Une action est une tâche réutilisable qui peut être intégrée dans une étape. Vous pouvez utiliser des actions créées par la communauté ou créer les vôtres.

---

## Comment créer un workflow simple

### Exemple : Test automatisé à chaque push

Créons un workflow qui lance des tests à chaque fois que vous poussez du code.

1. Créez le fichier `.github/workflows/test.yml` dans votre dépôt.

2. Ajoutez-y le contenu suivant :

```yaml
name: Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout du code
        uses: actions/checkout@v3

      - name: Installer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Installer les dépendances
        run: npm install

      - name: Lancer les tests
        run: npm test
```

Ce workflow s'exécutera automatiquement à chaque push, installera Node.js, récupérera le code, installera les dépendances, puis lancera les tests.

---

## Déclencheurs d'événements

GitHub Actions peut être déclenché par une grande variété d'événements :

- `push` : quand du code est poussé.
- `pull_request` : quand une pull request est créée ou mise à jour.
- `schedule` : pour des tâches planifiées (cron).
- `workflow_dispatch` : pour un déclenchement manuel depuis l'interface GitHub.

Exemple d'exécution programmée avec `schedule` :

```yaml
on:
  schedule:
    - cron: '0 2 * * *' # Tous les jours à 2h du matin
```

---

## Utiliser des Secrets et variables d'environnement

Pour gérer des informations sensibles (tokens, clés API), GitHub Actions donne accès aux secrets configurés dans votre dépôt.

### Exemple d'utilisation

```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}

steps:
  - name: Utiliser l'API
    run: curl -H "Authorization: Bearer $API_KEY" https://api.exemple.com/data
```

---

## Créer sa propre action

Créer une action permet de réutiliser facilement des scripts ou routines. Une action peut être écrite en JavaScript ou sous forme de conteneur Docker.

Voici la structure minimale pour une action JavaScript :

- `action.yml` (description)
- `index.js` (code)

Exemple de `action.yml` :

```yaml
name: "Mon Action"
description: "Une action simple qui affiche un message"
inputs:
  name:
    description: "Nom à afficher"
    required: true
runs:
  using: "node12"
  main: "index.js"
```

Dans `index.js` :

```javascript
const core = require('@actions/core');

try {
  const name = core.getInput('name');
  console.log(`Bonjour, ${name} !`);
} catch (error) {
  core.setFailed(error.message);
}
```

---

## Conclusion

GitHub Actions est un outil exceptionnel pour automatiser vos processus de développement sans quitter GitHub. En maîtrisant les workflows, les jobs et les actions, vous pouvez gagner en productivité, fiabilité et cohérence dans vos projets.

Commencez par créer des workflows simples, puis explorez les actions réutilisables et la création de vos propres actions personnalisées pour répondre à vos besoins spécifiques.

N'hésitez pas à consulter la [documentation officielle de GitHub Actions](https://docs.github.com/fr/actions) pour approfondir vos connaissances et découvrir toutes les possibilités offertes.

---

**Bon codage et automatisation réussie avec GitHub Actions !**
```