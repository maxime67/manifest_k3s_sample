<h1>Déploiement Nginx sur Kubernetes</h1>
Ce projet contient un fichier YAML permettant de déployer un serveur Nginx contenant un projet react minimal (basé sur l’image nginx:stable-alpine) dans un cluster Kubernetes.

Le déploiement crée 2 réplicas

📂 Contenu du projet <br>
Contient la définition du déploiement Kubernetes avec :

<li>2 pods Nginx</li>

<li>La configuration des containers et du port exposé </li>

🚀 Prérequis<br>
Avant d’utiliser ce projet, assure-toi d’avoir :

<li>Un cluster K3s fonctionnel</li>

<li>kubectl installé</li>

📦 Déploiement<br>
Clone ou copie ce projet sur ta machine.

Applique le manifeste Kubernetes avec la commande : <br>
``` kubectl apply -f react.yaml ``` <br>

Vérifie que les pods sont bien créés : <br>
``` kubectl get pods ```

Récupère le port assigné:<br>
``` kubectl get logs ```
<img src="./images/img.png">

Accès au service:<br>
``` curl <MASTER_IP>:<PORT> ```<br>

📌 Notes <br>
Ce déploiement ne crée pas de service exposé à l’extérieur du cluster.
Par défaut Treafik, installé avec k3s, permet d'accéder à nos pods depuis l'ip du master
Donc le nginx est accessible par l'IP du master