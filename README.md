# Innovatech Frontend

Frontend de la aplicación Innovatech Chile (SaborExpress), desarrollado con React y servido mediante nginx. Orquestado en un clúster Amazon EKS con pipeline CI/CD en GitHub Actions (build → push a ECR → deploy en el clúster).

## Tecnologías utilizadas
- React 18
- nginx (servidor web y proxy inverso)
- Docker (build multi-stage)
- Amazon EKS (Kubernetes)
- Amazon ECR (registro de imágenes)
- GitHub Actions (CI/CD)

## Arquitectura

El proyecto evolucionó de un despliegue inicial en 3 instancias EC2 separadas (etapa de contenedorización) a una orquestación completa sobre Kubernetes:

- Clúster **innovatech-eks** (Amazon EKS), 2 nodos t3.medium en us-east-1c y us-east-1d, dentro de una VPC unificada (10.1.0.0/16).
- El Frontend corre como Deployment con 2 réplicas, expuesto públicamente mediante un Service (Network Load Balancer / NodePort según disponibilidad de subredes).
- El Backend y la base de datos permanecen dentro del clúster, no accesibles desde Internet.
- nginx actúa como proxy inverso: las llamadas a `/api` se redirigen al Service interno del backend vía DNS de Kubernetes (`backend-service:3001`), no mediante IP privada fija.

## Dockerfile

Build multi-stage para optimizar el tamaño de la imagen final:
- **Stage 1 (builder):** instala dependencias y genera el build de producción de React.
- **Stage 2 (production):** copia el build dentro de una imagen `nginx:alpine`, crea usuario no root.

## nginx.conf

nginx cumple dos funciones:
- Servir los archivos estáticos del build de React.
- Actuar como proxy inverso para las llamadas a `/api`, redirigiendo al Service interno del backend por DNS de Kubernetes.

## Registro de imágenes

Las imágenes se publican en Amazon ECR, etiquetadas con el hash del commit:

<account_id>.dkr.ecr.us-east-1.amazonaws.com/innovatech-frontend:<commit-sha>

## Pipeline CI/CD

El pipeline (rama `deploy-eks`) se activa con cada push y ejecuta:

1. Checkout del código
2. Instalación de dependencias y ejecución de tests (`CI=true npm test -- --watchAll=false --passWithNoTests`)
3. Configuración de credenciales AWS (STS)
4. Build y push de la imagen Docker a Amazon ECR
5. Deploy automático en el clúster EKS (`kubectl set image deployment/frontend-deployment ...`)

Secrets configurados en GitHub Actions:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`
- `EKS_CLUSTER_NAME`

## Cómo ejecutar localmente (desarrollo)

```bash
git clone https://github.com/ByBenjita/innovatech-frontend.git
cd innovatech-frontend
docker-compose up -d
```

Abrir en el navegador: `http://localhost`

## Cómo desplegar en EKS

```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl rollout status deployment/frontend-deployment
```

## Principios DevOps aplicados

- Contenedorización con Docker (multi-stage build) para consistencia entre entornos
- nginx como proxy inverso hacia el backend vía DNS interno de Kubernetes
- Orquestación productiva con Kubernetes (Amazon EKS)
- Pipeline CI/CD automatizado con GitHub Actions, incluyendo etapa de test
- Registro de imágenes versionado por commit en Amazon ECR
- Usuario no root en contenedores por seguridad
- Solo el Frontend es accesible desde Internet; Backend y BD permanecen dentro del clúster

