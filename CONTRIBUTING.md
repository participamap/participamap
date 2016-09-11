# Pour contribuer

## Prérequis

**participamap** est développé avec le framework Express en node.js et utilise une base de données MongoDB. Ces différents composants sont donc nécessaires sur la machine de développement.

### Node.js

Pour installer node.js sur Ubuntu :

    $ sudo apt-get update
    $ sudo apt-get install nodejs npm

Pour installer node.js sur macOS :

    $ brew update
    $ brew install node

Plus d’informations sont disponibles sur le site de [node.js](https://nodejs.org/en/download/package-manager/).

### MongoDB

Pour installer MongoDB sur Ubuntu 16.04 :

1. Importer la clé publique de MongoDB :

        $ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

2. Créer un fichier *list* pour MongoDB :

        $ echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

3. Mettre à jour la liste des paquets et installer MongoDB :

        $ sudo apt-get update
        $ sudo apt-get install mongodb-org

Pour installer MongoDB sur macOS :

    $ brew update
    $ brew install mongodb

#### Lancement de MongoDB

Sur Ubuntu :

    $ mongod --config /etc/mongod.conf

Sur macOS (si installé avec Homebrew) :

    $ mongod --config /usr/local/etc/mongod.conf

Pour arrêter MongoDB, il suffit de faire `<Ctrl>-C` dans le terminal où est lancé `mongod`.

Plus d’informations sont disponibles sur le site de [MongoDB](https://docs.mongodb.com/manual/tutorial/).

## Mise en place du repos local

1. Cloner localement le repos :

        $ cd /repertoire/de/travail/
        $ git clone https://github.com/participamap/participamap.git

2. Installer les dépendances du projet :

        $ cd participamap
        $ npm install

## Bonnes pratiques

### GitHub

Pour éviter les problèmes et rendre les contributions plus claires, il est important de **ne pas modifier la brache *master*.**

Pour chaque nouvelle fonctionnalité, créer une nouvelle branche :

    $ git checkout -b ma_fonctionnalite

Faire régulièrement des commits pour sauvegarder sur le repos local :

    $ git commit -am "Modification 1"
    $ git commit -am "Modification 2"

Pour envoyer ces modifications sur le repos de l’organisation :

    $ git push origin ma_fonctionnalite

Une fois qu’une fonctionnalité est prête et poussée sur sa branche du repos de l’organisation, il ne reste plus qu’à faire un **Pull Request** via l’interface de GitHub pour demander sa fusion avec la branche *master*.

### Node.js

Pour garder un code clair, lisible et maintenable par d’autres personnes, il est important de respecter quelques conventions. Nous utilisons [celles décrites par Felix Geisendörfer](https://github.com/felixge/node-style-guide).
