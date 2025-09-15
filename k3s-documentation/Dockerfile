# Multi-stage build pour optimiser la taille de l'image finale

# Stage 1: Build de l'application
FROM bitnami/node:18 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY ./package*.json ./
COPY ./yarn.lock* ./

# Installer les dépendances
RUN yarn install --frozen-lockfile

# Copier le code source
COPY . .

# Build de l'application Docusaurus
RUN yarn build

# Stage 2: Image de production avec Nginx
FROM bitnami/nginx:1.25

LABEL maintainer="votre-email@example.com"
LABEL description="Documentation K3S avec Docusaurus"
LABEL version="1.0"

COPY --from=builder /app/build /opt/bitnami/nginx/html

COPY docker/nginx.conf /opt/bitnami/nginx/conf/nginx.conf

# Exposition du port
EXPOSE 8080

# L'image Bitnami Nginx démarre automatiquement
# Pas besoin de CMD spécifique