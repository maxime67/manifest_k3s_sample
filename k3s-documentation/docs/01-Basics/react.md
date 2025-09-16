---
sidebar_label: 'Simple React'
sidebar_position: 4
description: "Déploiement d'un pod contenant une application React"
tags: ['Nginx', 'pod', 'simple', 'react']
---

import GitHubChart from '@site/src/components/GitHubChart';


# Déploiement d'un pod React simple
## 🔍 Aperçu

- Déploiement d'un pod Nginx simple contenant une application React
- Déploie un service nodePort permettant d'exposer le pod à l'exterieur du cluster

### Caractéristiques clés

- ✅ **Nginx** : Permet de déployer un serveur nginx contenant une application React
- ✅ **Exposition** : Permet d'exposer le pod à l'exterieur du cluster, accessible depuis l'ip du node
- ✅ **Probe** : Configure des probes permettant de configurer l'état de santé du pod

## 🔍 Caractéristiques

- **Image** : `maxxa/reacttest:latest`
- **Service** : NodePort (accessible  depuis l'ip du node, tous les nodes par défaut expose le service sur k3s).
- **livenessProbe** : Probe permettant de redémarrer le pod en cas de problème.
- **readinessProbe** : Probe permettant de définir à partir de quel moment le pod est en mesure de recevoir du traffic.

## 📂 Contenu du projet

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="01-basics/react"
files={[
'Chart.yaml',
'values.yaml',
'templates/deployment.yaml',
'templates/service.yaml',
]}
/>

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé

## Mise en place

1. Une application ArgoCD te permet de déployer l'application:

```bash
kubectl apply -f 01-basics/postgresql/argocd/argocd-postgre_memory.yaml
```

2. Vérifie la création des pods:
```bash
kubectl get pod -n react
```

## 📌 Notes

Ce déploiement ne crée pas de service exposé à l'extérieur du cluster.
Par défaut Treafik, installé avec k3s, permet d'accéder à nos pods depuis l'ip du master
Donc le nginx est accessible par l'IP du master