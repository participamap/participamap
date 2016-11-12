# participamap

**participamap** est le cœur d’un projet de cartographie culturelle, citoyenne et participative. Il permet un accès ouvert à ses données à travers un service Web.

Sa conception est le fruit d’une collaboration entre les étudiants en Master 2 E-SECURE de l’Université de Caen et le Dôme, centre de sciences de nouvelle génération.

## Installation

### Prérequis

Pour fonctionner, **participamap** a besoin de :

* Node.js (node & npm),
* MongoDB,
* un proxy HTTP (Apache, nginx, …).

### Préparation de l’environnement

Si vous avez déjà configuré un environnement pour faire fonctionner des applications Node.js, vous pouvez directement passer à la partie « [Configuration de base de MongoDB](#configuration-de-base-de-mongodb) ».

Contrairement aux applications web PHP qui nécessitent un serveur HTTP, les applications Node.js ont leur propre processus et intègrent leur propre serveur HTTP. De ce fait, il est important de les *démoniser* pour qu’elles soient capables de se relancer d’elles-même en cas de problème.

Dans ce guide d’installation nous utiliserons le gestionnaire de processus Node.js [**PM2**](http://pm2.keymetrics.io/).

Pour l’installer :

    # npm install pm2 -g

Les applications Node.js peuvent être lancées par n’importe quel utilisateur. Toutefois, pour des raisons de sécurité il est préférable de créer un utilisateur dédié à ces applications.

    # useradd pm2

### Configuration de base de MongoDB

Si vous avec déjà un serveur MongoDB correctement configuré, vous pouvez directement passer à la partie « [Configuration de la base de données](#configuration-de-la-base-de-données) ».

1. S’il n’est pas déjà en marche, lancer le service MongoDB :

        # service mongod start

2. Se connecter à MongoDB :

        $ mongo

3. Créer un utilisateur avec le rôle `admin` dans la base de données `admin` :

        > use admin
        switched to db admin
        > db.createUser({
        ... user: "admin",
        ... pwd: "<password>",
        ... roles: [{ role: "userAdminAnyDatabase", db: "admin" },
        ... { role: "dbAdminAnyDatabase", db: "admin" }]
        ... })

4. Modifier le fichier de configarutation `mongodb.conf` pour y ajouter :

    ```yaml
    security:
       authorization: enabled
    
    net:
       bindIp: 127.0.0.1
    ```

5. Relancer le service MongoDB :

        # service mongod restart

Plus d’informations sur la sécurité de MongoDB sont disponibles sur [la documentation officielle](https://docs.mongodb.com/manual/security/).

### Configuration de la base de données

**participamap** nécessite une base de données MongoDB. Pour la créer :

1. Se connecter à MongoDB :

        $ mongo

2. Si l’authentification est activée sur le serveur MongoDB — ce qui est fortement conseillé —, se connecter en tant qu’administrateur :

        > use admin
        switched to db admin
        > db.auth("admin", "<password>")

3. Créer un utilisateur `participamap` ayant le droit de lecture et d’écriture sur la base de données `participamap` :

        > db.createUser({
        ... user: "participamap",
        ... pwd: "<password>",
        ... roles: [{ role: "readWrite", db: "participamap" }]
        ... })

### Installation et configuration de l’application

1. Si le gestionnaire de dépendances `bower` n’est pas installé, l’installer :

        # npm install bower -g

2. Se connecter en tant que l’utilisateur qui fera tourner l’application :

        # su pm2

3. Se placer dans un répertoire et télécharger l’application :

        $ cd
        $ mkdir node_apps
        $ cd node_apps
        $ git clone https://github.com/participamap/participamap

4. Se rendre dans le répertoire de l’application et installer les dépendances :

        $ cd participamap
        $ npm install
    
    Puis pour installer les dépendances du front-end :
    
        $ bower install

5. Copier l’exemple de configuration et l’ouvrir dans un éditeur :

        $ cp config.json.sample config.json
        $ vim config.json

6. Modifier la configuration en suivant la [documentation](https://github.com/participamap/participamap/blob/master/documentation/Configuration.md).

### Lancement de l’application

1. Choisir le numéro de port sur lequer le serveur va écouter — par exemple `3001`.

2. Choisir le nombre d’instances du serveur à lancer pour une clusterisation — 1 par cœur conseillé.

3. Se connecter en tant que l’utilisateur qui fera tourner l’application et se rendre dans le répertoire :

        # su pm2
        $ cd ~/node_apps/participamap/

4. Créer un nouveau processus PM2 :

        $ NODE_ENV=production PORT=3001 pm2 start -n participamap -i <nombre_instances> bin/www

5. Sauvegarder la liste des processus de PM2 :

        $ pm2 save

En cas de redémarrage du serveur, il sera alors possible de relancer toutes les applications gérées par PM2 avec :

    $ pm2 resurrect

Un script de démarrage automatique peut aussi être défini. Plus d’informations sur le [site officiel de PM2](http://pm2.keymetrics.io/).

À cette étape, il est possible de tester le fonctionnement de l’application :

    $ curl "http://localhost:3001/"

La commande doit retourner un objet JSON vide `{}`.

### Configuration du proxy HTTP

**participamap** fonctionne en HTTP sur un port particulier. Pour le rendre accessible de l’extérieur en HTTPS sur le port standard et aux côtés d’autres services web, il faut utiliser un *reverse proxy* HTTP. Dans ce guide d’installation, on utilisera Apache.

1. Activer les modules `mod_proxy` et `mod_proxy_http` si ce n’est pas fait dans le fichier `httpd.conf`.

2. Dans la configuration d’Apache, ajouter un VirtualHost pour **participamap** :

    ```
    <VirtualHost *:443>
        SSLEngine On
        SSLCertificateFile <certificat>
        SSLCertificateKeyFile <clé_privée>
        SSLCertificateChainFile <chaine_de_certification>
        
        ServerName <domaine_public>
        
        ProxyPass http://localhost:3001/
        ProxyPassReverse http://localhost:3001/
    </VirtualHost>
    ```
    
    `<domaine_public>` est à remplacer par le domaine présent dans l’attribut `serverURL` de la configuration, par exemple `participamap.org`. Le certificat fourni doit être valable pour ce domaine.

3. Relancer Apache :

        # service apache restart

4. Vérifier l’accès public :

        $ curl "https://<domaine_public>/"
        {}

### Création d’un compte administrateur\*

1. Enregistrer un utilisateur :

        $ curl -X POST "https://<domaine_public>/register \
            -H "Content-Type: application/json"
            -d '{"username":"admin","password":"<password>"}'

2. Se connecter à la base de données :

        $ mongo
        > use admin
        > db.auth("participamap", "<password>")
        > use participamap

3. Modifier le rôle de l’utilisateur `admin` :

        > db.users.update({ username: "admin" }, { $set: { role: "admin" } })

\* Cette procédure pourra être améliorée dans une prochaine version pour permettre la création d’un administrateur directement dans le fichier de configuration.
