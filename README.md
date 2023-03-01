# PolySign - Feuille de présence basée sur l’IoT
## TER041

Notre solution permet de gérer une feuille de présence digitalisée. Elle est destinée à un usage universitaire/scolaire afin de simplifier la gestion des présences pour les professeurs.

Elle repose sur l’utilisation du NFC pour le partage de la feuille digitale, des smartphones des professeurs et étudiants via notre application mobile, et d’une logique serveur pour automatiser les traitements.

Notre procédé fonctionne comme suit : Dans la salle équipée d’un tag NFC, le professeur va s’identifier en tant que tel sur son application. Il va pouvoir sélectionner un de ses cours pour générer la feuille d’émargement grâce au serveur. Il va écrire cette feuille sur le tag NFC, qui circulera d’étudiant en étudiant pour qu’ils puissent la lire. 

Chaque étudiant va pouvoir, en s’identifiant sur l’application, apposer sa signature et la mettre à jour sur le tag NFC.
Une fois la feuille complétée par tous les étudiants présents, le professeur la récupère en scannant le tag NFC. Le professeur aura un aperçu des présences et absences, et aura la main pour modifier l’état des présences et absences si des rectifications sont à faire (par exemple s’il y a un échec de lecture/écriture d’un élève sur le tag NFC). Il pourra finalement signer la feuille à son tour et clôturer l’émargement.

