---
sidebar_label: 'Helm Chart Basics'
sidebar_position: 1
description: "Introduction pratique à Helm avec un chart Nginx"
tags: ['helm', 'package-manager', 'kubernetes', 'templating']
---

import GitHubChart from '@site/src/components/GitHubChart';

# Helm : Package Manager pour Kubernetes

## 🔍 Aperçu

- Déploiement d'une application Nginx via un Chart Helm
- Introduction aux concepts fondamentaux : Charts, Templates, Values
- Gestion des releases et des versions
- Templating avancé avec Go templates
- Intégration avec ArgoCD pour le déploiement continu

### Caractéristiques clés

- ✅ **Templating** : Génération dynamique des manifests Kubernetes
- ✅ **Package Management** : Installation, mise à jour et rollback simplifiés
- ✅ **Values** : Configuration centralisée et réutilisable
- ✅ **Release Management** : Suivi des déploiements et historique

## 🔍 Qu'est-ce que Helm ?

Helm est le **package manager** de Kubernetes, comparable à `apt` pour Ubuntu ou `npm` pour Node.js.

**Concepts clés** :
- **Chart** : Package contenant les templates et configurations
- **Release** : Instance déployée d'un chart
- **Repository** : Stockage centralisé des charts
- **Values** : Variables de configuration

## 📂 Structure du projet

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="06-helm/test"
files={[
'Chart.yaml',
'values.yaml',
'templates/deployment.yaml',
'templates/service.yaml',
'templates/ingress.yaml',
'templates/httproute.yaml',
'templates/hpa.yaml',
'templates/serviceaccount.yaml',
'templates/_helpers.tpl',
'templates/NOTES.txt',
]}
/>

## 🎯 Anatomie d'un Chart Helm

### **Chart.yaml** - Métadonnées du chart
```yaml
apiVersion: v2
name: test
description: A Helm chart for Kubernetes
type: application
version: 0.1.0        # Version du chart
appVersion: "1.16.0"   # Version de l'application
```

### **values.yaml** - Configuration par défaut
```yaml
replicaCount: 1
image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: ""

service:
  type: NodePort
  port: 80

autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 4
```

### **Templates** - Manifests Kubernetes dynamiques
Les templates utilisent la syntaxe **Go Template** avec des fonctions spécialisées.

## 🚀 Concepts fondamentaux

### **1. Templating avec Go Templates**

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "test.fullname" . }}
  labels:
    {{- include "test.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          ports:
            - name: http
              containerPort: {{ .Values.service.port }}
```

**Syntaxes importantes** :
- `{{ .Values.key }}` : Accès aux valeurs
- `{{ .Chart.Name }}` : Métadonnées du chart
- `{{- }}` : Supprime les espaces/retours à la ligne
- `| nindent 4` : Fonction d'indentation

### **2. Helpers Templates (_helpers.tpl)**

```yaml
{{/*
Expand the name of the chart.
*/}}
{{- define "test.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "test.labels" -}}
helm.sh/chart: {{ include "test.chart" . }}
{{ include "test.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
```

**Fonctions utiles** :
- `include` : Inclure un template helper
- `default` : Valeur par défaut
- `trunc` : Tronquer une chaîne
- `nindent` : Indentation avec retour à la ligne

### **3. Logique conditionnelle**

```yaml
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "test.fullname" . }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  # Configuration ingress...
{{- end }}
```

**Structures de contrôle** :
- `{{- if condition }}` / `{{- end }}` : Condition
- `{{- with .Values.key }}` / `{{- end }}` : Change le contexte
- `{{- range .Values.list }}` / `{{- end }}` : Boucle

## 🛠️ Commandes Helm essentielles

### **Installation et gestion des releases**
```bash
# Installer un chart
helm install mon-app ./06-helm/test

# Installer avec des valeurs personnalisées
helm install mon-app ./06-helm/test -f custom-values.yaml

# Mettre à jour une release
helm upgrade mon-app ./06-helm/test

# Lister les releases
helm list

# Voir l'historique
helm history mon-app

# Rollback vers une version précédente
helm rollback mon-app 1
```

### **Développement et debug**
```bash
# Valider la syntaxe
helm lint ./06-helm/test

# Générer les manifests sans déployer (dry-run)
helm template mon-app ./06-helm/test

# Debug avec valeurs
helm template mon-app ./06-helm/test --debug

# Installer en mode dry-run
helm install mon-app ./06-helm/test --dry-run --debug
```

### **Gestion des valeurs**
```bash
# Voir les valeurs par défaut
helm show values ./06-helm/test

# Installer avec valeurs en ligne
helm install mon-app ./06-helm/test --set replicaCount=3

# Multiple valeurs
helm install mon-app ./06-helm/test \
  --set replicaCount=3 \
  --set image.tag=latest
```

## 📦 Déploiement pratique

### **1. Déploiement local**
```bash
# Installation directe
helm install nginx-demo ./06-helm/test

# Vérification
kubectl get pods,svc
helm status nginx-demo
```

### **2. Déploiement avec ArgoCD**
Le chart inclut une configuration ArgoCD :

```yaml
# 06-helm/test/argocd/argocd-helm.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: helm
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/maxime67/manifest_k3s_sample
    path: 06-helm/test
    helm:
      valueFiles:
        - values.yaml
  destination:
    namespace: prometheus
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

```bash
# Déployer via ArgoCD
kubectl apply -f 06-helm/test/argocd/argocd-helm.yaml
```

## 🎛️ Personnalisation avancée

### **Fichier values-production.yaml**
```yaml
# values-production.yaml
replicaCount: 3

image:
  tag: "1.21-alpine"
  pullPolicy: Always

service:
  type: LoadBalancer

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 60

ingress:
  enabled: true
  className: traefik
  hosts:
    - host: mon-app.example.com
      paths:
        - path: /
          pathType: Prefix
```

### **Déploiement par environnement**
```bash
# Development
helm install mon-app ./06-helm/test

# Staging  
helm install mon-app-staging ./06-helm/test -f values-staging.yaml

# Production
helm install mon-app-prod ./06-helm/test -f values-production.yaml
```

## 🔧 Fonctionnalités avancées

### **1. Hooks Helm**
```yaml
# templates/migration-job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ include "test.fullname" . }}-migration
  annotations:
    "helm.sh/hook": pre-install,pre-upgrade
    "helm.sh/hook-weight": "1"
    "helm.sh/hook-delete-policy": hook-succeeded
```

### **2. Tests intégrés**
```yaml
# templates/tests/test-connection.yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "test.fullname" . }}-test-connection"
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "test.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never
```

```bash
# Exécuter les tests
helm test mon-app
```

### **3. Dépendances**
```yaml
# Chart.yaml
dependencies:
  - name: mysql
    version: "9.4.6"
    repository: "https://charts.bitnami.com/bitnami"
    condition: mysql.enabled
```

```bash
# Mettre à jour les dépendances
helm dependency update
```

## 🚨 Bonnes pratiques

### **Structure et nommage**
- ✅ Utilise des helpers pour les noms et labels
- ✅ Préfixe les ressources avec le nom du chart
- ✅ Évite les noms codés en dur
- ✅ Utilise des conventions cohérentes

### **Values et configuration**
- ✅ Documente les valeurs importantes
- ✅ Fournis des valeurs par défaut sensées
- ✅ Groupe les configurations logiquement
- ✅ Utilise des types de données appropriés

### **Templates**
- ✅ Évite la logique complexe dans les templates
- ✅ Utilise `required` pour les valeurs obligatoires
- ✅ Valide tes templates avec `helm lint`
- ✅ Teste avec différentes combinaisons de valeurs

## 🔧 Troubleshooting

### **Erreurs courantes**
```bash
# Template invalide
helm template mon-app ./06-helm/test --debug

# Valeurs manquantes
helm install mon-app ./06-helm/test --dry-run --debug

# Conflit de ressources
helm list
helm delete mon-app-old
```

### **Debug des releases**
```bash
# Voir les manifests générés
helm get manifest mon-app

# Voir les valeurs utilisées
helm get values mon-app

# Historique complet
helm history mon-app --max 10
```

## 🧹 Nettoyage

```bash
# Supprimer une release
helm uninstall nginx-demo

# Supprimer avec historique
helm uninstall nginx-demo --keep-history

# Lister les releases supprimées
helm list --uninstalled
```

## 📚 Ressources pour aller plus loin

- [Documentation officielle Helm](https://helm.sh/docs/)
- [Chart Development Guide](https://helm.sh/docs/chart_best_practices/)
- [Helm Hub](https://artifacthub.io/) - Repository public des charts

## 💡 Points clés à retenir

1. **Helm simplifie** le déploiement d'applications Kubernetes complexes
2. **Les templates** permettent la réutilisabilité et la personnalisation
3. **Les values** centralisent la configuration
4. **Les releases** facilitent la gestion du cycle de vie
5. **L'intégration ArgoCD** permet le GitOps

---

*Helm transforme la complexité des déploiements Kubernetes en packages réutilisables et configurables. Maîtrisez ces concepts pour industrialiser vos déploiements.*