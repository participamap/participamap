# API participamap

## Sommaire

* [**Informations générales**](#informations-générales)
    * [Protocole, format et encodage](#protocole-format-et-encodage)
    * [Chemins](#chemins)
    * [Appels réussis](#appels-réussis)
    * [Gestion des erreurs](#gestion-des-erreurs)
* [**Autorisations et Authentification**](#autorisations-et-authentification)
    * [Rôles](#rôles)
    * [Jetons](#jetons)
* [**Utilisateurs**](#utilisateurs)
    * [Enregistrement](#enregistrement)
    * [Connexion](#connexion)
    * [Liste des utilisateurs](#liste-des-utilisateurs)
    * [Informations d’un utilisateur](#informations-dun-utilisateur)
    * [Création d’un utilisateur](#création-dun-utilisateur)
    * [Modification d’un utilisateur](#modification-dun-utilisateur)
    * [Suppression d’un utilisateur](#suppression-dun-utilisateur)
* [**Lieux**](#lieux)
    * [En-têtes de lieux](#en-têtes-de-lieux)
    * [Informations d’un lieu](#informations-dun-lieu)
    * [Création d’un lieu](#création-dun-lieu)
    * [Modification d’un lieu](#modification-dun-lieu)
    * [Suppression d’un lieu](#suppression-dun-lieu)
* [**Commentaires**](#commentaires)
    * [Commentaires d’un lieu](#commentaires-dun-lieu)
    * [Création d’un commentaire](#création-dun-commentaire)
    * [Acceptation d’un commentaire](#acceptation-dun-commentaire)
    * [Suppression d’un commentaire](#suppression-dun-commentaire)
* [**Images**](#images)
    * [Images d’un lieu](#images-dun-lieu)
    * [Création d’une image](#création-dune-image)
    * [Acceptation d’une image](#acceptation-dune-image)
    * [Suppression d’une image](#suppression-dune-image)
* [**Documents**](#documents)
    * [Documents d’un lieu](#documents-dun-lieu)
    * [Création d’un document](#création-dun-document)
    * [Acceptation d’un document](#acceptation-dun-document)
    * [Suppression d’un document](#suppression-dun-document)
* [**Notations**](#notations)
    * [Récuparation de sa notation d’un lieu](#récupération-de-sa-notation-dun-lieu)
    * [Notation d’un lieu](#notation-dun-lieu)
* [**Parcours**](#parcours)
    * [Liste des parcours](#liste-des-parcours)
    * [Informations d’un parcours](#informations-dun-parcours)
    * [Création d’un parcours](#création-dun-parcours)
    * [Modification d’un parcours](#modification-dun-parcours)
    * [Ajout d’un lieu à un parcours](#ajout-dun-lieu-à-un-parcours)
    * [Suppression d’un lieu dans un parcours](#suppression-dun-lieu-dans-un-parcours)
    * [Suppression d’un parcours](#suppression-dun-parcours)
* [**Rapports d’abus**](#rapports-dabus)
    * [Rapport d’un contenu abusif](#rapport-dun-contenu-abusif)
    * [Liste des rapports d’abus](#liste-des-rapports-dabus)
    * [Suppression d’un rapport d’abus](#suppression-dun-rapport-dabus)
    * [Suppression d’un contenu abusif](#suppression-dun-contenu-abusif)

## Informations générales

### Protocole, format et encodage

L’API utilise le protocole HTTP. Le contenu des requêtes doit être passé en JSON avec l’en-tête `Content-Type: application/json` le cas échéant, sauf mention contraire. Le contenu des réponses est toujours en JSON ; le client devrait donc faire ses requêtes avec l’en-tête `Accept: application/json`. L’encodage utilisé est UTF-8.

### Chemins

Le chemin d’accès à une requête est toujours précisé. Le routage étant strict, la présence ou l’absence de `/` final est importante. En règle générale :

* les ressources uniques n’ont pas de `/` final ;
* les ensembles de ressources ont un `/` final.

### Paramètres

* Les paramètres de chemin sont toujours obligatoires.
* Les paramètres de requête sont toujours facultatifs. Le comportement de l’API en leur absence est spécifié dans la documentation.
* Les attributs du contenu d’une requête sont :
    * obligatoires par défaut ;
    * facultatifs s’ils sont écrits en italique.

### Appels réussis

Si un appel API est réussi, le service web répond avec :

* un statut HTTP `200 OK`, `201 Created` ou `204 No Content`,
* une représentation JSON de l’entité demandée, créée ou modifiée le cas échéant.

### Gestion des erreurs

Si une erreur a lieu, le service web répond avec :

* un statut HTTP correspondant à l’erreur,
* un objet JSON `error` :

    ```json
    {
      "error": {
        "code": <code>,
        "message": <message>,
        "err": <err>
      }
    }
    ```

    où `<err>` est :
    * un objet vide en mode production
    * l’erreur en mode débug

### Exemples

Chaque requête est détaillée avec un exemple montrant :

* la requête exécutée avec `curl`,
* les en-têtes HTTP importants de la réponse,
* le contenu de la réponse en JSON le cas échéant.

## Autorisations et Authentification

Certaines requêtes nécessitent une autorisation. Il est alors nécessaire de s’authentifier.

### Rôles

L’API distingue quatre rôles, hiérarchiquement supérieurs les uns aux autres :

* `admin`,
* `moderator`,
* `content-owner`,
* `user`.

La documentation de chaque requête précise le rôle minimum requis le cas échéant.

### Jetons

L’authentification d’une requête repose sur la présence d’un jeton utilisant la norme JSON Web Token dans un en-tête HTTP :

```http
Authorization: Bearer JSON_WEB_TOKEN
```

Il est possible de récupérer un tel jeton via les requêtes [register](#enregistrement) et [login](#connexion).

Un jeton est de la forme :

```
en-tête.contenu.signature
```

Décodé, il contient les attributs suivants :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant de l’utilisateur | "58036c63e383eb1c6326538e"
usr | Nom d’utilisateur | "user007"
role | Rôle de l’utilisateur | "user"
iat | Date de création | 1476627225
exp | Date d’expiration | 1477232025

Exemple :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODAzNmM2M2UzODNlYjFjNjMyNjUzOGUiLCJ1c3IiOiJ1c2VyMDA3Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE0NzY2MjcyMjUsImV4cCI6MTQ3NzIzMjAyNX0.qG8Ki9Zrg0ANkKhRtVyBEKlXQjxY1VqngzCL9-i4NCg
```

Décodé, il contient :

```json
{
  "_id": "58036c63e383eb1c6326538e",
  "usr": "user007",
  "role": "user",
  "iat": 1476627225,
  "exp": 1477232025
}
```

## Utilisateurs

### Enregistrement

#### Nom de la requête

`register`

#### Description

Enregistre un nouvel utilisateur.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/register | non requis

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Un utilisateur :

Attribut | Description | Exemple
---------|-------------|--------
username | Nom d’utilisateur | "user007"
password | Mot de passe | "3u-lW_T%qZr!/;U%"
email | Adresse électronique | "user@domain.com"

#### Réponse

Un JSON Web Token :

Attribut | Description | Exemple
---------|-------------|--------
token | JSON Web Token | "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODAzNmM2M2UzODNlYjFjNjMyNjUzOGUiLCJ1c3IiOiJ1c2VyMDA3Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE0NzY2MjcyMjUsImV4cCI6MTQ3NzIzMjAyNX0.qG8Ki9Zrg0ANkKhRtVyBEKlXQjxY1VqngzCL9-i4NCg"

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/register" \
    -H "Content-Type: application/json" \
    -d '{"username":"user007","password":"3u-lW_T%qZr!/;U%","email":"user@domain.com"}'
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODAzNmM2M2UzODNlYjFjNjMyNjUzOGUiLCJ1c3IiOiJ1c2VyMDA3Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE0NzY2MjcyMjUsImV4cCI6MTQ3NzIzMjAyNX0.qG8Ki9Zrg0ANkKhRtVyBEKlXQjxY1VqngzCL9-i4NCg"
}
```

### Connexion

#### Nom de la requête

`login`

#### Description

Se connecte en tant qu’utilisateur.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/login | non requis

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Identifiants :

Attribut | Description | Exemple
---------|-------------|--------
username | Nom d’utilisateur | "user007"
password | Mot de passe | "3u-lW_T%qZr!/;U%"

#### Réponse

Un JSON Web Token :

Attribut | Description | Exemple
---------|-------------|--------
token | JSON Web Token | "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODAzNmM2M2UzODNlYjFjNjMyNjUzOGUiLCJ1c3IiOiJ1c2VyMDA3Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE0NzY2MjcyMjUsImV4cCI6MTQ3NzIzMjAyNX0.qG8Ki9Zrg0ANkKhRtVyBEKlXQjxY1VqngzCL9-i4NCg"

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"user007","password":"3u-lW_T%qZr!/;U%"}'
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODAzNmM2M2UzODNlYjFjNjMyNjUzOGUiLCJ1c3IiOiJ1c2VyMDA3Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE0NzY2MjcyMjUsImV4cCI6MTQ3NzIzMjAyNX0.qG8Ki9Zrg0ANkKhRtVyBEKlXQjxY1VqngzCL9-i4NCg"
}
```

### Liste des utilisateurs

#### Nom de la requête

`getUsers`

#### Description

Récupère la liste des utilisateurs.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /api/v1/users/ | `admin`

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

Nom | Description | Exemple | Absence
----|-------------|---------|--------
order | Ordre de tri | date, date-desc, username, username-desc | username
page | Numéro de page | 3 | 1
n | Nombre de commentaires par page | 100 | 25 si `page` est fixé, infini sinon

#### Contenu

*Néant*

#### Réponse

Liste d’utilisateurs :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant de l’utilisateur | "57dbe334c3eaf116f88e0318"
username | Nom d’utilisateur | "user007"
email | Adresse électronique | "user@domain.com"
role | Rôle de l’utilisateur | "user"
registrationDate | Date d’inscription | "2016-10-14T15:27:43.123Z"

#### Exemple

Requête :

```sh
$ curl "https://api.participamap.org/users/?order=date-desc&page=1&n=2" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
[
  {
    "_id": "57dbe334c3eaf116f88e0319",
    "username": "thierry23",
    "email": "thierry@example.com",
    "role": "user",
    "registrationDate": "2016-10-14T15:56:52.690Z"
  },
  {
    "_id": "57dbe334c3eaf116f88e0318",
    "username": "user007",
    "email": "user@domain.com",
    "role": "user",
    "registrationDate": "2016-10-14T15:27:43.123Z"
  }
]
```

### Informations d’un utilisateur

#### Nom de la requête

`getUserInfo`

#### Description

Récupère les informations sur un utilisateur.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /api/v1/users/{id} | `admin` (tous) / `user` (lui-même)

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant de l’utilisateur | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

Un utilisateur :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant de l’utilisateur | "57dbe334c3eaf116f88e0318"
username | Nom d’utilisateur | "user007"
email | Adresse électronique | "user@domain.com"
role | Rôle de l’utilisateur | "user"
registrationDate | Date d’inscription | "2016-10-14T15:27:43.123Z"

#### Exemple

Requête :

```sh
$ curl "https://api.participamap.org/users/57dbe334c3eaf116f88e0318" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "57dbe334c3eaf116f88e0318",
  "username": "user007",
  "email": "user@domain.com",
  "role": "user",
  "registrationDate": "2016-10-14T15:27:43.123Z"
}
```

### Création d’un utilisateur

#### Nom de la requête

`createUser`

#### Description

Crée un utilisateur.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/users/ | `admin`

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Un utilisateur :

Attribut | Description | Exemple
---------|-------------|--------
username | Nom d’utilisateur | "user007"
password | Mot de passe | "3u-lW_T%qZr!/;U%"
email | Adresse électronique | "user@domain.com"
*role* | Rôle de l’utilisateur | "user"

#### Réponse

L’utilisateur créé :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant de l’utilisateur | "57dbe334c3eaf116f88e0318"
username | Nom d’utilisateur | "user007"
email | Adresse électronique | "user@domain.com"
role | Rôle de l’utilisateur | "content-owner"
registrationDate | Date d’inscription | "2016-10-14T15:27:43.123Z"

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/users/" \
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"username":"user007","password":"3u-lW_T%qZr!/;U%","email":"user@domain.com","role":"content-owner"}'
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "57dbe334c3eaf116f88e0318",
  "username": "user007",
  "email": "user@domain.com",
  "role": "content-owner",
  "registrationDate": "2016-10-14T15:27:43.123Z"
}
```

### Modification d’un utilisateur

#### Nom de la requête

`updateUser`

#### Description

Modifie un utilisateur.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
PUT | /api/v1/users/{id} | `admin` (tous) / `user` (lui-même)

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant de l’utilisateur | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

Un utilisateur :

Attribut | Description | Exemple
---------|-------------|--------
*password* | Mot de passe | "3u-lW_T%qZr!/;U%"
*email* | Adresse électronique | "user@domain.com"
*role*\* | Rôle de l’utilisateur | "moderator"

\* N’est paramétrable qu’en étant authentifié avec un rôle `admin`.

#### Réponse

L’utilisateur mis à jour :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant de l’utilisateur | "57dbe334c3eaf116f88e0318"
username | Nom d’utilisateur | "user007"
email | Adresse électronique | "user@domain.com"
role | Rôle de l’utilisateur | "user"
registrationDate | Date d’inscription | "2016-10-14T15:27:43.123Z"

#### Exemple

Requête :

```sh
$ curl -X PUT "https://api.participamap.org/users/57dbe334c3eaf116f88e0318" \
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"password":"3u-lW_T%qZr!/;U%"}'
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "57dbe334c3eaf116f88e0318",
  "username": "user007",
  "email": "user@domain.com",
  "role": "user",
  "registrationDate": "2016-10-14T15:27:43.123Z"
}
```

### Suppression d’un utilisateur

#### Nom de la requête

`deleteUser`

#### Description

Supprime un utilisateur.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
DELETE | /api/v1/users/{id} | `admin` (tous) / `user` (lui-même)

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant de l’utilisateur | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

```http
HTTP/1.1 204 No Content
```

#### Exemple

Requête :

```sh
$ curl -X DELETE "https://api.participamap.org/users/57dbe334c3eaf116f88e0318"
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 204 No Content
```

## Lieux

### En-têtes de lieux

#### Nom de la requête

`getPlacesHeaders`

#### Description

Récupère les en-têtes de lieux.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /api/v1/places/ | non requis

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

#### Contenu

*Néant*

#### Réponse

Liste d’en-têtes de lieux :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du lieu | "57dbe334c3eaf116f88e0318"
location | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
title | Titre du lieu | "Le Dôme"
*headerPhoto* | Photo d’en-tête | "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"

#### Exemple

Requête :

```sh
$ curl "https://api.participamap.org/places/?when=now"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
[
  {
    "_id": "57dbe334c3eaf116f88e0318",
    "location": {
      "latitude": 49.18165,
      "longitude": -0.34709
    },
    "title": "Le Dôme",
    "headerPhoto": "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"
  },
  {
    "_id": "57dbe738c3eaf116f88e0319",
    "location": {
      "latitude": 49.21272,
      "longitude": -0.36847
    },
    "title": "Salle 417",
    "headerPhoto": "https://files.participamap.org/83ca8f9d.jpg"
  }
]
```

### Informations d’un lieu

#### Nom de la requête

`getPlaceInfo`

#### Description

Récupère les informations sur un lieu.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /api/v1/places/{id} | non requis

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

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
*headerPhoto* | Photo d’en-tête | "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"
*description* | Description | "Maison de la Recherche et de l’Imagination"
*startDate* | Date de création | "2015-01-01T13:00:00.000Z"
*endDate* | Date de suppression | "2016-09-09T08:00:00.000Z"
*rating* | Note moyenne du lieu | 4.8
*moderateComments* | Modération des commentaires | true
*moderatePictures* | Modération des photos | true
*moderateDocuments* | Modération des documents | true
*denyComments* | Interdiction des commentaires | true
*denyPictures* | Interdiction des photos | true
*denyDocuments* | Interdiction des documents | true
*generic1* | Attribut générique nº 1 | {}
*generic2* | Attribut générique nº 2 | {}
*generic3* | Attribut générique nº 3 | {}
*generic4* | Attribut générique nº 4 | {}
*generic5* | Attribut générique nº 5 | {}

\* N’apparaît que si authentifié avec un rôle `content-owner` au minimum.

#### Exemple

Requête :

```sh
$ curl "https://api.participamap.org/places/57dbe334c3eaf116f88e0318"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
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
  "headerPhoto": "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg",
  "description": "Maison de la Recherche et de l’Imagination",
  "startDate": "2015-01-01T13:00:00.000Z",
  "rating": 5
}
```

### Création d’un lieu

#### Nom de la requête

`createPlace`

#### Description

Crée un nouveau lieu.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/places/ | `user`

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Un lieu :

Attribut | Description | Exemple
---------|-------------|--------
location | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
title | Titre du lieu | "Le Dôme"
*isVerified*\* | État de vérification du lieu | true
*type* | Type du lieu | 0
*setHeaderPhoto*\*\* | Chargement d’une photo d’en-tête | true
*description* | Description | "Maison de la Recherche et de l’Imagination"
*startDate* | Date de création | "2015-01-01T13:00:00.000Z"
*endDate* | Date de suppression | "2016-09-09T08:00:00.000Z"
*moderateComments*\* | Modération des commentaires | true
*moderatePictures*\* | Modération des photos | true
*moderateDocuments*\* | Modération des documents | true
*denyComments*\*| Interdiction des commentaires | true
*denyPictures*\* | Interdiction des photos | true
*denyDocuments*\* | Interdiction des documents | true
*generic1* | Attribut générique nº 1 | {}
*generic2* | Attribut générique nº 2 | {}
*generic3* | Attribut générique nº 3 | {}
*generic4* | Attribut générique nº 4 | {}
*generic5* | Attribut générique nº 5 | {}

\* N’est paramétrable qu’en étant authentifié avec un rôle `content-owner` au minimum.

\*\* Pour ajouter une photo d’en-tête, la procédure est la suivante :

1. créer le lieu avec le champ `setHeaderPhoto = true` ;
2. le serveur répond avec un statut HTTP `204 No Content` et un en-tête `Location` précisant une adresse de mise en ligne ;
3. envoyer la photo au serveur avec une requête `PUT` vers l’adresse précisée par la réponse précédente, en précisant bien le bon `Content-Type` ;
4. le serveur répond avec le lieu créé si tout s’est bien passé.

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
*headerPhoto* | Photo d’en-tête | "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"
*description* | Description | "Maison de la Recherche et de l’Imagination"
*startDate* | Date de création | "2015-01-01T13:00:00.000Z"
*endDate* | Date de suppression | "2016-09-09T08:00:00.000Z"
*moderateComments* | Modération des commentaires | true
*moderatePictures* | Modération des photos | true
*moderateDocuments* | Modération des documents | true
*denyComments* | Interdiction des commentaires | true
*denyPictures* | Interdiction des photos | true
*denyDocuments* | Interdiction des documents | true
*generic1* | Attribut générique nº 1 | {}
*generic2* | Attribut générique nº 2 | {}
*generic3* | Attribut générique nº 3 | {}
*generic4* | Attribut générique nº 4 | {}
*generic5* | Attribut générique nº 5 | {}

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/places/" \
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"location":{"latitude":49.18165,"longitude":-0.34709},"title":"Le Dôme","setHeaderPhoto":true}'
```

Comme `setHeaderPhoto = true`, le serveur répond avec :

```http
HTTP/1.1 204 No Content
Location: https://api.participamap.org/upload/57f3d7cf0a7cc112cb8ae23c
Content-Length: 0
```

On poursuit alors avec la requête suivante :

```sh
$ curl -X PUT "https://api.participamap.org/upload/57f3d7cf0a7cc112cb8ae23c" \
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: image/jpeg" \
    --data-binary "@le-dome.jpg"
```

Réponse :

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "57dbe334c3eaf116f88e0318",
  "location": {
    "latitude": 49.18165,
    "longitude": -0.34709
  },
  "title": "Le Dôme",
  "headerPhoto": "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"
}
```

### Modification d’un lieu

#### Nom de la requête

`updatePlace`

#### Description

Modifie un lieu existant.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
PUT | /api/v1/places/{id} | `content-owner`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

Un lieu :

Attribut | Description | Exemple
---------|-------------|--------
*location* | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
*title* | Titre du lieu | "Le Dôme"
*isVerified* | État de vérification du lieu | true
*type* | Type du lieu | 0
*setHeaderPhoto*\* | Chargement d’une photo d’en-tête | true
*deleteHeaderPhoto* | Suppression de la photo d’en-tête | true
*description* | Description | "Maison de la Recherche et de l’Imagination"
*startDate* | Date de création | "2015-01-01T13:00:00.000Z"
*endDate* | Date de suppression | "2016-09-09T08:00:00.000Z"
*moderateComments* | Modération des commentaires | true
*moderatePictures* | Modération des photos | true
*moderateDocuments* | Modération des documents | true
*denyComments* | Interdiction des commentaires | true
*denyPictures* | Interdiction des photos | true
*denyDocuments* | Interdiction des documents | true
*generic1* | Attribut générique nº 1 | {}
*generic2* | Attribut générique nº 2 | {}
*generic3* | Attribut générique nº 3 | {}
*generic4* | Attribut générique nº 4 | {}
*generic5* | Attribut générique nº 5 | {}

\* Pour changer la photo d’en-tête, la procédure est la suivante :

1. modifier le lieu avec le champ `setHeaderPhoto = true` ;
2. le serveur répond avec un statut HTTP `204 No Content` et un en-tête `Location` précisant une adresse de mise en ligne ;
3. envoyer la photo au serveur avec une requête `PUT` vers l’adresse précisée par la réponse précédente, en précisant bien le bon `Content-Type` ;
4. le serveur répond avec le lieu créé si tout s’est bien passé.

#### Réponse

Le lieu mis à jour :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du lieu | "57dbe334c3eaf116f88e0318"
location | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
title | Titre du lieu | "Le Dôme"
isVerified | État de vérification du lieu | true
*proposedBy* | Utilisateur ayant proposé le lieu | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
*type* | Type du lieu | 0
*headerPhoto* | Photo d’en-tête | "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"
*description* | Description | "Maison de la Recherche et de l’Imagination"
*startDate* | Date de création | "2015-01-01T13:00:00.000Z"
*endDate* | Date de suppression | "2016-09-09T08:00:00.000Z"
*rating* | Note moyenne du lieu | 4.8
*moderateComments* | Modération des commentaires | true
*moderatePictures* | Modération des photos | true
*moderateDocuments* | Modération des documents | true
*denyComments* | Interdiction des commentaires | true
*denyPictures* | Interdiction des photos | true
*denyDocuments* | Interdiction des documents | true
*generic1* | Attribut générique nº 1 | {}
*generic2* | Attribut générique nº 2 | {}
*generic3* | Attribut générique nº 3 | {}
*generic4* | Attribut générique nº 4 | {}
*generic5* | Attribut générique nº 5 | {}

#### Exemple

Requête :

```sh
$ curl -X PUT "https://api.participamap.org/places/57dbe334c3eaf116f88e0318" \
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Le Dôme modifié"}'
```

Comme il n’y a pas de changement de photo d’en-tête, le serveur répond directement :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "57dbe334c3eaf116f88e0318",
  "location": {
    "latitude": 49.18165,
    "longitude": -0.34709
  },
  "title": "Le Dôme modifié",
  "headerPhoto": "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"
}
```

### Suppression d’un lieu

#### Nom de la requête

`deletePlace`

#### Description

Supprime un lieu.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
DELETE | /api/v1/places/{id} | `content-owner`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

```http
HTTP/1.1 204 No Content
```

#### Exemple

Requête :

```sh
$ curl -X DELETE "https://api.participamap.org/places/57dbe334c3eaf116f88e0318" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 204 No Content
```

## Commentaires

### Commentaires d’un lieu

#### Nom de la requête

`getComments`

#### Description

Récupère les commentaires d’un lieu dans l’ordre rétro-chronologique.

Les éventuels commentaires en attente de modération ne sont affichés qu’en étant authentifié avec un rôle `moderator` au minimum.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /api/v1/places/{id}/comments/ | non requis

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

Nom | Description | Exemple | Absence
----|-------------|---------|--------
page | Numéro de page | 3 | 1
n | Nombre de commentaires par page | 10 | 10 si `page` est fixé, infini sinon
tomoderate\* | Affiche les commentaires à modérer | true | false

\* Authentification requise avec un rôle `moderator` au minimum. Seuls les commentaires à modérer sont alors affichés, dans l’ordre chronologique.

#### Contenu

*Néant*

#### Réponse

Liste de commentaires :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du commentaire | "57ed7489c6358c1278552be5"
author | Auteur du commentaire | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date du commentaire | "2016-09-19T19:30:26.037Z"
content | Contenu du commentaire | "Très bel endroit"
*toModerate*\* | Drapeau indiquant que le commentaire doit être modéré | true

\* N’apparait qu’en étant authentifié avec un rôle `moderator` au minimum.

#### Exemple

Requête :

```sh
$ curl "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/comments/?page=1&n=2"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
[
  {
    "_id": "57ed7489c6358c1278552be5",
    "author": {
      "id": "57dbe334c3eaf116f88eca27",
      "name": "Jean Dupont"
    },
    "date": "2016-09-19T19:30:26.037Z",
    "content": "Très bel endroit"
  },
  {
    "_id": "57ed7489c6358c1278552be6",
    "author": {
      "id": "57dbe334c3eaf116f88eca2c",
      "name": "Alexis de caen"
    },
    "date": "2016-09-19T19:30:32.739Z",
    "content": "Je plussoie Jean"
  }
]
```

### Création d’un commentaire

#### Nom de la requête

`createComment`

#### Description

Crée un commentaire.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/places/{id}/comments/ | `user`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

Un commentaire :

Attribut | Description | Exemple
---------|-------------|--------
content | Contenu du commentaire | "Très bel endroit"

#### Réponse

Le commentaire créé :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du commentaire | "57ed7489c6358c1278552be5"
author | Auteur du commentaire | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date du commentaire | "2016-09-19T19:30:26.037Z"
content | Contenu du commentaire | "Très bel endroit"

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/comments/" \
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"content": "Très bel endroit"}'
```

Réponse :

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "57ed7489c6358c1278552be5",
  "author": {
    "id": "57dbe334c3eaf116f88eca27",
    "name": "Jean Dupont"
  },
  "date": "2016-09-19T19:30:26.037Z",
  "content": "Très bel endroit"
}
```

### Acceptation d’un commentaire

#### Nom de la requête

`acceptComment`

#### Description

Accepte un commentaire.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/places/{id}/comments/{comment_id}/accept | `moderator`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318
comment_id | Identifiant du commentaire | 57ed7489c6358c1278552be5

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

Le commentaire accepté :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du commentaire | "57ed7489c6358c1278552be5"
author | Auteur du commentaire | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date du commentaire | "2016-09-19T19:30:26.037Z"
content | Contenu du commentaire | "Très bel endroit"

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/comments/57ed7489c6358c1278552be5/accept" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "57ed7489c6358c1278552be5",
  "author": {
    "id": "57dbe334c3eaf116f88eca27",
    "name": "Jean Dupont"
  },
  "date": "2016-09-19T19:30:26.037Z",
  "content": "Très bel endroit"
}
```

### Suppression d’un commentaire

#### Nom de la requête

`deleteComment`

#### Description

Supprime un commentaire.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
DELETE | /api/v1/places/{id}/comments/{comment_id} | `moderator` (tous) / `user` (ses commentaires)

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318
comment_id | Identifiant du commentaire | 57ed7489c6358c1278552be5

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

```http
HTTP/1.1 204 No Content
```

#### Exemple

Requête :

```sh
$ curl -X DELETE "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/comments/57ed7489c6358c1278552be5"
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 204 No Content
```

## Images

### Images d’un lieu

#### Nom de la requête

`getPictures`

#### Description

Récupère les images d’un lieu dans l’ordre rétro-chronologique.

Les éventuelles images en attente de modération ne sont affichées qu’en étant authentifié avec un rôle `moderator` au minimum.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /api/v1/places/{id}/pictures/ | non requis

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

Nom | Description | Exemple | Absence
----|-------------|---------|--------
page | Numéro de page | 3 | 1
n | Nombre d’images par page | 12 | 12 si `page` est fixé, infini sinon
tomoderate\* | Affiche les images à modérer | true | false

\* Authentification requise avec un rôle `moderator` au minimum. Seules les images à modérer sont alors affichées, dans l’ordre chronologique.

#### Contenu

*Néant*

#### Réponse

Liste de liens vers des images :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant de l’image | 57ed7489c6358c1278552be5
author | Auteur de l’image | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date de mise en ligne | "2016-09-19T19:30:26.037Z"
url | URL de l’image | "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"
*toModerate*\* | Drapeau indiquant que l’image doit être modérée | true

\* N’apparait qu’en étant authentifié avec un rôle `moderator` au minimum.

#### Exemple

Requête :

```sh
$ curl "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/pictures/?page=1"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
[
  {
    "_id": "57ed7489c6358c1278552be5",
    "author": {
      "id": "57dbe334c3eaf116f88eca27",
      "name": "Jean Dupont"
    },
    "date": "2016-09-19T19:30:45.173Z",
    "url": "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"
  }
]
```

### Création d’une image

#### Nom de la requête

`createPicture`

#### Description

Ajoute une image à un lieu.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/places/{id}/pictures/ | `user`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*\*

\* Pour poster une image, la procédure est la suivante :

1. créer une image avec un contenu vide\*\*
2. le serveur répond avec un statut HTTP `204 No Content` et un en-tête `Location` précisant une adresse de mise en ligne ;
3. envoyer la photo au serveur avec une requête `PUT` vers l’adresse précisée par la réponse précédente, en précisant bien le bon `Content-Type` ;
4. le serveur répond avec l’image créée si tout s’est bien passé

\*\* L’intérêt de garder deux requêtes est de garder la possibilité d’ajouter facilement des métadonnées aux images en cas de besoin futur.

#### Réponse

Lien vers l’image créée :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant de l’image | 57ed7489c6358c1278552be5
author | Auteur de l’image | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date de mise en ligne | "2016-09-19T19:30:26.037Z"
url | URL de l’image | "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"
*toModerate* | Drapeau indiquant que l’image doit être modérée | true

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/pictures/"
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Le serveur répond avec :

```http
HTTP/1.1 204 No Content
Location: https://api.participamap.org/upload/57f3d7cf0a7cc112cb8ae23c
Content-Length: 0
```

On poursuit alors avec la requête suivante :

```sh
$ curl -X PUT "https://api.participamap.org/upload/57f3d7cf0a7cc112cb8ae23c" \
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: image/jpeg" \
    --data-binary "@test.jpg"
```


Réponse :

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "57ed7489c6358c1278552be5",
  "author": {
    "id": "57dbe334c3eaf116f88eca27",
    "name": "Jean Dupont"
  },
  "date": "2016-09-19T19:30:45.173Z",
  "url": "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"
}
```

### Acceptation d’une image

#### Nom de la requête

`acceptPicture`

#### Description

Accepte une image.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/places/{id}/pictures/{picture_id}/accept | `moderator`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318
picture_id | Identifiant de l’image | 57ed7489c6358c1278552be5

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

Lien vers l’image acceptée :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant de l’image | 57ed7489c6358c1278552be5
author | Auteur de l’image | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date de mise en ligne | "2016-09-19T19:30:26.037Z"
url | URL de l’image | "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/pictures/57ed7489c6358c1278552be5/accept" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "57ed7489c6358c1278552be5",
  "author": {
    "id": "57dbe334c3eaf116f88eca27",
    "name": "Jean Dupont"
  },
  "date": "2016-09-19T19:30:45.173Z",
  "url": "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.jpg"
}
```

### Suppression d’une image

#### Nom de la requête

`deletePicture`

#### Description

Supprime une image.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
DELETE | /api/v1/places/{id}/picture/{picture_id} | `moderator` (tous) / `user` (ses images)

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318
picture_id | Identifiant de l’image | 57ed7489c6358c1278552be5

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

```http
HTTP/1.1 204 No Content
```

#### Exemple

Requête :

```sh
$ curl -X DELETE "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/pictures/57ed7489c6358c1278552be5"
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 204 No Content
```

## Documents

### Documents d’un lieu

#### Nom de la requête

`getDocuments`

#### Description

Récupère les documents d’un lieu dans l’ordre rétro-chronologique.

Les éventuels documents en attente de modération ne sont affichés qu’en étant authentifié avec un rôle `moderator` au minimum.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /api/v1/places/{id}/documents/ | non requis

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

Nom | Description | Exemple | Absence
----|-------------|---------|--------
page | Numéro de page | 3 | 1
n | Nombre de documents par page | 25 | 10 si `page` est fixé, infini sinon
tomoderate\* | Affiche les documents à modérer | true | false

\* Authentification requise avec un rôle `moderator` au minimum. Seuls les documents à modérer sont alors affichés, dans l’ordre chronologique.

#### Contenu

*Néant*

#### Réponse

Liste de liens vers des documents :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du document | 57ed7489c6358c1278552be5
author | Auteur du document | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date de mise en ligne | "2016-09-19T19:30:26.037Z"
title | Titre du document | "histoire\_presquile.pdf"
type | Type MIME du document | "application/pdf"
url | URL du document | "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.pdf"
*toModerate*\* | Drapeau indiquant que le document doit être modérée | true

\* N’apparait qu’en étant authentifié avec un rôle `moderator` au minimum.

#### Exemple

Requête :

```sh
$ curl "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/documents/?page=1"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
[
  {
    "_id": "57ed7489c6358c1278552be5",
    "author": {
      "id": "57dbe334c3eaf116f88eca27",
      "name": "Jean Dupont"
    },
    "date": "2016-09-19T19:30:45.173Z",
    "title": "histoire_presquile.pdf",
    "type": "application/pdf",
    "url": "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.pdf"
  }
]
```

### Création d’un document

#### Nom de la requête

`createDocument`

#### Description

Ajoute un document à un lieu.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/places/{id}/documents/ | `user`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

Métadonnées d’un document\* :

Attribut | Description | Exemple
---------|-------------|--------
title | Titre du document | "historique_presquile.pdf"

\* Pour poster un document, la procédure est la suivante :

1. créer un document avec ses métadonnées
2. le serveur répond avec un statut HTTP `204 No Content` et un en-tête `Location` précisant une adresse de mise en ligne ;
3. envoyer le document au serveur avec une requête `PUT` vers l’adresse précisée par la réponse précédente, en précisant bien le bon `Content-Type` ;
4. le serveur répond avec le document créée si tout s’est bien passé

#### Réponse

Lien vers le document créé :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du document | 57ed7489c6358c1278552be5
author | Auteur du document | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date de mise en ligne | "2016-09-19T19:30:26.037Z"
title | Titre du document | "histoire\_presquile.pdf"
type | Type MIME du document | "application/pdf"
url | URL du document | "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.pdf"
*toModerate* | Drapeau indiquant que le document doit être modérée | true

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/documents/"
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"histoire_presquile.pdf"}'
```

Le serveur répond avec :

```http
HTTP/1.1 204 No Content
Location: https://api.participamap.org/upload/57f3d7cf0a7cc112cb8ae23c
Content-Length: 0
```

On poursuit alors avec la requête suivante :

```sh
$ curl -X PUT "https://api.participamap.org/upload/57f3d7cf0a7cc112cb8ae23c" \
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: application/pdf" \
    --data-binary "@histoire_presquile.pdf"
```


Réponse :

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "57ed7489c6358c1278552be5",
  "author": {
    "id": "57dbe334c3eaf116f88eca27",
    "name": "Jean Dupont"
  },
  "date": "2016-09-19T19:30:45.173Z",
  "title": "histoire_presquile.pdf",
  "type": "application/pdf",
  "url": "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.pdf"
}
```

### Acceptation d’un document

#### Nom de la requête

`acceptDocument`

#### Description

Accepte un document.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/places/{id}/documents/{document_id}/accept | `moderator`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318
document_id | Identifiant du document | 57ed7489c6358c1278552be5

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

Lien vers le document accepté :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du document | 57ed7489c6358c1278552be5
author | Auteur du document | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date de mise en ligne | "2016-09-19T19:30:26.037Z"
title | Titre du document | "histoire\_presquile.pdf"
type | Type MIME du document | "application/pdf"
url | URL du document | "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.pdf"

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/documents/57ed7489c6358c1278552be5/accept" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "57ed7489c6358c1278552be5",
  "author": {
    "id": "57dbe334c3eaf116f88eca27",
    "name": "Jean Dupont"
  },
  "date": "2016-09-19T19:30:45.173Z",
  "title": "histoire_presquile.pdf",
  "type": "application/pdf",
  "url": "https://files.participamap.org/97a15d97-847e-450c-8bd0-1f922883f523.pdf"
}
```

### Suppression d’un document

#### Nom de la requête

`deleteDocument`

#### Description

Supprime un document.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
DELETE | /api/v1/places/{id}/document/{document_id} | `moderator` (tous) / `user` (ses documents)

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318
document_id | Identifiant du document | 57ed7489c6358c1278552be5

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

```http
HTTP/1.1 204 No Content
```

#### Exemple

Requête :

```sh
$ curl -X DELETE "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/documents/57ed7489c6358c1278552be5"
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 204 No Content
```

## Notations

### Récupération de sa notation d’un lieu

#### Nom de la requête

`getUserRating`

#### Description

Récupère sa notation du lieu (en étant identifié).

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /api/v1/places/{id}/rating | `user`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

Une note :

Attribut | Description | Exemple
---------|-------------|--------
value | Notation du lieu par l’utilisateur | 4 (0 si l’utilisateur n’a pas noté le lieu)

#### Exemple

Requête :

```sh
$ curl "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/rating"
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "value": 0
}
```

### Notation d’un lieu

#### Nom de la requête

`ratePlace`

#### Description

Note un lieu.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/places/{id}/rating | `user`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

Une note :

Attribut | Description | Exemple
---------|-------------|--------
value | Notation du lieu par l’utilisateur | 4

#### Réponse

La note enregistrée :

Attribut | Description | Exemple
---------|-------------|--------
value | Notation du lieu par l’utilisateur | 4

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/places/57dbe334c3eaf116f88e0318/rating"
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"value": 4}'
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "value": 4
}
```

## Parcours

### Liste des parcours

#### Nom de la requête

`getRoutesHeaders`

#### Description

Récupère les en-têtes de parcours.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /api/v1/routes/ | non requis

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

Nom | Description | Exemple | Absence
----|-------------|---------|--------
place | Identifiant d’un lieu devant être contenu dans le parcours | 57e5261dab4feb4a2af3f419 | Tout

#### Contenu

*Néant*

#### Réponse

Liste d’en-têtes de parcours :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du parcours | "58108eda412d1215e99378cd"
title | Titre du parcours | "Parcours historique"

#### Exemple

Requête :

```sh
$ curl "https://api.participamap.org/routes/"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
[
  {
    "_id": "58108eda412d1215e99378cd",
    "title": "Parcours historique"
  },
  {
    "_id": "5810a4061a833d09b5c04b7c",
    "title": "Découverte"
  }
]
```

### Informations d’un parcours

#### Nom de la requête

`getRouteInfo`

#### Description

Récupère les informations d’un parcours.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /api/v1/routes/{id} | non requis

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du parcours | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

Un parcours :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du parcours | "57dbe334c3eaf116f88e0318"
title | Titre du parcours | "Parcours historique"
places | Liste des lieux constituant le parcours | ["57e5261dab4feb4a2af3f419", "57e5261dab4feb4a2af3f4a8"]

#### Exemple

Requête :

```sh
$ curl "https://api.participamap.org/routes/57dbe334c3eaf116f88e0318"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "58108eda412d1215e99378cd",
  "title": "Parcours historique",
  "places": [
    "57e5261dab4feb4a2af3f419",
    "57e5261dab4feb4a2af3f4a8"
  ]
}
```

### Création d’un parcours

#### Nom de la requête

`createRoute`

#### Description

Crée un nouveau parcours.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/routes/ | `content-owner`

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Un parcours :

Attribut | Description | Exemple
---------|-------------|--------
title | Titre du parcours | "Parcours historique"
places | Liste des lieux constituant le parcours | ["57e5261dab4feb4a2af3f419", "57e5261dab4feb4a2af3f4a8"]

#### Réponse

Le parcours créé :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du parcours | "57dbe334c3eaf116f88e0318"
title | Titre du parcours | "Parcours historique"
places | Liste des lieux constituant le parcours | ["57e5261dab4feb4a2af3f419", "57e5261dab4feb4a2af3f4a8"]

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/routes/" \
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Parcours historique","places":["57e5261dab4feb4a2af3f419","57e5261dab4feb4a2af3f4a8"]}'
```

Réponse :

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "58108eda412d1215e99378cd",
  "title": "Parcours historique",
  "places": [
    "57e5261dab4feb4a2af3f419",
    "57e5261dab4feb4a2af3f4a8"
  ]
}
```

### Modification d’un parcours

#### Nom de la requête

`updateRoute`

#### Description

Modifie un parcours existant.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
PUT | /api/v1/routes/{id} | `content-owner`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du parcours | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

Un parcours :

Attribut | Description | Exemple
---------|-------------|--------
*title* | Titre du parcours | "Parcours historique"
*places* | Liste des lieux constituant le parcours | ["57e5261dab4feb4a2af3f419", "57e5261dab4feb4a2af3f4a8"]

#### Réponse

Le parcours mis à jour :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du parcours | "57dbe334c3eaf116f88e0318"
title | Titre du parcours | "Parcours historique"
places | Liste des lieux constituant le parcours | ["57e5261dab4feb4a2af3f419", "57e5261dab4feb4a2af3f4a8"]

#### Exemple

Requête :

```sh
$ curl -X PUT "https://api.participamap.org/routes/57dbe334c3eaf116f88e0318" \
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Parcours historique modifié"}'
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "58108eda412d1215e99378cd",
  "title": "Parcours historique modifié",
  "places": [
    "57e5261dab4feb4a2af3f419",
    "57e5261dab4feb4a2af3f4a8"
  ]
}
```

### Ajout d’un lieu à un parcours

#### Nom de la requête

`addPlace`

#### Description

Ajoute un lieu à la fin d’un parcours existant.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/routes/{id}/ | `content-owner`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du parcours | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

Identifiant d’un lieu :

Attribut | Description | Exemple
---------|-------------|--------
place | Identifiant du lieu à ajouter au parcours | "580358be27b9e512fb75c83b"

#### Réponse

Le parcours mis à jour :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du parcours | "57dbe334c3eaf116f88e0318"
title | Titre du parcours | "Parcours historique"
places | Liste des lieux constituant le parcours | ["57e5261dab4feb4a2af3f419", "57e5261dab4feb4a2af3f4a8"]

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/routes/57dbe334c3eaf116f88e0318/" \
    -H "Authorization: Bearer JSON_WEB_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"place":"580358be27b9e512fb75c83b"}'
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "58108eda412d1215e99378cd",
  "title": "Parcours historique",
  "places": [
    "57e5261dab4feb4a2af3f419",
    "57e5261dab4feb4a2af3f4a8",
    "580358be27b9e512fb75c83b"
  ]
}
```

### Suppression d’un lieu dans un parcours

#### Nom de la requête

`removePlace`

#### Description

Retire un lieu d’un parcours.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
DELETE | /api/v1/routes/{id}/{index} | `content-owner`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du parcours | 57dbe334c3eaf116f88e0318
index | Index du lieu à retirer | 1

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

Le parcours mis à jour :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du parcours | "57dbe334c3eaf116f88e0318"
title | Titre du parcours | "Parcours historique"
places | Liste des lieux constituant le parcours | ["57e5261dab4feb4a2af3f419", "57e5261dab4feb4a2af3f4a8"]

#### Exemple

Requête :

```sh
$ curl -X DELETE "https://api.participamap.org/routes/57dbe334c3eaf116f88e0318/1" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "58108eda412d1215e99378cd",
  "title": "Parcours historique",
  "places": [
    "57e5261dab4feb4a2af3f419",
    "580358be27b9e512fb75c83b"
  ]
}
```

### Suppression d’un parcours

#### Nom de la requête

`deleteRoute`

#### Description

Supprime un parcours.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
DELETE | /api/v1/routes/{id} | `content-owner`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du parcours | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

```http
HTTP/1.1 204 No Content
```

#### Exemple

Requête :

```sh
$ curl -X DELETE "https://api.participamap.org/routes/57dbe334c3eaf116f88e0318" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 204 No Content
```

## Rapports d’abus

### Rapport d’un contenu abusif

#### Nom de la requête

`reportAbuse`

#### Description

Rapporte un contenu abusif.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | {path\_to\_content}/report | `user`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
path\_to\_content | Chemin vers le contenu | /api/v1/places/57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

Le rapport d’abus créé :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du rapport d’abus | 5810f690a40261392f823fbc
author | Auteur du rapport | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date du rapport | "2016-10-16T20:19:36.251Z"
type | Type de contenu rapporté | "comment"
reportedContent | Contenu rapporté | {Object}

#### Exemple

Requête :

```sh
$ curl -X POST "http://api.participamap.org/places/57ddbfacaf832bcfcb18c3df/comments/5803e0d83123de250f9c43ff/report" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "_id": "5810f690a40261392f823fbc",
  "author": {
    "id": "5802aaa97cb43a3094ba2f61",
    "name": "Jean Dupont"
  },
  "date": "2016-10-26T18:31:44.852Z",
  "type": "comment",
  "reportedContent": {
    "_id": "5803e0d83123de250f9c43ff",
    "place": "57ddbfacaf832bcfcb18c3df",
    "author": "58029d822779132827686f2f",
    "date": "2016-10-16T20:19:36.251Z",
    "content": "Salut salut"
  }
}
```

### Liste des rapports d’abus

#### Nom de la requête

`getAbuseReports`

#### Description

Récupère la liste des rapports d’abus dans l’ordre chronologique.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /api/v1/abuse-reports/ | `moderator`

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

Nom | Description | Exemple | Absence
----|-------------|---------|--------
page | Numéro de page | 3 | 1
n | Nombre de rapports d’abus par page | 10 | 25 si `page` est fixé, infini sinon

#### Contenu

*Néant*

#### Réponse

Liste de rapports d’abus :

Attribut | Description | Exemple
---------|-------------|--------
_id | Identifiant du rapport d’abus | 5810f690a40261392f823fbc
author | Auteur du rapport | { "id": "57dbe334c3eaf116f88eca27", "name": "Jean Dupont" }
date | Date du rapport | "2016-10-16T20:19:36.251Z"
type | Type de contenu rapporté | "comment"
reportedContent | Contenu rapporté | {Object}

#### Exemple

Requête :

```sh
$ curl "http://api.participamap.org/abuse-reports/?page=1" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
[
  {
    "_id": "580ff2bc1f468d2d553a84cf",
    "author": {
      "id": "5802aaa97cb43a3094ba2f61",
      "name": "Jean Dupont"
    },
    "date": "2016-10-26T00:03:08.992Z",
    "type": "place",
    "reportedContent": {
      "_id": "57ddbfacaf832bcfcb18c3df",
      "location": {
        "latitude": 49.179121,
        "longitude": -0.3593137
      },
      "title": "Crotte de chien",
      "isVerified": false,
      "proposedBy": "57dbe334c3eaf116f88eca27"
    }
  },
  {
    "_id": "5810f690a40261392f823fbc",
    "author": {
      "id": "5802aaa97cb43a3094ba2f61",
      "name": "Jean Dupont"
    },
    "date": "2016-10-26T18:31:44.852Z",
    "type": "comment",
    "reportedContent": {
      "_id": "5803e0d83123de250f9c43ff",
      "place": "57ddbfacaf832bcfcb18c3df",
      "author": "58029d822779132827686f2f",
      "date": "2016-10-16T20:19:36.251Z",
      "content": "Salut salut"
    }
  }
]
```

### Suppression d’un rapport d’abus

#### Nom de la requête

`deleteAbuseReport`

#### Description

Supprime un rapport d’abus.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
DELETE | /api/v1/abuse-reports/{id} | `moderator`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du rapport d’abus | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

```http
HTTP/1.1 204 No Content
```

#### Exemple

Requête :

```sh
$ curl -X DELETE "https://api.participamap.org/abuse-reports/57dbe334c3eaf116f88e0318" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 204 No Content
```

### Suppression d’un contenu abusif

#### Nom de la requête

`deleteAbusiveContent`

#### Description

Supprime un rapport d’abus et le contenu abusif qu’il rapporte.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /api/v1/abuse-reports/{id}/delete-content | `moderator`

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du rapport d’abus | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

*Néant*

#### Contenu

*Néant*

#### Réponse

```http
HTTP/1.1 204 No Content
```

#### Exemple

Requête :

```sh
$ curl -X POST "https://api.participamap.org/abuse-reports/57dbe334c3eaf116f88e0318/delete-content" \
    -H "Authorization: Bearer JSON_WEB_TOKEN"
```

Réponse :

```http
HTTP/1.1 204 No Content
```
