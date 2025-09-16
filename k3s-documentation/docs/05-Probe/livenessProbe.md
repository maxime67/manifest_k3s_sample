---
sidebar_label: 'Liveness Probe'
sidebar_position: 1
description: "Configuration et utilisation des Liveness Probes avec des pods Nginx"
tags: ['kubernetes', 'probes', 'liveness', 'nginx', 'health-check']
---

import GitHubChart from '@site/src/components/GitHubChart';

# Liveness Probe : Surveillance de la santé des Pods

## 🔍 Aperçu

- Configuration des Liveness Probes pour surveiller la santé des pods Nginx
- Redémarrage automatique des pods en cas de défaillance
- Trois types de probes : HTTP, TCP et Command
- Exemples pratiques avec différentes configurations
- Démonstration des mécanismes de récupération automatique

### Caractéristiques clés

- ✅ **HTTP Probe** : Vérification via endpoint HTTP (recommandé pour les services web)
- ✅ **TCP Probe** : Vérification de la connectivité TCP
- ✅ **Command Probe** : Exécution de commandes personnalisées dans le conteneur
- ✅ **Auto-healing** : Redémarrage automatique en cas d'échec

## 🔍 Caractéristiques

- **Image** : `nginx:alpine`
- **Service** : ClusterIP pour les tests internes
- **livenessProbe** : Différents types de probes configurables
- **Stratégie** : Redémarrage automatique (RestartPolicy: Always)

## 📂 Contenu du projet

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="05-probes"
files={[
'livenessProbe.yaml',
]}

/>

## 📦 Déploiement

1. Déploie les exemples de Liveness Probes :

```bash
# Déploiement via ArgoCD
kubectl apply -f 05-probes/liveness/argocd/argocd-liveness.yaml

# Ou déploiement direct avec Helm
helm install liveness-demo 05-probes/liveness/
```

2. Vérifie le déploiement :
   ```bash
   kubectl get pods -n probes-demo
   kubectl describe pod <pod-name> -n probes-demo
   ```

3. Surveille les événements :
   ```bash
   kubectl get events -n probes-demo --sort-by='.lastTimestamp'
   ```

## 🔍 Types de Liveness Probes

### **HTTP Liveness Probe**
Vérification via requête HTTP GET sur un endpoint spécifique.

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 80
    httpHeaders:
    - name: Custom-Header
      value: liveness-check
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
  successThreshold: 1
```

**Avantages** :
- Idéal pour les services web
- Permet de vérifier la logique applicative
- Peut inclure des headers personnalisés

### **TCP Liveness Probe**
Vérification de la connectivité TCP sur un port spécifique.

```yaml
livenessProbe:
  tcpSocket:
    port: 80
  initialDelaySeconds: 15
  periodSeconds: 20
  timeoutSeconds: 3
  failureThreshold: 3
```

**Avantages** :
- Simple à configurer
- Moins de overhead que HTTP
- Parfait pour les services non-HTTP

### **Command Liveness Probe**
Exécution d'une commande dans le conteneur.

```yaml
livenessProbe:
  exec:
    command:
    - /bin/sh
    - -c
    - "ps aux | grep nginx | grep -v grep"
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 3
```

**Avantages** :
- Flexibilité maximale
- Vérifications personnalisées
- Accès au système de fichiers

## ⚙️ Paramètres de configuration

### **Timing et comportement**

| Paramètre | Description | Valeur par défaut | Recommandation |
|-----------|-------------|-------------------|----------------|
| `initialDelaySeconds` | Délai avant la première probe | 0 | 30s pour apps web |
| `periodSeconds` | Intervalle entre les probes | 10 | 10-30s selon criticité |
| `timeoutSeconds` | Timeout d'une probe | 1 | 5-10s |
| `failureThreshold` | Échecs consécutifs avant action | 3 | 3-5 |
| `successThreshold` | Succès pour considérer sain | 1 | Toujours 1 pour liveness |

### **Exemple de configuration optimisée**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-with-liveness
  namespace: probes-demo
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-liveness
  template:
    metadata:
      labels:
        app: nginx-liveness
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
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
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

## 🧪 Tests et validation

### **Tester le fonctionnement normal**
```bash
# Vérifier l'état des pods
kubectl get pods -n probes-demo -w

# Consulter les logs
kubectl logs -f deployment/nginx-liveness -n probes-demo

# Vérifier les probes
kubectl describe pod <pod-name> -n probes-demo | grep -A 10 Liveness
```

### **Simuler une défaillance**
```bash
# Corrompre le processus nginx
kubectl exec -it <pod-name> -n probes-demo -- pkill nginx

# Observer le redémarrage automatique
kubectl get pods -n probes-demo -w

# Vérifier les événements
kubectl describe pod <pod-name> -n probes-demo | grep Events -A 10
```

### **Tester avec endpoint custom**
```bash
# Créer un endpoint de santé personnalisé
kubectl exec -it <pod-name> -n probes-demo -- sh -c "echo 'healthy' > /usr/share/nginx/html/health"

# Tester l'endpoint
kubectl exec -it <pod-name> -n probes-demo -- wget -qO- http://localhost/health
```

## 🎯 Scénarios d'utilisation

### **Application avec base de données**
```yaml
livenessProbe:
  httpGet:
    path: /health/liveness
    port: 8080
  initialDelaySeconds: 60    # Plus long pour l'init DB
  periodSeconds: 30
  timeoutSeconds: 10
  failureThreshold: 3
```

### **Service critique haute disponibilité**
```yaml
livenessProbe:
  httpGet:
    path: /actuator/health
    port: 8080
  initialDelaySeconds: 45
  periodSeconds: 5          # Vérification fréquente
  timeoutSeconds: 3
  failureThreshold: 2       # Réaction rapide
```

### **Application avec initialisation lente**
```yaml
livenessProbe:
  tcpSocket:
    port: 8080
  initialDelaySeconds: 120   # 2 minutes d'initialisation
  periodSeconds: 15
  timeoutSeconds: 5
  failureThreshold: 5        # Plus tolérant
```

## 🔧 Troubleshooting

### **Pod redémarre en boucle**
```bash
# Vérifier les événements
kubectl describe pod <pod-name> -n probes-demo

# Vérifier les logs du conteneur précédent
kubectl logs <pod-name> -n probes-demo --previous

# Augmenter le délai initial
# initialDelaySeconds: 60
```

### **Liveness probe échoue**
```bash
# Tester manuellement l'endpoint
kubectl exec -it <pod-name> -n probes-demo -- curl -I http://localhost/health

# Vérifier la charge du pod
kubectl top pod <pod-name> -n probes-demo

# Ajuster le timeout
# timeoutSeconds: 10
```

### **Trop de redémarrages**
```bash
# Analyser la fréquence des échecs
kubectl get pod <pod-name> -n probes-demo -o yaml | grep restartCount

# Ajuster le seuil d'échec
# failureThreshold: 5
# periodSeconds: 30
```

## 📊 Monitoring et métriques

### **Métriques Kubernetes importantes**
```bash
# Compter les redémarrages
kubectl get pods -n probes-demo --no-headers | awk '{sum += $4} END {print "Total restarts:", sum}'

# Pods avec le plus de redémarrages
kubectl get pods -n probes-demo --sort-by='.status.containerStatuses[0].restartCount'
```

### **Événements liés aux probes**
```bash
# Filtrer les événements de liveness
kubectl get events -n probes-demo --field-selector reason=Unhealthy

# Historique des redémarrages
kubectl get events -n probes-demo --field-selector reason=Killing
```

## 🚨 Bonnes pratiques

### **Configuration**
- ✅ Ajuste `initialDelaySeconds` selon le temps de démarrage de l'app
- ✅ `periodSeconds` entre 10-30s pour la plupart des cas
- ✅ `timeoutSeconds` suffisant pour les réponses lentes
- ✅ `failureThreshold` de 3 est généralement approprié

### **Endpoints de santé**
- ✅ Crée des endpoints dédiés `/health` ou `/liveness`
- ✅ Évite les vérifications trop complexes
- ✅ Retourne rapidement (< 1 seconde)
- ✅ Ne vérifie pas les dépendances externes

### **Éviter les pièges**
- ❌ Ne pas mettre `successThreshold > 1` pour liveness
- ❌ Éviter les probes trop agressives
- ❌ Ne pas oublier les ressources CPU/mémoire
- ❌ Éviter les checks qui peuvent échouer lors de pics de charge

## 🧹 Nettoyage

```bash
# Supprimer les ressources de test
kubectl delete -f 05-probes/liveness/argocd/argocd-liveness.yaml

# Ou avec Helm
helm uninstall liveness-demo

# Vérifier la suppression
kubectl get pods -n probes-demo
```

## 📚 Ressources utiles

- [Documentation officielle Kubernetes Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [Patterns pour les Health Checks](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
- [Exemples de probes communautaires](https://github.com/kubernetes/examples)

---

*Les Liveness Probes sont essentielles pour maintenir la santé de vos applications. Configurez-les soigneusement selon les spécificités de chaque service.*