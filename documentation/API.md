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
    * [Commentaires d’un lieu](#commentaires-dun-lieu)
    * [Création d’un commentaire](#création-dun-commentaire)
    * [Acceptation d’un commentaire](#acceptation-dun-commentaire)
    * [Suppression d’un commentaire](#suppression-dun-commentaire)
    * [Images d’un lieu](#images-dun-lieu)
    * [Création d’une image](#création-dune-image)
    * [Acceptation d’une image](#acceptation-dune-image)
    * [Suppression d’une image](#suppression-dune-image)
    * [Documents d’un lieu](#documents-dun-lieu)
    * [Création d’un document](#création-dun-document)
    * [Acceptation d’un document](#acceptation-dun-document)
    * [Suppression d’un document](#suppression-dun-document)
    * [Récuparation de sa notation d’un lieu](#récupération-de-sa-notation-dun-lieu)
    * [Notation d’un lieu](#notation-dun-lieu)
* [**Parcours**](#parcours)
   * [Lister les parcours](#lister-les-parcours)
   * [Création d’un parcours](#création-dun-parcours)
   * [Suppression d’un parcours](#suppression-dun-parcours)
* [**Abus**](#abus)
   * [Lister les abus](#lister-les-abus)
   * [Création d’un abus](#création-dun-abus)
   * [Suppression d’un abus](#suppression-dun-abus)
   * [Suppression du contenu d'un abus](#suppression-du-contenu-dun-abus)

## Informations générales

### Protocole, format et encodage

L’API utilise le protocole HTTP. Le contenu des requêtes doit être passé en JSON avec l’en-tête `Content-Type: application/json` le cas échéant, sauf mention contraire. Le contenu des réponses est toujours en JSON. L’encodage utilisé est UTF-8.

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
POST | /register | non requis

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
POST | /login | non requis

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
GET | /users/ | `admin`

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
GET | /users/{id} | `admin` (tous) / `user` (lui-même)

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
POST | /users/ | `admin`

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

Un utilisateur :

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
PUT | /users/{id} | `admin` (tous) / `user` (lui-même)

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
DELETE | /users/{id} | `admin` (tous) / `user` (lui-même)

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
GET | /places/ | non requis

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
GET | /places/{id} | non requis

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
POST | /places/ | `user`

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
PUT | /places/{id} | `content-owner`

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

Le lieu modifié :

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
DELETE | /places/{id} | `content-owner`

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

### Commentaires d’un lieu

#### Nom de la requête

`getComments`

#### Description

Récupère les commentaires d’un lieu dans l’ordre rétro-chronologique.

Les éventuels commentaires en attente de modération ne sont affichés qu’en étant authentifié avec un rôle `moderator` au minimum.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /places/{id}/comments/ | non requis

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
POST | /places/{id}/comments/ | `user`

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

Un commentaire :

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
POST | /places/{id}/comments/{comment_id}/accept | `moderator`

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

Un commentaire :

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
DELETE | /places/{id}/comments/{comment_id} | `moderator` (tous) / `user` (ses commentaires)

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

### Images d’un lieu

#### Nom de la requête

`getPictures`

#### Description

Récupère les images d’un lieu dans l’ordre rétro-chronologique.

Les éventuelles images en attente de modération ne sont affichées qu’en étant authentifié avec un rôle `moderator` au minimum.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /places/{id}/pictures/ | non requis

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
POST | /places/{id}/pictures/ | `user`

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

Lien vers une image :

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
POST | /places/{id}/pictures/{picture_id}/accept | `moderator`

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

Lien vers une image :

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
DELETE | /places/{id}/picture/{picture_id} | `moderator` (tous) / `user` (ses images)

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

### Documents d’un lieu

#### Nom de la requête

`getDocuments`

#### Description

Récupère les documents d’un lieu dans l’ordre rétro-chronologique.

Les éventuels documents en attente de modération ne sont affichés qu’en étant authentifié avec un rôle `moderator` au minimum.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /places/{id}/documents/ | non requis

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
POST | /places/{id}/documents/ | `user`

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

Lien vers un document :

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
POST | /places/{id}/documents/{document_id}/accept | `moderator`

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

Lien vers un document :

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
DELETE | /places/{id}/document/{document_id} | `moderator` (tous) / `user` (ses documents)

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

### Récupération de sa notation d’un lieu

#### Nom de la requête

`getUserRating`

#### Description

Récupère sa notation du lieu (en étant identifié).

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /places/{id}/rating | `user`

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
POST | /places/{id}/rating | `user`

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

Une note :

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

#### Création d’un parcours

#### Nom de la requête

`createRoute`

#### Description

Creer un parcours avec une liste de lieux

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /routes | Content-owner

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Identifiants :

Attribut | Description | Exemple
---------|-------------|--------
title | titre du parcours | parcours du Dôme
places | liste des places | 57e5261dab4feb4a2af3f419

#### Exemple

Requête :

```sh
curl -X POST -H "Content-Type: application/json" http://https://api.participamap.org/routes -d '{"title":"parcours du Dôme","places" : ["57e5261dab4feb4a2af3f419"]}'
```

Réponse :

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

```json
{
  //TODO https://api.participamap.org/abuses/
}
```

### Lister les parcours

#### Nom de la requête

`getRoute`

#### Description

Récuperer tous les parcours

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /routes | content-owner

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Identifiants :

Attribut | Description | Exemple
---------|-------------|--------
title | titre du parcours | parcours du Dôme
places | liste des places | ['57e5261dab4feb4a2af3f419']

#### Exemple

Requête :

```sh
curl -X GET -H "Content-Type: application/json" https://api.participamap.org/routes/
```

Réponse :

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

```json
{
  //TODO
}
```
### Suppression d'un parcours

#### Nom de la requête

`deleteRoute`

#### Description

Supprime un parcours

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
DELETE | /routes/{id} | Content-owner

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Identifiants :

Attribut | Description | Exemple
---------|-------------|--------
title | titre du parcours | parcours du Dôme
places | liste des places | ['57e5261dab4feb4a2af3f419']

#### Exemple

Requête :

```sh
curl -X DELETE -H "Content-Type: application/json" https://api.participamap.org/routes/58086fc915e92e10f3244e73
```

Réponse :

```http
HTTP/1.1 204 
```

```json
{
  //TODO
}
```


#### Abuse

#### Lister les abus

#### Nom de la requête

`getAbuse`

#### Description

Récupère tous les abus 

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /abuses/ | moderator

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Identifiants :

Attribut | Description | Exemple
---------|-------------|--------
type | type de l'objet (commentaire,document,image) | parcours du Dôme
user | id de l'utilisateur concerné | 57e4d06ff0653747e4559bfe
contentReport | id du contenu de l'objet | 57ff35e1e446c90c26e9980f

#### Exemple

Requête :

```sh
curl -X GET -H "Content-Type: application/json" https://api.participamap.org/abuses/
```

Réponse :

```http
HTTP/1.1 200 ok
Content-Type: application/json; charset=utf-8
```

```json
{
  //TODO
}
```

#### Création d'un abus


#### Nom de la requête

`createAbuse`

#### Description

Créer un abus reporté par un commentaire,image ou document

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
POST | /places/{id}/comments/{id}/abuseReport | user

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Identifiants :

Attribut | Description | Exemple
---------|-------------|--------
type | type de l'objet (commentaire,document,image) | parcours du Dôme
user | id de l'utilisateur concerné | 57e4d06ff0653747e4559bfe
contentReport | id du contenu de l'objet | 57ff35e1e446c90c26e9980f

#### Exemple

Requête :

```sh
curl -X POST -H "Content-Type: application/json" https://api.participamap.org/places/57e5261dab4feb4a2af3f419/comments/57ff35e1e446c90c26e9980f/abuseReport -d '{ "type" : "comment" , "user" : "57e4d06ff0653747e4559bfe" , "contentReported" : "57ff35e1e446c90c26e9980f" }'
```

Réponse :

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

```json
{
  //TODO
}
```

#### Suppression d'un abus

#### Nom de la requête

`deleteAbuse`

#### Description

Supprimer un abus

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
DELETE | /abuses/{id} | moderator

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Identifiants :

Attribut | Description | Exemple
---------|-------------|--------
type | type de l'objet (commentaire,document,image) | parcours du Dôme
user | id de l'utilisateur concerné | 57e4d06ff0653747e4559bfe
contentReport | id du contenu de l'objet | 57ff35e1e446c90c26e9980f

#### Exemple

Requête :

```sh
curl -X DELETE -H "Content-Type: application/json" https://api.participamap.org/abuses/57e5261dab4feb4a2af3f419
```

Réponse :

```http
HTTP/1.1 204
```

```json
{
  //TODO
}
```
#### Suppression du contenu d'un abus

#### Suppression d'un abus

#### Nom de la requête

`deleteContentReport`

#### Description

Supprime le contenu d'un abus

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
DELETE | /deleteContentReport/{id} | moderator

#### Paramètres de chemin

*Néant*

#### Paramètres de requête

*Néant*

#### Contenu

Identifiants :

Attribut | Description | Exemple
---------|-------------|--------
type | type de l'objet (commentaire,document,image) | parcours du Dôme
user | id de l'utilisateur concerné | 57e4d06ff0653747e4559bfe
contentReport | id du contenu de l'objet | 57ff35e1e446c90c26e9980f

#### Exemple

Requête :

```sh
curl -X DELETE -H "Content-Type: application/json" https://api.participamap.org/abuseContentReport/57e5261dab4feb4a2af3f419
```

Réponse :

```http
HTTP/1.1 204
```

```json
{
  //TODO
}
```

