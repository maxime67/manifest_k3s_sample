---
sidebar_label: 'Simple PostgreSQL'
sidebar_position: 2
description: "Déploiement d'un pod PostgreSQL simple"
tags: ['PostgreSQL', 'pod', 'simple']
---
import GitHubChart from '@site/src/components/GitHubChart';

# Déploiement d'un pod PostgreSql simple
## 🔍 Aperçu

- Déploiement d'un pod PostgreSql simple
- Déploie un service permettant d'exposer le pod au sein du cluster
- Utilise les secrets Kubernetes pour stocker des données

### Caractéristiques clés
- ✅ **PostgreSql** : Permet de déployer un serveur PostgreSql vide avec une configuration par défaut
- ✅ **Exposition** : Permet d'exposer le pod au sein du cluster (peut être accessible depuis l'ip du node en fonction de la configuration)
- ⚠️ **Limitation** : Les secrets sont stockées dans des variables définies dans ```values.yaml```, privilégiez un externalSecret
- ⚠️ **Limitation** : Les données ne sont pas persistées au redémarage du pod

## 🔍 Caractéristiques
- **Image** : `postgres:15`
- **Service** : ClusterIP (accessible uniquement depuis l'intérieur du cluster)

## 📂 Contenu du projet

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="01-basics/postgresql"
files={[
'Chart.yaml',
'values.yaml',
'templates/deployment.yaml',
'templates/secret.yaml',
'templates/service.yaml',
]}
/>

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé

## Mise en place

Une application ArgoCD te permet de déployer l'application:

```bash
kubectl apply -f 01-basics/postgresql/argocd/argocd-postgre_memory.yaml
```

## 🧪 Test de non persitance

Pour vérifier la non persistance des données :

```bash
# Créer des données de test
kubectl exec -it <postgres-pod> -n postgresql-persistent -- psql -U postgres
CREATE TABLE test_cluster (id SERIAL PRIMARY KEY, data TEXT);
INSERT INTO test_cluster (data) VALUES ('test1'), ('test2');

# Supprimer le pod
kubectl delete pod <postgres-pod> -n postgresql-persistent

# Vérifier que les données sont absentes
kubectl exec -it <new-postgres-pod> -n postgresql-persistent -- psql -U postgres
SELECT * FROM test_cluster; # Les données doivent être présentes
```

## ⚠️ Limitations

- Les données sont perdues au redémarrage du pod
- Pas de sauvegarde automatique