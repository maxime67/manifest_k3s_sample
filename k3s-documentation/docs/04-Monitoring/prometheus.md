---
sidebar_label: 'Prometheus + Grafana'
sidebar_position: 1
---

# Stack d'Observabilité : Prometheus + Grafana

Ce projet contient un exemple de déploiement d'une stack complète d'observabilité avec Prometheus et Grafana sur un cluster Kubernetes.

## 📂 Contenu du projet

Contient la définition du déploiement Kubernetes avec :

- **Prometheus** : `prom/prometheus:latest` - Collecte et stockage des métriques
- **Grafana** : `grafana/grafana:latest` - Visualisation et dashboards
- **DaemonSet** : Collecte de métriques sur tous les nœuds
- **ConfigMap** : Configuration `prometheus.yml`
- **Service Account** : Gestion des permissions RBAC
- **Services NodePort** : Exposition des interfaces web

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé
- StorageClass disponible pour les PVC

## 📦 Déploiement

1. Applique le manifeste Kubernetes avec la commande :
   ```bash
   kubectl apply -f prometheus-grafana.yml
   ```

2. Vérifie que les pods sont bien créés :
   ```bash
   kubectl get pods
   kubectl get services
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
- **Stockage** : PVC pour persistance des configurations
- **Authentification** : admin/admin (par défaut)

### **DaemonSet**
- **Rôle** : Assure la présence d'un agent de collecte sur chaque nœud
- **Fonction** : Remontée des métriques système et applicatives
- **Couverture** : Tous les nœuds du cluster

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
- Métriques business

### **Métriques Système**
- Charge système
- I/O disque et réseau
- Processus et file descriptors

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
kubectl logs deployment/prometheus

# Vérifier la configuration
kubectl get configmap prometheus-config -o yaml

# Tester les permissions RBAC
kubectl auth can-i get nodes --as=system:serviceaccount:default:prometheus
```

### Grafana ne démarre pas
```bash
# Vérifier les logs
kubectl logs deployment/grafana

# Vérifier les PVC
kubectl get pvc

# Permissions sur le volume
kubectl exec -it <grafana-pod> -- ls -la /var/lib/grafana
```

## 📈 Alerting (Optionnel)

### Configuration Alertmanager
```yaml
# Ajouter à prometheus.yml
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

### Règles d'alerte exemple
```yaml
groups:
  - name: k3s-alerts
    rules:
      - alert: HighCPUUsage
        expr: cpu_usage > 80
        for: 5m
        annotations:
          summary: "High CPU usage detected"
```

## 🧹 Nettoyage

```bash
# Supprimer la stack complète
kubectl delete -f prometheus-grafana.yml

# Vérifier la suppression
kubectl get pods
kubectl get pvc
```

## 📚 Ressources utiles

- [Documentation Prometheus](https://prometheus.io/docs/)
- [Documentation Grafana](https://grafana.com/docs/)
- [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)
- [Dashboards Grafana communautaires](https://grafana.com/grafana/dashboards/)

---

*Cette stack fournit une base solide pour l'observabilité de votre cluster K3s. Adaptez les configurations selon vos besoins spécifiques.*