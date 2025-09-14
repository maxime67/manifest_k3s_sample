---
sidebar_label: 'Introduction aux Services'
sidebar_position: 0
---

# Services Kubernetes - Exemples et Concepts

Ce dossier contient des exemples pratiques des différents types de Services Kubernetes, illustrant comment exposer et accéder aux applications dans un cluster K3s.

## 🎯 Objectifs d'apprentissage

- Comprendre les différents types de Services Kubernetes
- Maîtriser l'exposition des applications selon différents cas d'usage
- Apprendre les bonnes pratiques de configuration réseau
- Tester les différentes méthodes d'accès aux services

## 📁 Contenu du dossier

### **ClusterIP** - Service interne
- **Chemin** : `03-services/clusterIP/`
- **Usage** : Communication interne entre services
- **Accès** : Uniquement depuis l'intérieur du cluster
- **Cas d'usage** : Bases de données, APIs internes, microservices

### **NodePort** - Exposition via les nœuds
- **Chemin** : `03-services/nodePort/`
- **Usage** : Exposition simple vers l'extérieur
- **Accès** : Via `<NodeIP>:<NodePort>`
- **Cas d'usage** : Développement, tests, applications simples

## 🔍 Types de Services Kubernetes

### 1. **ClusterIP** (Par défaut)
```yaml
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 80
```
- **Portée** : Interne au cluster uniquement
- **Sécurité** : ⭐⭐⭐⭐⭐ (Maximum)
- **Usage** : Services backend, bases de données

### 2. **NodePort**
```yaml
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
```
- **Portée** : Exposition sur tous les nœuds
- **Sécurité** : ⭐⭐⭐ (Modérée)
- **Usage** : Applications web simples, développement

### 3. **LoadBalancer** (Cloud)
```yaml
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 80
```
- **Portée** : Exposition via Load Balancer cloud
- **Sécurité** : ⭐⭐⭐⭐ (Élevée avec configuration)
- **Usage** : Production, applications critiques

## 🧪 Tests et validation

### Vérification des services
```bash
# Lister tous les services
kubectl get services

# Détails d'un service spécifique
kubectl describe service <service-name>

# Tester la connectivité interne
kubectl exec -it <pod-name> -- curl <service-name>:<port>
```

### Tests de charge
```bash
# Test simple avec Apache Bench
ab -n 1000 -c 10 http://<external-ip>/

# Test avec curl en boucle
for i in {1..100}; do curl -s http://<service-ip> > /dev/null; done
```

## 🛡️ Sécurité par Type de Service

### ClusterIP (Niveau de sécurité : ⭐⭐⭐⭐⭐)
- Pas d'exposition externe
- Communication chiffrée possible (TLS mutuel)
- Policies réseau applicables
- Isolation par namespace

### NodePort (Niveau de sécurité : ⭐⭐⭐)
- Exposition sur tous les nœuds
- Nécessite firewall externe
- Pas de SSL natif
- Port range limité

### LoadBalancer (Niveau de sécurité : ⭐⭐⭐⭐)
- Exposition contrôlée par le cloud
- SSL/TLS termination possible
- DDoS protection (cloud)
- WAF intégrable

## 🚀 Déploiement rapide

### Test ClusterIP
```bash
cd 03-services/clusterIP/
kubectl apply -f nginx-clusterip.yml
kubectl get services
```

### Test NodePort
```bash
cd 03-services/nodePort/
kubectl apply -f nginx-nodeport.yml
kubectl get services
# Accès via http://<NODE_IP>:<NODEPORT>
```

## 📚 Concepts avancés

### **Service Discovery**
- DNS interne Kubernetes (`<service-name>.<namespace>.svc.cluster.local`)
- Variables d'environnement automatiques
- Endpoints et EndpointSlices

### **Session Affinity**
```yaml
spec:
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
```

### **Load Balancing**
- Round-robin par défaut
- Session affinity configurable
- Health checks automatiques

## 🧹 Nettoyage

```bash
# Supprimer tous les exemples
kubectl delete -f 03-services/clusterIP/nginx-clusterip.yml
kubectl delete -f 03-services/nodePort/nginx-nodeport.yml

# Vérifier le nettoyage
kubectl get services
kubectl get pods
```

## 📖 Ressources pour aller plus loin

- [Documentation officielle Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Guide des Load Balancers cloud](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)
- [Ingress Controllers vs LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/ingress/)

---

*Ces exemples couvrent les aspects fondamentaux des Services Kubernetes. Pour des configurations avancées en production, consulte la documentation spécifique à ton environnement cloud.*