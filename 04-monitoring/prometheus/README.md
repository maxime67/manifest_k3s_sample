# Déploiement Prometheus + Grafana Simple sur K3s

Déploiement minimal de Prometheus et Grafana pour monitorer votre cluster K3s.

## 📦 Déploiement

```bash
kubectl apply -f prometheus-simple.yaml
```

## ✅ Vérification

```bash
# Vérifier les pods
kubectl get pods -n monitoring

# Vérifier les services  
kubectl get svc -n monitoring
```

## 🌐 Accès

```bash
# Récupérer l'IP du nœud
kubectl get nodes -o wide

# Accéder à Prometheus
http://NODE_IP:30090

# Accéder à Grafana
http://NODE_IP:30030
```

## 🔐 Connexion Grafana

- **URL** : `http://NODE_IP:30030`
- **Username** : `admin`
- **Password** : `admin`

## 📊 Configuration Grafana

1. Connectez-vous à Grafana
2. Ajoutez Prometheus comme source de données :
    - **URL** : `http://prometheus-service:9090`
    - **Access** : Server (Default)
3. Importez des dashboards depuis grafana.com (ex: dashboard ID `7249` pour Kubernetes)

## 🧹 Suppression

```bash
kubectl delete -f prometheus-simple.yaml
```