# API participamap

## Sommaire

* [**Informations générales**](#informations-generales)
    * [Protocole et format](#protocole-et-format)
    * [Appels réussis](#appels-reussis)
    * [Gestion des erreurs](#gestion-des-erreurs)

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
