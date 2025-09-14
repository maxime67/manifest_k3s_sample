---
sidebar_position: 2
---

# Charts Helm

import GitHubChart from '@site/src/components/GitHubChart';

## Application Symfony avec MySQL

Déploie une application Symfony complète avec base de données MySQL.

<GitHubChart
repo="maxime67/manifest_k3s_sample"
path="05-Chart/symfony-mysql"
files={[
'Chart.yaml',
'values.yaml',
'templates/deployment.yaml',
'templates/service.yaml',
'templates/secret.yaml',
'templates/mysql-deployment.yaml'
]}
/>
