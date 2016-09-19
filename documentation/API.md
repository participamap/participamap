# API participamap

## Sommaire

* [**Informations générales**](#informations-generales)
    * [Protocole et format](#protocole-et-format)
    * [Appels réussis](#appels-réussis)
    * [Gestion des erreurs](#gestion-des-erreurs)
* [**Lieux**](#lieux)
    * [En-têtes de lieux](#en-têtes-de-lieux)
    * [Informations d’un lieu](#informations-dun-lieu)

## Informations générales

### Protocole et format

L’API utilise le protocole HTTP. Les charges des requêtes doivent être passés en JSON avec l’en-tête `Content-Type: application/json`. Les réponses sont toujours en JSON.

### Appels réussis

Si un appel API est réussi, le service web répond avec :

* un statut HTTP 200 (OK) ou HTTP 201 (Created),
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

#### Description

Récupère les en-têtes de lieux.

#### Point d’accès

Méthode | Chemin | Autorisation
:------:|:------:|:-----------:
GET | /places | non requis

#### Paramètres de chemin

*Néan*

#### Paramètres de requête

Nom | Description | Exemples
----|-------------|---------
when | Date de la carte à afficher | now, 2016-09-16
lat | Latitude du centre du cadre de recherche | 49.18165
long | Longitude du centre du cadre de recherche | -0.34709
height | Demi-hauteur du cadre de rercherche en degrés | 0.03
width | Demi-largeur du cadre de recherche en degrés | 0.03

**Note : *lat*, *long*, *height* et *width* doivent être renseignés ensemble.**

#### Charge

*Néan*

#### Réponse

Liste d’en-têtes de lieux :

Attribut | Description | Exemple
---------|-------------|--------
id | Identifiant du lieu | "57dbe334c3eaf116f88e0318"
location | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
title | Titre du lieu | "Le Dôme"

#### Exemple

```sh
$ curl https://api.example.com/places?when=now
```

```json
[
  {
    "id": "57dbe334c3eaf116f88e0318",
    "location": {
      "latitude": 49.18165,
      "longitude": -0.34709
    },
    "title": "Le Dôme"
  },
  {
    "id": "57dbe738c3eaf116f88e0319",
    "location": {
      "latitude": 49.21272,
      "longitude": -0.36847
    },
    "title": "Salle 417"
  }     
]
```

### Informations d’un lieu

#### Description

Récupère les informations sur un lieu.

#### Point d’accès

Méthode | Chemin | autorisation
:------:|:------:|:-----------:
GET | /places/{id} | non requis

#### Paramètres de chemin

Nom | Description | Exemple
----|-------------|--------
id | Identifiant du lieu | 57dbe334c3eaf116f88e0318

#### Paramètres de requête

Nom | Description | Exemple
----|-------------|--------

#### Charge

*Néan*

#### Réponse

Un lieu :

Attribut | Description | Exemple
---------|-------------|--------
id | Identifiant du lieu | "57dbe334c3eaf116f88e0318"
location | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
title | Titre du lieu | "Le Dôme"
isVerified | État de vérification du lieu | true
*type* | Type du lieu | 0
*description* | Description | "Maison de la Recherche et de l’Imagination"
*startDate* | Date de création | "2015-01-01T13:00:00.000Z"
*endDate* | Date de suppression | "2016-09-09T08:00:00.000Z"

#### Exemple

```sh
$ curl https://api.example.com/places/57dbe334c3eaf116f88e0318
```

```json
{
  "id": "57dbe334c3eaf116f88e0318",
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
