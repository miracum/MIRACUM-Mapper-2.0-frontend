# Deployment

The following sections will provide information on how to deploy the application on a server.


## Service Overview

To get an overview of how the services work together, see the following graphic:

![Deployment Overview](/docs/images/ArchitectureDeployment-dark.svg#gh-dark-mode-only)
![Deployment Overview](/docs/images/ArchitectureDeployment-light.svg#gh-light-mode-only)


## Prerequisites

All services are containerized and can be deployed using Docker. A `Dockerfile` for the Backend and Frontend is provided to build the containers and `docker-compose.yaml` files are provided to run these containers with additional services like a PostgreSQL database, Keycloak and Nginx. The Frontend and Backend itself can be configured to work with these external services. To use the containers, Docker has to be installed on the machine.


## Running the application

The backend has to be set up before running the frontend. See [here](https://github.com/miracum/MIRACUM-Mapper-2.0-backend/blob/master/docs/setup/deployment.md) for the Backend Deployment Guide.

The Docker Container uses Nginx to serve the bundled frontend and provide certificates for `https`. The certificates have to be created before starting the Container. For the deployment on a test system, Self Signed Certificates can be created with the following command:
```
mkdir certs
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -sha256 -days 3650 -nodes -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"
```

In the [.env](/.env) file in this frontend repository the section with the deployment environment variables has to be commented in and the development variables have to be commented out. Then start the frontend with the following command:
```bash
docker compose up -d
```

The frontend is then available under `https://localhost`. The backend api is available under `/api` and keycloak is available under `/keycloak`. So the communication with the backend and keycloak which is not `https` protected gets proxied through the nginx server which is `https` protected.

If the server domain is `miracum-mapper.de` the api would be available under `https://miracum-mapper.de/api`, keycloak under `https://miracum-mapper.de/keycloak` and the frontend under `https://miracum-mapper.de/`.

The Dockerfile uses `npm run build-only` to build the project. It is intended to use `npm run build` in the future. Currently not all JavaScript files are updated to TypeScript so using `build` would fail due to type-checks.
