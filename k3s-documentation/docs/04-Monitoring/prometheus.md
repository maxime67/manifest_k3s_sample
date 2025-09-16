---
sidebar_label: 'Prometheus + Grafana'
sidebar_position: 1
description: "Déploiement d'une stack d'observabilité prometheus et grafana"
tags: ['observability', 'serviceAccount', 'cluterRole']
---

import GitHubChart from '@site/src/components/GitHubChart';

# Stack d'Observabilité : Prometheus + Grafana

## 🔍 Aperçu

- Déploiement d'une stack d'observabilité prometheus et grafana
- Déploie deux services nodePort permettant d'exposer prometheus et grafana à l'exterieur du cluster
- Crée un clusterRole et un serviceAccount permettant à prometheus de récupérer des métriques depuis l'API Kubernetes
- Déploie deux PVC permettant de persister les données et la configuration, à la fois de prometheus et de Grafana
- Déploie un NodeExporter Prometheus sur tous les nodes du cluster afin de remonter des métriques par nodes
- Utilise une configMap permettant de stocker la configuration Prometheus

### Caractéristiques clés

- ✅ **Prometheus** : Permet de récolter et stocker des métriques consernant l'ensemble du cluster
- ✅ **Grafana** : Permet de consomer les données exposées par Prometheus afin de créer entre autres des DashBoard
- ✅ **NodeExporter** : Composant Prometheus permettant de remonter des métriques systèmes
- ✅ **PVC** : Les données de prometheus et de grafana sont persistées

## 🔍 Caractéristiques

- **Image** : `prom/prometheus:latest` `prom/node-exporter:latest` `grafana/grafana:latest`
- **Service** : NodePort (accessible  depuis l'ip du node, tous les nodes par défaut expose le service sur k3s).
- **livenessProbe** : Probe permettant de redémarrer le pod en cas de problème.
- **readinessProbe** : Probe permettant de définir à partir de quel moment le pod est en mesure de recevoir du traffic.

## 📂 Contenu du projet

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="04-monitoring/prometheus"
files={[
'Chart.yaml',
'values.yaml',
'templates/ClusterRole.yaml',
'templates/ClusterRoleBinding.yaml',
'templates/ConfigMap.yaml',
'templates/DaemonSet.yaml',
'templates/Deployment.yaml',
'templates/Namespace.yaml',
'templates/pvc.yaml',
'templates/secret.yaml',
'templates/service.yaml',
'templates/serviceAccount.yaml',
]}
/>

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé
- StorageClass disponible pour les PVC

## 📦 Déploiement

1. Une application ArgoCD te permet de déployer l'application:

```bash
kubectl apply -f 04-monitoring/prometheus/argocd/argocd-monitoring.yaml
```

2. Vérifie que les pods sont bien créés :
   ```bash
   kubectl get pods -n prometheus
   kubectl get services -n prometheus
   ```

3. Accès aux interfaces :
   ```bash
   # Prometheus
   http://<NODE_IP>:<PROMETHEUS_NODEPORT>
   
   # Grafana
   http://<NODE_IP>:<GRAFANA_NODEPORT>
   # Login: admin / admin
   ```

## 🔍 Architecture

### **Prometheus**
- **Rôle** : Collecte, stockage et interrogation des métriques
- **Port** : 9090 (interne), NodePort (externe)
- **Stockage** : PVC pour persistance des données
- **Configuration** : ConfigMap avec `prometheus.yml`

### **Grafana**
- **Rôle** : Visualisation et création de dashboards
- **Port** : 3000 (interne), NodePort (externe)
- **Stockage** : PVC pour persistance des dashBoard
- **Authentification** : admin/admin (par défaut)

### **DaemonSet - NodeExporter**
- **Rôle** : Assure la présence d'un agent de collecte sur chaque nœud
- **Fonction** : Remontée des métriques système et applicatives
- **Couverture** : Tous les nœuds du cluster
- **Spécificité** : Chaque noeud héberge strictement un pod
- **Comportement par défaut** : 

   -  1 pod par nœud, automatiquement
   - Si un nouveau nœud rejoint le cluster, un pod y est automatiquement créé
   - Si un nœud est supprimé, le pod correspondant est supprimé
   - Si un pod crash, il est automatiquement recréé sur le même nœud

## ⚙️ Configuration

### **Service Account et RBAC**
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - apiGroups: [""]
    resources: ["nodes", "pods", "services", "endpoints"]
    verbs: ["get", "list", "watch"]
```

### **ConfigMap Prometheus**
Configuration des targets et règles de collecte :
- Métriques Kubernetes (API server, kubelet, pods)
- Métriques système (CPU, mémoire, réseau)
- Métriques applicatives (endpoints `/metrics`)

### **Stockage Persistant**
- **Prometheus** : PVC pour les séries temporelles
- **Grafana** : PVC pour les dashboards et configurations

## 🎯 Métriques collectées

### **Métriques Cluster**
- Utilisation CPU/Mémoire des nœuds
- État des pods et services
- Métriques réseau
- Stockage et volumes

### **Métriques Applicatives**
- Métriques custom des applications
- Health checks et temps de réponse

### **Métriques Système**
- Charge système
- I/O disque et réseau
- Processus

## 📊 Configuration Grafana

### **Ajout de Prometheus comme Data Source**
1. Connecte-toi à Grafana (`admin/admin`)
2. Settings → Data Sources → Add Data Source
3. Sélectionne "Prometheus"
4. URL : `http://prometheus-service:9090`
5. Save & Test

### **Dashboards recommandés**
- **Kubernetes Cluster Overview** : Vue d'ensemble du cluster
- **Node Exporter Full** : Métriques détaillées des nœuds
- **Kubernetes Pods** : Monitoring des pods
- **Application Metrics** : Métriques custom

## 🧪 Tests et validation

### Test de collecte Prometheus
```bash
# Vérifier les targets Prometheus
curl http://<NODE_IP>:<PROMETHEUS_PORT>/targets

# Query simple
curl http://<NODE_IP>:<PROMETHEUS_PORT>/api/v1/query?query=up
```

### Test Grafana
```bash
# Vérifier l'accès
curl http://<NODE_IP>:<GRAFANA_PORT>/api/health

# Login programmatique
curl -X POST http://<NODE_IP>:<GRAFANA_PORT>/api/auth/keys \
  -H "Content-Type: application/json" \
  -u admin:admin
```

## 🔧 Troubleshooting

### Prometheus ne collecte pas
```bash
# Vérifier les logs
kubectl logs deployment/prometheus -n prometheus

# Vérifier la configuration
kubectl get configmap prometheus-config -n prometheus -o yaml

# Tester les permissions RBAC
kubectl auth can-i get nodes --as=system:serviceaccount:default:prometheus
```

### Grafana ne démarre pas
```bash
# Vérifier les logs
kubectl logs deployment/grafana -n prometheus

# Vérifier les PVC
kubectl get pvc -n prometheus

# Permissions sur le volume
kubectl exec -it <grafana-pod> -n prometheus -- ls -la /var/lib/grafana
```

## 🧹 Nettoyage

```bash
# Supprimer la stack complète
kubectl delete -f 04-monitoring/prometheus/argocd/argocd-monitoring.yaml

# Vérifier la suppression
kubectl get pods -n prometheus
kubectl get pvc -n prometheus
```

## 📚 Ressources utiles

- [Documentation Prometheus](https://prometheus.io/docs/)
- [Documentation Grafana](https://grafana.com/docs/)
- [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)
- [Dashboards Grafana communautaires](https://grafana.com/grafana/dashboards/)

---

*Cette stack fournit une base solide pour l'observabilité de votre cluster K3s. Adaptez les configurations selon vos besoins spécifiques.*