# Testing the application

The following sections will provide information on how to run and test the application locally.


## Prerequisites

A Docker compose file is provided to run the project in a containerized environment. To use it, you need to have Docker installed on your machine.


## Running the application

To run the application using docker, use the following command:
```bash
docker compose -f docker-compose-test.yaml up -d
```

At this point, the frontend should be available under `http://localhost:5173`.

If you also want to develop someting in the frontend, it is recommended to use the provided Dev-Container. More information can be found in the [Development Guide](./development.md).
