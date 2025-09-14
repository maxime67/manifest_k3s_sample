---
title: "Guide des Services"
description: "Guide de déploiement Guide des Services"
weight: 10
cascade:
  - type: "docs"
---


{{< alert title="📁 Fichiers" >}}
**Configuration disponible :**
- [Voir les fichiers YAML](/files/)
- [Repository GitHub](https://github.com/maxime67/manifest_k3s_sample)
{{< /alert >}}

# Guide Complet des Services Kubernetes 🌐

Ce guide compare les trois types de services Kubernetes avec des exemples pratiques utilisant Nginx.

## 📋 Vue d'ensemble des Services

Les Services Kubernetes permettent d'exposer des applications et de gérer le trafic réseau. Chaque type répond à des besoins spécifiques.

## 🔄 Comparaison des Types de Services

| Aspect | ClusterIP | NodePort | LoadBalancer |
|--------|-----------|----------|--------------|
| **Accessibilité** | Interne uniquement | Interne + Externe | Interne + Externe optimisé |
| **IP d'accès** | IP virtuelle interne | IP des nœuds | IP publique |
| **Port** | Port interne | 30000-32767 | Port standard (80, 443) |
| **Complexité** | Simple | Modérée | Élevée |
| **Coût** | Gratuit | Gratuit | Payant (cloud) |
| **Cas d'usage** | Microservices internes | Développement, tests | Production, exposition publique |
| **Sécurité** | Très sécurisé | Modérément sécurisé | Sécurisé (selon config) |
| **Performance** | Optimale | Bonne | Très bonne |

## 🏗️ Architecture de chaque type

### ClusterIP
```
[Pod App] ←→ [ClusterIP Service] ←→ [Pod Database]
     ↑              ↑                     ↑
   Port 8080    Port 3306            Port 5432
   (interne)    (interne)            (interne)
```

### NodePort
```
Internet → [Node IP:30080] → [NodePort Service] → [Pods]
  ↑              ↑                 ↑               ↑
Utilisateur   Port public    Load balancer   Applications
              (30000+)        interne        (Port 80)
```

### LoadBalancer
```
Internet → [Load Balancer IP] → [K8s LoadBalancer] → [Pods]
  ↑             ↑                    ↑                ↑
Utilisateur  IP publique      Service Kubernetes  Applications
            (Cloud/MetalLB)    (Port 80/443)      (Port 80)
```

## 📂 Structure des Projets

```
01-basics/
├── nginx-clusterip/
│   ├── README.md                    # Guide détaillé ClusterIP
│   └── nginx-clusterip.yaml         # Manifest ClusterIP
├── nginx-nodeport/
│   ├── README.md                    # Guide détaillé NodePort
│   └── nginx-nodeport.yaml          # Manifest NodePort
└── nginx-loadbalancer/
    ├── README.md                    # Guide détaillé LoadBalancer
    └── nginx-loadbalancer.yaml      # Manifest LoadBalancer
```

## 🚀 Déploiement Rapide

### 1. ClusterIP (Service interne)
```bash
cd 01-basics/nginx-clusterip/
kubectl apply -f nginx-clusterip.yaml

# Test depuis l'intérieur du cluster
kubectl run test --image=busybox --rm -it -- wget -qO- http://nginx-clusterip-service
```

### 2. NodePort (Accès via IP des nœuds)
```bash
cd 01-basics/nginx-nodeport/
kubectl apply -f nginx-nodeport.yaml

# Récupérer l'IP et le port
kubectl get svc nginx-nodeport-service
curl http://NODE_IP:NODE_PORT
```

### 3. LoadBalancer (IP publique)
```bash
cd 01-basics/nginx-loadbalancer/
kubectl apply -f nginx-loadbalancer.yaml

# Attendre l'IP externe
kubectl get svc nginx-loadbalancer-service -w
curl http://EXTERNAL_IP
```

## 🎯 Choix du Bon Service

### Utilise ClusterIP quand :
- ✅ Communication entre microservices
- ✅ Bases de données internes
- ✅ APIs internes non exposées
- ✅ Services de cache (Redis, Memcached)
- ✅ Sécurité maximale requise

### Utilise NodePort quand :
- ✅ Développement et tests
- ✅ Environnements de staging
- ✅ Applications internes avec accès externe occasionnel
- ✅ Pas de load balancer externe disponible
- ✅ Démonstrations et prototypes

### Utilise LoadBalancer quand :
- ✅ Applications web en production
- ✅ APIs publiques REST/GraphQL
- ✅ Sites web avec trafic important
- ✅ Applications e-commerce
- ✅ Services nécessitant SSL/TLS

## 🌐 Scénarios d'Usage Concrets

### Scénario 1 : Architecture Microservices
```yaml
# Frontend (LoadBalancer)
Frontend Web → LoadBalancer:80 → [Pods Web]

# API Gateway (ClusterIP)  
[Pods Web] → ClusterIP:8080 → [Pods API Gateway]

# Services Backend (ClusterIP)
[API Gateway] → ClusterIP:3000 → [Pods User Service]
[API Gateway] → ClusterIP:3001 → [Pods Order Service]

# Base de données (ClusterIP)
[Services] → ClusterIP:5432 → [PostgreSQL Pod]
```

### Scénario 2 : Application 3-Tiers
```yaml
# Tier 1: Load Balancer pour le frontend
React App → LoadBalancer:80 → [Nginx + React Pods]

# Tier 2: ClusterIP pour l'API  
[React] → ClusterIP:3000 → [Node.js API Pods]

# Tier 3: ClusterIP pour la base
[API] → ClusterIP:27017 → [MongoDB Pod]
```

### Scénario 3 : Environnement de Développement
```yaml
# Services de dev (NodePort pour accès facile)
Dev Frontend → NodePort:30080 → [Dev Pods]
Dev API → NodePort:30081 → [Dev API Pods]
Monitoring → NodePort:30082 → [Grafana Pod]
```

## 🔧 Configuration Avancée par Type

### ClusterIP avec DNS personnalisé
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-internal
  namespace: production
spec:
  type: ClusterIP
  clusterIP: 10.43.100.100  # IP fixe (optionnel)
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
# Accessible via : my-app-internal.production.svc.cluster.local
```

### NodePort avec port fixe
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-external
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30080      # Port fixe 30080 sur tous les nœuds
```

### LoadBalancer avec SSL
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-public
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:..."
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "http"
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - port: 443
      targetPort: 80
      name: https
    - port: 80
      targetPort: 80  
      name: http
```

## 🔍 Monitoring et Debugging

### Commandes de diagnostic communes
```bash
# État des services
kubectl get svc

# Détails d'un service
kubectl describe svc <service-name>

# Endpoints associés
kubectl get endpoints <service-name>

# Test de connectivité interne
kubectl run debug --image=busybox --rm -it -- sh

# Logs des controllers de service
kubectl logs -n kube-system -l app=servicelb  # K3s
```

### Tests de charge et performance
```bash
# Test de charge simple avec Apache Bench
ab -n 1000 -c 10 http://EXTERNAL_IP/

# Test avec curl en boucle
for i in {1..100}; do curl -s http://SERVICE_IP > /dev/null; done

# Monitoring des métriques
kubectl top pods
kubectl top nodes
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

## 🧹 Nettoyage Complet

```bash
# Supprimer tous les exemples
kubectl delete -f 01-basics/nginx-clusterip/nginx-clusterip.yaml
kubectl delete -f 01-basics/nginx-nodeport/nginx-nodeport.yaml  
kubectl delete -f 01-basics/nginx-loadbalancer/nginx-loadbalancer.yaml

# Vérifier le nettoyage
kubectl get svc
kubectl get pods
```

## 📚 Ressources pour Aller Plus Loin

- [Documentation officielle Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Guide des Load Balancers cloud](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)
- [Configuration MetalLB](https://metallb.universe.tf/configuration/)
- [Ingress Controllers vs LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/ingress/)

---

*Ces exemples couvrent les aspects fondamentaux des Services Kubernetes. Pour des configurations avancées en production, consulte la documentation spécifique à ton environnement cloud.*