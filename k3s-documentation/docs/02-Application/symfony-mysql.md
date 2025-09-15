---
sidebar_label: 'Symfony + MySQL'
sidebar_position: 1
---
import GitHubChart from '@site/src/components/GitHubChart';

# Application Symfony avec Base MySQL

Ce projet contient un Chart permettant de déployer une application Symfony avec base de données MySQL dans un cluster Kubernetes.

## 📂 Contenu du projet

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="02-application/symfony-mysql"
files={[
'Chart.yaml',
'values.yaml',
'templates/deployment.yaml',
'templates/job.yaml',
'templates/pvc.yaml',
'templates/secret.yaml',
'templates/service.yaml',
]}
/>

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé

## 📦 Déploiement

1. Une application ArgoCD te permet de déployer l'application:

```bash
kubectl apply -f 02-application/spring-boot/argocd/argocd-spring-boot.yaml
```


2. Vérifie que les pods sont bien créés :
   ```bash
   kubectl get pods
   kubectl get services
   kubectl logs deployment/symfony-app
   ```

3. Accès à l'application :
   ```bash
   # Application accessible sur :
   http://<NODE_IP>:<SERVICE_EXTERNAL_IP>
   ```

## 🔍 Fonctionnalités

### **Gestion des Secrets**
- Variables d'environnement configurées via un Secrets Kubernetes
- Configuration DATABASE_URL automatique

### **Init Containers**
- Attente de disponibilité MySQL avant démarrage Symfony
- Vérification de la connectivité base de données

### **Job de Migration**
- Exécution automatique des migrations Doctrine

### **Health Checks**
- **Liveness Probe** : Vérification que l'application fonctionne
- **Readiness Probe** : Vérification que l'application est prête à recevoir du trafic
- Endpoint : `/article` sur port 80

### **Persistance**
- PVC MySQL pour conservation des données

## 🧪 Tests et validation

### Test de l'application
```bash
# Test direct
curl http://<NODE_IP>:<SERVICE_EXTERNAL_IP>/article

# Vérification des logs
kubectl logs deployment/symfony-app
kubectl logs deployment/mysql-app
```

### Test de persistance MySQL
```bash
# Connexion à MySQL
kubectl exec -it <mysql-pod> -- mysql -u root -p

# Vérifier les tables créées par Symfony
SHOW DATABASES;
USE symfony_db;
SHOW TABLES;
```

## 📌 Configuration

### **Images utilisées**
- **Symfony** : `maxxa/k3s:latest` - Application Symfony personnalisée
- **MySQL** : `mysql:latest` - Base de données MySQL officielle

### **Ports et Services**
- **Symfony** : NodePort (80 → 8080)
- **MySQL** : ClusterIP 3306 (interne uniquement)

### **Variables d'environnement**
Configurées via Secrets Kubernetes :
- `DATABASE_URL` : Chaîne de connexion MySQL
- `APP_SECRET` : Clé secrète Symfony
- `MYSQL_ROOT_PASSWORD` : Mot de passe root MySQL

## ⚠️ Notes importantes

- **Stockage** : K3s utilise `local-path` par défaut pour les PVC