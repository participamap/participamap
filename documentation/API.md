# API participamap

## Sommaire

* [**Informations générales**](#informations-generales)
    * [Protocole et format](#protocole-et-format)
    * [Appels réussis](#appels-reussis)
    * [Gestion des erreurs](#gestion-des-erreurs)
* [**Lieux**](#lieux)
    * [Récupération des en-têtes de lieux](#recuperation-des-en-tetes-de-lieux)

## Informations générales

### Protocole et format

L’API utilise le protocole HTTP. Les paramètres des requêtes doivent être passés en JSON avec l’en-tête `Content-Type: application/json`. Les réponses sont toujours en JSON.

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

### Récupération des en-têtes de lieux

#### Description

Récupère toutes les en-têtes de lieux.

#### Point d’accès

Méthode | Chemin | autorisation
:------:|:------:|:-----------:
GET | /places | non requis

#### Paramètres

*Néan*

#### Réponse

Liste d’en-têtes de lieux, comprenant chacune les propriétés suivantes :

Nom | Description | Exemple
----|-------------|--------
_id | Identifiant du lieu | ObjectId("57dbe334c3eaf116f88e0318")
location | Localisation du lieu | { "latitude": 49.18165, "longitude": -0.34709 }
title | Titre du lieu | "Le Dôme"

#### Exemple

```sh
$ curl https://api.example.com/places
```

```json
[
  {
    "_id": ObjectId("57dbe334c3eaf116f88e0318"),
    "location": {
      "latitude": 49.18165,
      "longitude": -0.34709
    },
    "title": "Le Dôme"
  },
  {
    "_id": ObjectId("57dbe738c3eaf116f88e0319"),
    "location": {
      "latitude": 49.21272,
      "longitude": -0.36847
    },
    "title": "Salle 417"
  }     
]
```
