---
sidebar_label: 'Readiness Probe'
sidebar_position: 2
description: "Configuration et utilisation des Readiness Probes avec des pods Nginx"
tags: ['kubernetes', 'probes', 'readiness', 'nginx', 'traffic-routing']
---

import GitHubChart from '@site/src/components/GitHubChart';

# Readiness Probe : Gestion du trafic et de la disponibilité

## 🔍 Aperçu

- Configuration des Readiness Probes pour contrôler le routage du trafic vers les pods Nginx
- Gestion intelligente du trafic lors des déploiements et mises à jour
- Trois types de probes : HTTP, TCP et Command
- Intégration avec les Services et Load Balancers Kubernetes
- Démonstration des déploiements sans interruption (rolling updates)

### Caractéristiques clés

- ✅ **Traffic Control** : Empêche l'envoi de trafic vers les pods non prêts
- ✅ **Rolling Updates** : Déploiements sans interruption de service
- ✅ **Service Discovery** : Intégration automatique avec les endpoints Kubernetes
- ✅ **Load Balancing** : Distribution intelligente de la charge

## 🔍 Caractéristiques

- **Image** : `nginx:alpine`
- **Service** : LoadBalancer pour démonstration du routage
- **readinessProbe** : Différents types de probes configurables
- **Strategy** : RollingUpdate avec contrôle fin

## 📂 Contenu du projet

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="05-probes/readliness"
files={[
'livenessProbe.yaml',
]}
/>

## 🚀 Prérequis

Avant d'utiliser ce projet, assure-toi d'avoir :

- Un cluster K3s fonctionnel
- kubectl installé
- Un Load Balancer disponible (MetalLB, Traefik, etc.)
- Accès au cluster pour créer des ressources

## 📦 Déploiement

1. Déploie les exemples de Readiness Probes :

```bash
# Déploiement via ArgoCD
kubectl apply -f 05-probes/readiness/argocd/argocd-readiness.yaml

# Ou déploiement direct avec Helm
helm install readiness-demo 05-probes/readiness/
```

2. Vérifie le déploiement :
   ```bash
   kubectl get pods -n probes-demo
   kubectl get endpoints -n probes-demo
   kubectl describe service nginx-readiness -n probes-demo
   ```

3. Teste la disponibilité du service :
   ```bash
   kubectl get svc nginx-readiness -n probes-demo
   curl http://<SERVICE_IP>/
   ```

## 🔍 Types de Readiness Probes

### **HTTP Readiness Probe**
Vérification via requête HTTP GET pour s'assurer que l'application peut traiter les requêtes.

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 80
    httpHeaders:
    - name: X-Readiness-Check
      value: "true"
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
  successThreshold: 1
```

**Utilisation** :
- Services web REST/GraphQL
- Applications avec dépendances externes
- Microservices avec initialisation complexe

### **TCP Readiness Probe**
Vérification de l'acceptation des connexions TCP.

```yaml
readinessProbe:
  tcpSocket:
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3
```

**Utilisation** :
- Services TCP purs
- Bases de données
- Services de cache (Redis, Memcached)

### **Command Readiness Probe**
Exécution d'une commande pour vérifier l'état de préparation.

```yaml
readinessProbe:
  exec:
    command:
    - /bin/sh
    - -c
    - "nginx -t && curl -f http://localhost/health"
  initialDelaySeconds: 15
  periodSeconds: 10
  failureThreshold: 2
```

**Utilisation** :
- Vérifications complexes multi-étapes
- Applications avec logique métier spécifique
- Services nécessitant des validations internes

## ⚙️ Configuration détaillée

### **Exemple complet avec Nginx**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-with-readiness
  namespace: probes-demo
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      app: nginx-readiness
  template:
    metadata:
      labels:
        app: nginx-readiness
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
          name: http
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
          successThreshold: 1
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
        volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/conf.d
      volumes:
      - name: nginx-config
        configMap:
          name: nginx-config
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-readiness
  namespace: probes-demo
spec:
  selector:
    app: nginx-readiness
  ports:
  - name: http
    port: 80
    targetPort: 80
  type: LoadBalancer
```

### **Configuration avancée pour applications complexes**

```yaml
readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
    scheme: HTTP
  initialDelaySeconds: 20
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
  successThreshold: 2    # Plus strict pour les apps critiques
```

## 🎯 Différences avec Liveness Probe

| Aspect | Liveness Probe | Readiness Probe |
|--------|---------------|-----------------|
| **But** | Détecter les pods "morts" | Détecter les pods "non prêts" |
| **Action** | Redémarre le pod | Retire du endpoint du service |
| **Timing** | Plus conservateur | Plus réactif |
| **Échec** | Pod restart | Pas de trafic |
| **successThreshold** | Toujours 1 | Peut être > 1 |

## 🧪 Tests et validation

### **Vérifier l'état des endpoints**
```bash
# Lister les endpoints
kubectl get endpoints nginx-readiness -n probes-demo -o yaml

# Voir quels pods reçoivent du trafic
kubectl describe endpoints nginx-readiness -n probes-demo
```

### **Simuler une indisponibilité temporaire**
```bash
# Rendre un pod temporairement non prêt
kubectl exec -it <pod-name> -n probes-demo -- mv /usr/share/nginx/html/index.html /tmp/

# Observer la suppression de l'endpoint
kubectl get endpoints nginx-readiness -n probes-demo -w

# Restaurer la disponibilité
kubectl exec -it <pod-name> -n probes-demo -- mv /tmp/index.html /usr/share/nginx/html/
```

### **Tester les rolling updates**
```bash
# Lancer une mise à jour
kubectl set image deployment/nginx-readiness nginx=nginx:1.21-alpine -n probes-demo

# Observer le déploiement progressif
kubectl rollout status deployment/nginx-readiness -n probes-demo

# Vérifier que le service reste disponible
while true; do curl -s http://<SERVICE_IP>/ | head -1; sleep 1; done
```

## 🚀 Scénarios d'usage avancés

### **Application avec warm-up**
```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 30    # Temps de warm-up
  periodSeconds: 5
  timeoutSeconds: 3
  successThreshold: 3        # S'assurer de la stabilité
```

### **Base de données avec réplication**
```yaml
readinessProbe:
  exec:
    command:
    - /bin/bash
    - -c
    - |
      if [ "$(mysql -u root -p$MYSQL_ROOT_PASSWORD -e 'SELECT 1' 2>/dev/null)" ]; then
        if [ "$(mysql -u root -p$MYSQL_ROOT_PASSWORD -e 'SHOW SLAVE STATUS\G' | grep 'Seconds_Behind_Master: 0')" ]; then
          exit 0
        fi
      fi
      exit 1
  initialDelaySeconds: 60
  periodSeconds: 10
  failureThreshold: 5
```

### **Microservice avec dépendances externes**
```yaml
readinessProbe:
  httpGet:
    path: /health/dependencies
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 30          # Moins fréquent pour les dépendances externes
  timeoutSeconds: 10
  failureThreshold: 2
```

## 📊 Patterns de déploiement

### **Blue-Green avec Readiness Probes**
```bash
# Phase 1: Déployer la nouvelle version (green)
kubectl create deployment nginx-green --image=nginx:1.21-alpine

# Phase 2: Attendre que tous les pods soient prêts
kubectl wait --for=condition=ready pod -l app=nginx-green --timeout=300s

# Phase 3: Basculer le trafic
kubectl patch service nginx-service -p '{"spec":{"selector":{"app":"nginx-green"}}}'

# Phase 4: Supprimer l'ancienne version (blue)
kubectl delete deployment nginx-blue
```

### **Canary Deployment**
```yaml
# Déploiement canary avec 10% du trafic
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-canary
spec:
  replicas: 1    # 10% si nginx-stable a 9 replicas
  selector:
    matchLabels:
      app: nginx
      version: canary
  template:
    metadata:
      labels:
        app: nginx
        version: canary
    spec:
      containers:
      - name: nginx
        image: nginx:1.21-alpine
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

## 🔧 Troubleshooting

### **Pod reste "Not Ready"**
```bash
# Vérifier la configuration de la probe
kubectl describe pod <pod-name> -n probes-demo | grep -A 10 Readiness

# Tester manuellement l'endpoint
kubectl exec -it <pod-name> -n probes-demo -- curl -I http://localhost/ready

# Vérifier les logs d'application
kubectl logs <pod-name> -n probes-demo --tail=50
```

### **Service indisponible pendant les déploiements**
```bash
# Vérifier la stratégie de déploiement
kubectl describe deployment nginx-readiness -n probes-demo | grep -A 5 "RollingUpdate"

# Ajuster maxUnavailable et maxSurge
kubectl patch deployment nginx-readiness -n probes-demo -p '{
  "spec": {
    "strategy": {
      "rollingUpdate": {
        "maxUnavailable": 0,
        "maxSurge": "25%"
      }
    }
  }
}'
```

### **Probes trop sensibles**
```bash
# Augmenter la tolérance aux échecs
kubectl patch deployment nginx-readiness -n probes-demo -p '{
  "spec": {
    "template": {
      "spec": {
        "containers": [{
          "name": "nginx",
          "readinessProbe": {
            "failureThreshold": 5,
            "periodSeconds": 10
          }
        }]
      }
    }
  }
}'
```

## 📈 Monitoring et observabilité

### **Métriques clés à surveiller**
```bash
# Pods prêts vs total
kubectl get deployment nginx-readiness -n probes-demo -o jsonpath='{.status.readyReplicas}/{.status.replicas}'

# Endpoints actifs
kubectl get endpoints nginx-readiness -n probes-demo -o jsonpath='{.subsets[*].addresses[*].ip}' | wc -w

# Durée des déploiements
kubectl rollout history deployment/nginx-readiness -n probes-demo
```

### **Alertes recommandées**
- Pourcentage de pods prêts < 50%
- Durée de déploiement > seuil défini
- Oscillation fréquente des états ready/not ready
- Absence d'endpoints disponibles

## 🚨 Bonnes pratiques

### **Configuration optimale**
- ✅ `initialDelaySeconds` court (5-15s) pour readiness
- ✅ `periodSeconds` fréquent (5-10s) pour réactivité
- ✅ `failureThreshold` modéré (2-3) pour éviter les oscillations
- ✅ `successThreshold` = 1 sauf cas spéciaux

### **Conception d'endpoints**
- ✅ Endpoint `/ready` dédié et rapide
- ✅ Vérification des dépendances critiques uniquement
- ✅ Distinction claire entre liveness et readiness
- ✅ Logs détaillés en cas d'échec

### **Stratégies de déploiement**
- ✅ `maxUnavailable: 0` pour haute disponibilité
- ✅ `maxSurge: 25%` pour déploiements progressifs
- ✅ Tests de charge après readiness
- ✅ Rollback automatique si échecs

## 🧹 Nettoyage

```bash
# Supprimer les ressources de démonstration
kubectl delete -f 05-probes/readiness/argocd/argocd-readiness.yaml

# Ou avec Helm
helm uninstall readiness-demo

# Nettoyer le namespace
kubectl delete namespace probes-demo
```

## 📚 Ressources complémentaires

- [Kubernetes Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)
- [Service et Endpoint Controller](https://kubernetes.io/docs/concepts/services-networking/service/#the-endpoint-controller)
- [Deployment Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy)
- [Health Check Patterns](https://microservices.io/patterns/observability/health-check-api.html)

---

*Les Readiness Probes sont cruciales pour assurer une haute disponibilité et des déploiements sans interruption. Configurez-les en fonction de votre logique métier et de vos SLA.*