# Innovatech Frontend

Frontend de la aplicacion Innovatech Chile, desarrollado con React y servido mediante nginx. Desplegado en AWS EC2 mediante contenedores Docker con pipeline CI/CD en GitHub Actions.

## Tecnologias utilizadas

- React 18
- nginx (servidor web y proxy inverso)
- Docker y Docker Compose
- GitHub Actions (CI/CD)
- Amazon EC2

## Arquitectura

La aplicacion se despliega en 3 instancias EC2 separadas dentro de la misma VPC:

- Innovatech_Frontend - Contenedor React/nginx (accesible desde Internet)
- Innovatech_Backend - Contenedor Node.js/Express (subred privada)
- Innovatech_BD - Contenedor MySQL (subred privada)

La comunicacion entre instancias se realiza mediante IPs privadas de la VPC. Solo el Frontend es accesible desde Internet.

## Estructura del proyecto

## Dockerfile

Se utiliza un Dockerfile multi-stage para optimizar el tamano de la imagen final:

- Stage 1 (builder): instala dependencias y construye el build de produccion de React
- Stage 2 (production): copia el build dentro de una imagen nginx limpia, crea usuario no root

## nginx.conf

nginx cumple dos funciones:

- Servir los archivos estaticos del build de React
- Actuar como proxy inverso para las llamadas a /api, redirigiendo al Backend mediante IP privada de la VPC

## Docker Compose

El archivo docker-compose.yml levanta el servicio frontend exponiendo el puerto 80.

## Pipeline CI/CD

El pipeline se activa automaticamente con cada push a la rama deploy y ejecuta los siguientes pasos:

1. Checkout del codigo
2. Login a Docker Hub
3. Build y push de la imagen a Docker Hub
4. Deploy automatico en la instancia EC2 via SSH

Secrets configurados en GitHub Actions:
- DOCKERHUB_USERNAME
- DOCKERHUB_TOKEN
- EC2_FRONTEND_HOST
- EC2_SSH_KEY

## Como ejecutar localmente

1. Clonar el repositorio
```bash
git clone https://github.com/ByBenjita/innovatech-frontend.git
cd innovatech-frontend
```

2. Levantar el contenedor
```bash
docker-compose up -d
```

3. Abrir en el navegador
http://localhost

## Como ejecutar en EC2

1. Conectarse a la instancia via EC2 Instance Connect
2. Crear el archivo docker-compose.yml
3. Ejecutar:
```bash
docker-compose up -d
```

## Principios DevOps aplicados

- Contenedorizacion con Docker para garantizar consistencia entre entornos
- Build multi-stage para reducir el tamano de la imagen final
- nginx como proxy inverso para comunicacion segura con el Backend
- Pipeline CI/CD automatizado con GitHub Actions
- Gestion de secrets para credenciales sensibles
- Control de versiones con Git y ramas especificas por ambiente
- Usuario no root en contenedores para seguridad
- Solo el Frontend es accesible desde Internet, el Backend y BD estan en subred privada