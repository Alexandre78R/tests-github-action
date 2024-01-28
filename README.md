# Exercice Tests

![Bannière](https://assets-global.website-files.com/5eb9845c0972c01cdaec8415/623246fc4643e4ed0589e1d2_what-is-qa-testing2.jpg)

Ce dépôt contient une base de travail sur la branche main, puis l'avancée petit à petit sur les branches suivantes.

## <div style="background-color: #154275; padding: 10px; color: white;">Branches</div>

- **1-mock-livres** ⇒ <link>https://github.com/delbaze/tests-quete/tree/1-mock-livres</link>
- **2-store-livres** ⇒ <link>https://github.com/delbaze/tests-quete/tree/2-store-livres</link>
- **3-db-livres** ⇒ <link>https://github.com/delbaze/tests-quete/tree/3-db-livres</link>
- **4-front-1** ⇒ <link>https://github.com/delbaze/tests-quete/tree/4-front-1</link>
- **5-front-2** ⇒ <link>https://github.com/delbaze/tests-quete/tree/5-front-2</link>
- **6-front-e2e** ⇒ <link>https://github.com/delbaze/tests-quete/tree/6-front-e2e</link>


## <div style="background-color: #154275; padding: 10px; color: white;">Structure du Projet</div>

- **backend/** : Application TypeGraphQL avec Apollo Server
- **frontend/** : Application Next.js (sans utilisation du dossier api, Page Router)

## <div style="background-color: #154275; padding: 10px; color: white;">Technologie Utilisée</div>

- **Backend** : TypeGraphQL, Apollo Server, TypeORM
- **Frontend** : Next.js
- **Base de Données** : SQLite
- **Environnement** : Docker via docker-compose.yml à la racine du projet

## <div style="background-color: #154275; padding: 10px; color: white;">Installation</div>

1. Cloner ce dépôt : `git clone https://github.com/delbaze/jwt-quete`

##### Si vous souhaitez installer les dépendances localement directement plutôt que de mapper vos dossiers node_modules :

2. Accéder au répertoire backend : `cd backend/`
3. Installer les dépendances : `npm install`
4. Accéder au répertoire frontend : `cd ../frontend/`
5. Installer les dépendances : `npm install`

## <div style="background-color: #154275; padding: 10px; color: white;">Docker</div>

Le projet est conçu pour fonctionner sur Docker. Utilisez le fichier `docker-compose.yml` à la racine du projet pour lancer l'ensemble de l'application.

```bash
docker compose up --build
```

## Auteur

[David ELBAZE](https://github.com/delbaze)

---

Amusez vous bien!