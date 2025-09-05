# Déploiement Nginx sur Kubernetes
Ce projet contient un fichier YAML permettant de déployer un serveur Nginx minimal (basé sur l’image nginx:alpine) dans un cluster Kubernetes.

Le déploiement crée 2 réplicas

📂 Contenu du projet 
Contient la définition du déploiement Kubernetes avec :

<li>2 pods Nginx</li>

<li>La configuration des containers et du port exposé </li>

<li>Un service "NodePort" permettant d'exposer les pods à partir de l'ip du master </li>

🚀 Prérequis
Avant d’utiliser ce projet, assure-toi d’avoir :

<li>Un cluster K3s fonctionnel</li>

<li>kubectl installé</li>

📦 Déploiement
Clone ou copie ce projet sur ta machine.

Applique le manifeste Kubernetes avec la commande : 
<code> kubectl apply -f nginx.yaml </code> 

Vérifie que les pods sont bien créés :
<code> kubectl get pods </code>

