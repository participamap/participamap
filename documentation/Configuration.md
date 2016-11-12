# Configuration

## Sommaire

* [**Fichier de configuration**](#fichier-de-configuration)
* [**Description des attributs**](#description-des-attributs)
    * [Configuration générale](#configuration-générale)
    * [MongoDB](#mongodb)
    * [Système d’autorisation (jetons)](#système-dautorisation-jetons)
    * [Stockage de fichiers](#stockage-de-fichiers)

## Fichier de configuration

Pour fonctionner, **participamap** nécessite un fichier `config.json` contenant la configuration du service. Ce fichier doit être au format JSON. Tous ses attributs sont obligatoires.

## Description des attributs

### Configuration générale

#### `serverURL`

* **Type :** String

Le serveur a besoin de connaitre son URL d’accès public, qui doit donc être renseigné dans cet attribut.

**Exemple :** `"https://participamap.org/"`

#### `supervisor.pendingUploadsValidity`

* **Type :** Number

Certains appels API nécessitent la mise en ligne d’une donnée binaire (image, document). Cette procédure nécessite deux requêtes successives : l’une pour envoyer les méta-données, l’autre les données binaires. En attente de la deuxième requête, les méta-données sont sauvegardées temporairement dans la base de données. Cet attribut permet de paramétrer la durée de validité de ces méta-données dans la base de données, **en secondes**.

**Exemple :** `60`

### MongoDB

#### `mongodb.uri`

* **Type :** String

**participamap** nécessite une base de données MongoDB. Cet attribut permet d’indiquer l’URI de la base de données à utiliser.

**Exemple :** `"mongodb://localhost/participamap/"`

#### `mongodb.options`

* **Type :** Object

Le driver MongoDB peut avoir besoin de paramètres supplémentaires pour se connecter à la base de données, comme des identifiants et une base de donnée d’authentification.

Si aucun paramètre n’est à renseigner, cet attribut attend un objet vide `{}`. Sinon, il est à renseigner avec les options prévues dans la documentation du driver `mongoose`.

**Exemple :**
    
```json
{
  "user": "participamap",
  "pass": "dUXA4wSBLj9yhW2UaMTV29jd4V0hAF",
  "auth": {
    "authdb": "admin"
  }
}
```

### Système d’autorisation (jetons)

#### `auth.secret`

* **Type :** String

Le système d’autorisation a besoin d’un secret pour générer des jetons. Une bonne idée peut être par exemple de générer un nombre aléatoire de 256 bits et l’encoder en *base64* :

    $ node
    > crypto.randomBytes(32).toString('base64')
    'Gvba7PGoclt0ZCeu2E3sYuhJ98TjbugW9ST7Q4eh060='

**Exemple :** `"Gvba7PGoclt0ZCeu2E3sYuhJ98TjbugW9ST7Q4eh060="`

#### `auth.tokenValidity`

* **Type :** Number

Les jetons générés par le serveur ont une durée de vie, qui doit être définie. Plus cette valeur est grande et moins les utilisateurs devront s’authentifier régulièrement. L’autorisation étant au porteur, un jeton est valide jusqu’à son expiration ou jusqu’à un changement du secret.

**Exemple :** `86400`

### Stockage de fichiers

Lorsque des photos ou des documents sont mis en ligne, ils doivent être stockés quelque part. Les options suivantes permettent de configurer le stockage des fichiers.

#### `fileUpload.method`

* **Type :** String

Cet attribut permet d’indiquer la méthode de stockage à utiliser. Les valeurs suivantes sont possibles\* :

Valeur | Description
-------|------------
`"local"` | Enregistre le fichier localement

\* D’autres méthodes pourront être implémentées facilement plus tard, permettant par exemple de stocker des fichiers à l’aide d’un service tiers.

#### `fileUpload.options`

* **Type :** Object

Le driver utilisé pour stocker les fichier peut nécessiter des options, à renseigner dans cet attribut.

##### Options de la méthode `local`

Attribut | Type | Description | Exemple
---------|------|-------------|--------
uploadDir | String | Répertoire dans lequel sauvegarder les fichiers | "./uploads/"
fileServerURL | String | URL d’accès public à ce répertoire\* | "https://participamap.org/uploads/"

\* **participamap** rend disponible le contenu du répertoire `uploads/` accessible au publiquement via `<serverURL>/uploads/`. Ce répertoire peut donc être utilisé par défaut pour stocker les fichiers mis en ligne.
