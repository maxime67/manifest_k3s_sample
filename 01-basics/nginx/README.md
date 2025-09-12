<h1>Déploiement Nginx sur Kubernetes</h1>
Ce projet contient un Chart permettant de déployer un serveur Nginx minimal (basé sur l’image nginx:alpine) dans un cluster Kubernetes.

Le déploiement crée 2 réplicas

📂 Contenu du projet <br>
Contient la définition du déploiement Kubernetes avec :

<li>2 pods Nginx</li>

<li>La configuration des containers et du port exposé </li>

<li>Un service "NodePort" permettant d'exposer les pods à partir de l'ip du master </li>

🚀 Prérequis<br>
Avant d’utiliser ce projet, assure-toi d’avoir :

<li>Un cluster K3s fonctionnel</li>

<li>kubectl installé</li>

📦 Déploiement<br>
Clone ou copie ce projet sur ta machine.

Applique le manifeste Kubernetes avec la commande : <br>
<code> kubectl apply -f nginx.yaml </code> <br>

Vérifie que les pods sont bien créés : <br>
<code> kubectl get pods </code>

