---
title: "PostgreSQL (Mémoire)"
description: "Guide de déploiement PostgreSQL (Mémoire)"
weight: 20
cascade:
  - type: "docs"
---


> **💡 Info**
**Configuration disponible :**
- [Voir les fichiers YAML](/files/)
- [Repository GitHub](https://github.com/maxime67/manifest_k3s_sample)


# Déploiement PostgreSQL sur Kubernetes
Ce projet contient un fichier YAML permettant de déployer un serveur PostgreSQL minimal (basé sur l’image postgres:15) dans un cluster Kubernetes.

Le déploiement crée 1 pod et expose le port 5432 pour le trafic TCP.

📂 Contenu du projet 

Contient la définition du déploiement Kubernetes avec :

- 1 <i>pods</i> PostgreSQL

- Un sélecteur de labels 

- La configuration des containers et du port exposé 

- Un <i>Service</i> permettant d'exposer le service PostgreSQL aux autres pods du cluster Kube

🚀 Prérequis

Avant d’utiliser ce projet, assure-toi d’avoir :

- Un cluster K3s fonctionnel

- kubectl installé

📦 Déploiement

Clone ou copie ce projet sur ta machine.

Applique le manifeste Kubernetes avec la commande : 

` kubectl apply -f postgresql.yaml ` 


Vérifie que le pod est bien créés : 

` kubectl get pods `

Connecte toi au pod : 

`kubectl exec -it <nom-pod-principal> -- psql -U postgres`

Dans le pod tu peux vérifier le bon fonctionnement du postgres en lecture 

`\l`

`\dt`

`SELECT version();`

Vérifier le bon fonctionnement des actions d'écritures: 

` CREATE TABLE test_cluster (id SERIAL PRIMARY KEY, data TEXT); `

` INSERT INTO test_cluster (data) VALUES ('test1'), ('test2'); `

` SELECT * FROM test_cluster; `


Puis on valide la non persistance des données :

En supprimant le pod actuellement running

` kubectl delete pod <nom-pod-principal>`

Un nouveau pod est automatiquement crée pour respecter le nombre de replicas demandé

On se connecte à ce nouveau pod

`kubectl exec -it <nom-nouveau-pod-principal> -- psql -U postgres`

On accède en lecture aux données précédement insérées

` SELECT * FROM test_cluster; `


On observe l'absence de la table test_cluster car le pod n'est pas rattaché à un volume persistant


📌 Notes 

Un service est déployé parralèlement au pods, ce mécanisme permet d'exposer la base de données aux autres pods la consomant.

Seul les pods du cluster Kube y ont accès.