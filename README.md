# PolySign - Feuille de présence basée sur l’IoT

## Sujet TER041

Notre solution permet de gérer une feuille de présence digitalisée. Elle est destinée à un usage universitaire/scolaire afin de simplifier la gestion des présences pour les professeurs.

Elle repose sur l’utilisation du NFC pour le partage de la feuille digitale, des smartphones des professeurs et étudiants via notre application mobile, et d’une logique serveur pour automatiser les traitements.

Notre procédé fonctionne comme suit : Dans la salle équipée d’un tag NFC, le professeur va s’identifier en tant que tel sur son application. Il va pouvoir sélectionner un de ses cours pour générer la feuille d’émargement grâce au serveur. Il va écrire cette feuille sur le tag NFC, qui circulera d’étudiant en étudiant pour qu’ils puissent la lire.

Chaque étudiant va pouvoir, en s’identifiant sur l’application, apposer sa signature et la mettre à jour sur le tag NFC.
Une fois la feuille complétée par tous les étudiants présents, le professeur la récupère en scannant le tag NFC. Le professeur aura un aperçu des présences et absences, et aura la main pour modifier l’état des présences et absences si des rectifications sont à faire (par exemple s’il y a un échec de lecture/écriture d’un élève sur le tag NFC). Il pourra finalement signer la feuille à son tour et clôturer l’émargement.

## Modalité de livraison

### Application mobile

L’application mobile se trouve dans le dossier “mobile”. Pour installer l’application, veuillez vous assurer de lancer la commande `npm install` dans le dossier `./mobile`. Vous devrez ensuite mettre en place votre environnement. Pour cela vous pouvez suivre les tutoriels de la documentation officielle de react native :

- https://reactnative.dev/docs/environment-setup pour l’environnement
- https://reactnative.dev/docs/running-on-device pour lancer l’application

L’application mobile contactera l’API de notre backend déployé à https://server-aph4.onrender.com, vous devrez donc être connecté à internet sur votre smartphone.

_Note_ : Lancez l’application mobile sur un émulateur ne vous permettra pas d’utiliser le NFC, vous ne pourrez pas faire fonctionner correctement l’application. Nous vous conseillons de connecter un smartphone android, de vérifier qu’il est bien détecté grâce à la commande adb devices, puis d’ouvrir un terminal dans le dossier mobile et y lancer la commande `npm run release:android`, qui créera un apk de l’application et l’installera sur votre smartphone connecté.

### Serveur

La partie serveur se trouve dans le dossier `./server`. Le serveur conteneurisé peut être lancé en local grâce à deux scripts bash, `./build.sh` pour build l’image docker et `./run.sh` pour lancer l’image dans un conteneur, sur le port 3000. Notez que compte tenu du fait que le client est une application mobile, si vous souhaitez lancer le serveur en local, vous devez utiliser par exemple ngrok qui est utilitaire permettant de simuler un serveur sur un réseau local.

Pour installer ngrok: https://ngrok.com/download.

Pour lancer ngrok dans un terminal: `ngrok http 3000`, puis vous devrez copier/coller l’URL généré par ngrok dans la variable BASE_URL dans le fichier /mobile/global.js.
