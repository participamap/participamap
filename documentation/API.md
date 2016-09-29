# API participamap

## Sommaire

* [**Informations générales**](#informations-générales)
    * [Protocole et format](#protocole-et-format)
    * [Appels réussis](#appels-réussis)
    * [Gestion des erreurs](#gestion-des-erreurs)
* [**Lieux**](#lieux)
    * [En-têtes de lieux](#en-têtes-de-lieux)
    * [Informations d’un lieu](#informations-dun-lieu)
    * [Création d’un lieu](#création-dun-lieu)
    * [Modification d’un lieu](#modification-dun-lieu)
    * [Suppression d’un lieu](#suppression-dun-lieu)
    * [Commentaires d’un lieu](#commentaires-dun-lieu)
    * [Créer un commentaire](#créer-un-commentaire)
    * [Images d’un lieu](#images-dun-lieu)

## Informations générales

### Protocole et format

L’API utilise le protocole HTTP. Les charges des requêtes doivent être passés en JSON avec l’en-tête `Content-Type: application/json`. Les réponses sont toujours en JSON.

### Appels réussis

Si un appel API est réussi, le service web répond avec :

* un statut HTTP 200 (OK), HTTP 201 (Created) ou HTTP 204 (No Content),
* une représentation JSON de l’entité demandée, créée ou modifiée le cas échéant.

### Gestion des erreurs

Si une erreur a lieu, le service web répond avec :

* un statut HTTP correspondant à l’erreur,
* un objet JSON `error` :

        {
            "error": {
                "code": <code>,
                "message": <message>,
                "err": <err>
            }
        }
    
    où `<err>` est :
    * un objet vide en mode production
    * l’erreur en mode débug

## Lieux

### En-têtes de lieux

#### Nom de la requête

`getPlacesHeaders`

#### Description

Récupère les en-têtes de lieux.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /places | non requis

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

Nom | Description | Exemple | Absence
----|-------------|---------|--------
when | Date de la carte à afficher | now, 2016-09-16 | Tout
lat | Latitude du centre du cadre de recherche | 49.18165 | Tout
long | Longitude du centre du cadre de recherche | -0.34709 | Tout
height | Hauteur du cadre de rercherche en degrés | 0.06 | Tout
width | Largeur du cadre de recherche en degrés | 0.06 | Tout

**Note : *lat*, *long*, *height* et *width* doivent être renseignés ensemble.**

#### Charge

*Néant*

#### Réponse

Liste d’en-têtes de lieux :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du lieu | "57dbe334c3eaf116f88e0318"
location | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
title | Titre du lieu | "Le Dôme"

#### Exemple

```sh
$ curl https://api.participamap.org/places?when=now
```

```json
[
  {
    "_id": "57dbe334c3eaf116f88e0318",
    "location": {
      "latitude": 49.18165,
      "longitude": -0.34709
    },
    "title": "Le Dôme"
  },
  {
    "_id": "57dbe738c3eaf116f88e0319",
    "location": {
      "latitude": 49.21272,
      "longitude": -0.36847
    },
    "title": "Salle 417"
  }     
]
```

### Informations d’un lieu

#### Nom de la requête

`getPlaceInfo`

#### Description

Récupère les informations sur un lieu.

#### Point d’accès

Méthode | Chemin | autorisation
:------:|:------:|:-----------:
GET | /places/{id} | non requis / modérateur si `admin=true`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

Nom | Description | Exemple | Absence
----|-------------|---------|--------
comms | Nombre de commentaires à transmettre | 10 | Aucun
pics | Nombre de photos à transmettre | 5 | Aucun
docs | Nombre de documents à transmettre | 5 | Aucun
votes | Nombre de votes à transmettre | 2 | Aucun
admin | Récupérer des informations administrateur | true | false

#### Charge

*Néant*

#### Réponse

Un lieu :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du lieu | "57dbe334c3eaf116f88e0318"
location | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
title | Titre du lieu | "Le Dôme"
isVerified | État de vérification du lieu | true
*proposedBy*\* | Utilisateur ayant proposé le lieu | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
*type* | Type du lieu | 0
*description* | Description | "Maison de la Recherche et de l’Imagination"
*startDate* | Date de création | "2015-01-01T13:00:00.000Z"
*endDate* | Date de suppression | "2016-09-09T08:00:00.000Z"
*comments* | Commentaires | *Liste de commentaires*
*pictures* | Photos | *Liste de photos*
*documents* | Documents | *Liste de documents*
*votes* | Votes | *Liste de votes*
*manager*\* | Gérant du lieu | { "id": "57dbe334c3eaf116f8a33e7", "name": "Gilles Dumesnil" }
*moderateComments*\* | Modération des commentaires | true
*moderatePictures*\* | Modération des photos | true
*moderateDocuments*\* | Modération des documents | true
*denyComments* | Interdiction des commentaires | true
*denyPictures* | Interdiction des photos | true
*denyDocuments* | Interdiction des documents | true

\* N’apparaît que si `admin=true`.

#### Exemple

```sh
$ curl https://api.participamap.org/places/57dbe334c3eaf116f88e0318
```

```json
{
  "_id": "57dbe334c3eaf116f88e0318",
  "location": {
    "latitude": 49.18165,
    "longitude": -0.34709
  },
  "title": "Le Dôme",
  "isVerified": true,
  "description": "Maison de la Recherche et de l’Imagination",
  "startDate": "2015-01-01T13:00:00.000Z"
}
```

### Création d’un lieu

#### Nom de la requête

`createPlace`

#### Description

Crée un nouveau lieu.

#### Point d’accès

Méthode | Chemin | autorisation
:------:|:------:|:-----------:
POST | /places | utilisateur / modérateur si champs modérateurs soumis

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Charge

Un lieu :

Attribut | Description | Exemple
---------|-------------|--------
location | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
title | Titre du lieu | "Le Dôme"
*isVerified*\* | État de vérification du lieu | true
*type* | Type du lieu | 0
*description* | Description | "Maison de la Recherche et de l’Imagination"
*startDate* | Date de création | "2015-01-01T13:00:00.000Z"
*endDate* | Date de suppression | "2016-09-09T08:00:00.000Z"
*manager*\* | Gérant du lieu | "57dbe334c3eaf116f8a33e7"
*moderateComments*\* | Modération des commentaires | true
*moderatePictures*\* | Modération des photos | true
*moderateDocuments*\* | Modération des documents | true
*denyComments*\* | Interdiction des commentaires | true
*denyPictures*\* | Interdiction des photos | true
*denyDocuments*\* | Interdiction des documents | true

\* N’est paramétrable qu’avec un niveau modérateur.

#### Réponse

Le lieu créé :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du lieu | "57dbe334c3eaf116f88e0318"
location | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
title | Titre du lieu | "Le Dôme"
isVerified | État de vérification du lieu | true
*proposedBy* | Utilisateur ayant proposé le lieu | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
*type* | Type du lieu | 0
*description* | Description | "Maison de la Recherche et de l’Imagination"
*startDate* | Date de création | "2015-01-01T13:00:00.000Z"
*endDate* | Date de suppression | "2016-09-09T08:00:00.000Z"
*manager* | Gérant du lieu | "57dbe334c3eaf116f8a33e7"
*moderateComments* | Modération des commentaires | true
*moderatePictures* | Modération des photos | true
*moderateDocuments* | Modération des documents | true
*denyComments* | Interdiction des commentaires | true
*denyPictures* | Interdiction des photos | true
*denyDocuments* | Interdiction des documents | true

#### Exemple

```sh
$ curl -X POST -H "Content-Type: application/json" \
    -d '{"location":{"latitude":49.18165,"longitude":-0.34709},"title":"Le Dôme"}' \
    https://api.participamap.org/places
```

```json
{
  "_id": "57dbe334c3eaf116f88e0318",
  "location": {
    "latitude": 49.18165,
    "longitude": -0.34709
  },
  "title": "Le Dôme"
}
```

### Modification d’un lieu

#### Nom de la requête

`updatePlace`

#### Description

Modifie un lieu existant.

#### Point d’accès

Méthode | Chemin | autorisation
:------:|:------:|:-----------:
PUT | /places/{id} | modérateur

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Charge

Un lieu :

Attribut | Description | Exemple
---------|-------------|--------
*location* | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
*title* | Titre du lieu | "Le Dôme"
*isVerified* | État de vérification du lieu | true
*type* | Type du lieu | 0
*description* | Description | "Maison de la Recherche et de l’Imagination"
*startDate* | Date de création | "2015-01-01T13:00:00.000Z"
*endDate* | Date de suppression | "2016-09-09T08:00:00.000Z"
*manager* | Gérant du lieu | "57dbe334c3eaf116f8a33e7"
*moderateComments* | Modération des commentaires | true
*moderatePictures* | Modération des photos | true
*moderateDocuments* | Modération des documents | true
*denyComments* | Interdiction des commentaires | true
*denyPictures* | Interdiction des photos | true
*denyDocuments* | Interdiction des documents | true

#### Réponse

Le lieu modifié :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du lieu | "57dbe334c3eaf116f88e0318"
location | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
title | Titre du lieu | "Le Dôme"
isVerified | État de vérification du lieu | true
*proposedBy* | Utilisateur ayant proposé le lieu | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
*type* | Type du lieu | 0
*description* | Description | "Maison de la Recherche et de l’Imagination"
*startDate* | Date de création | "2015-01-01T13:00:00.000Z"
*endDate* | Date de suppression | "2016-09-09T08:00:00.000Z"
*manager* | Gérant du lieu | "57dbe334c3eaf116f8a33e7"
*moderateComments* | Modération des commentaires | true
*moderatePictures* | Modération des photos | true
*moderateDocuments* | Modération des documents | true
*denyComments* | Interdiction des commentaires | true
*denyPictures* | Interdiction des photos | true
*denyDocuments* | Interdiction des documents | true

#### Exemple

```sh
$ curl -X PUT -H "Content-Type: application/json" \
    -d '{"location":{"latitude":49.18165,"longitude":-0.34709},"title":"Le Dôme modifié"}' \
    https://api.participamap.org/places/57dbe334c3eaf116f88e0318
```

```json
{
  "_id": "57dbe334c3eaf116f88e0318",
  "location": {
    "latitude": 49.18165,
    "longitude": -0.34709
  },
  "title": "Le Dôme modifié"
}
```

### Suppression d’un lieu

#### Nom de la requête

`deletePlace`

#### Description

Supprime un lieu.

#### Point d’accès

Méthode | Chemin | autorisation
:------:|:------:|:-----------:
DELETE | /places/{id} | modérateur

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Charge

*Néant*

#### Réponse

`HTTP/1.1 204 No Content`

#### Exemple

```sh
$ curl -X DELETE https://api.participamap.org/places/57dbe334c3eaf116f88e0318
```

### Commentaires d’un lieu

#### Nom de la requête

`getComments`

#### Description

Récupère les commentaires d’un lieu.

#### Point d’accès

Méthode | Chemin | autorisation
:------:|:------:|:-----------:
GET | /places/{id}/comments | non requis

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

Nom | Description | Exemple | Absence
----|-------------|---------|--------
page | Numéro de page | 3 | 1
n | Nombre de commentaires par page | 10 | 10 si `page` est fixé, infini sinon

#### Charge

*Néant*

#### Réponse

Liste de commentaires :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du commentaire | "57dbe334c3eaf116f93e2cad"
author | Auteur du commentaire | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date du commentaire | "2016-09-19T19:30:26.037Z"
content | Contenu du commentaire | "Très bel endroit"

#### Exemple

```sh
$ curl https://api.participamap.org/places/57dbe334c3eaf116f88e0318/comments?page=1&n=2
```

```json
[
  {
    "_id": "57dbe334c3eaf116f93e2cad",
    "author": {
      "id": "57dbe334c3eaf116f88eca27",
      "name": "Jean Dupont"
    },
    "date": "2016-09-19T19:30:26.037Z",
    "content": "Très bel endroit"
  },
  {
    "_id": "57dbe334c3eaf116f93e2cae",
    "author": {
      "id": "57dbe334c3eaf116f88eca2c",
      "name": "Alexis de caen"
    },
    "date": "2016-09-19T19:30:32.739Z",
    "content": "Je plussoie Jean"
  }
]
```

### Créer un commentaire

#### Nom de la requête

`createComment`

#### Description

Crée un commentaire.

#### Point d’accès

Méthode | Chemin | autorisation
:------:|:------:|:-----------:
POST | /places/{id}/comments | utilisateur

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Charge

Un commentaire :

Attribut | Description | Exemple
---------|-------------|--------
content | Contenu du commentaire | "Très bel endroit"

#### Réponse

Un commentaire :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du commentaire | "57dbe334c3eaf116f93e2cad"
author | Auteur du commentaire | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date du commentaire | "2016-09-19T19:30:26.037Z"
content | Contenu du commentaire | "Très bel endroit"

#### Exemple

```sh
$ curl -X POST -H "Content-Type: application/json" \
    -d '{"content": "Très bel endroit"}' \
    https://api.participamap.org/places/57dbe334c3eaf116f88e0318/comments
```

```json
{
  "_id": "57dbe334c3eaf116f93e2cad",
  "author": {
    "id": "57dbe334c3eaf116f88eca27",
    "name": "Jean Dupont"
  },
  "date": "2016-09-19T19:30:26.037Z",
  "content": "Très bel endroit"
}
```

### Images d’un lieu

#### Nom de la requête

`getPictures`

#### Description

Récupère les images d’un lieu.

#### Point d’accès

Méthode | Chemin | autorisation
:------:|:------:|:-----------:
GET | /places/{id}/pictures | non requis

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

Nom | Description | Exemple | Absence
----|-------------|---------|--------
page | Numéro de page | 3 | 1
n | Nombre d’images par page | 12 | 12 si `page` est fixé, infini sinon

#### Charge

*Néant*

#### Réponse

Liste de liens vers des images :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant de l’image | "57dbe334c3eaf116f93e2cad",
author | Auteur de la photo | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date de mise en ligne | "2016-09-19T19:30:26.037Z"
link | Lien vers la photo | "https://photos.participamap.org/83ca8f82.jpg"

#### Exemple

```sh
$ curl https://api.participamap.org/places/57dbe334c3eaf116f88e0318/pitcures?page=1
```

```json
[
  {
    "_id": "57dbe334c3eaf116f93e2cad",
    "author": {
      "id": "57dbe334c3eaf116f88eca27",
      "name": "Jean Dupont"
    },
    "date": "2016-09-19T19:30:45.173Z",
    "link": "https://photos.participamap.org/83ca8f82.jpg"
  }
]
```
