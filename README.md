# Introduction:

The micro-service for user related functions

# Setup

## Local

### Infrastructure

Starting up system infrastructure

```sh
cd infra-specs # Clone if not already
docker-compose -f infra/local/docker-compose.yml up --force-recreate # Create up all system infrastructures
```

Database migration

```sh
cd user-service
npm install # Install packages
npm run db:setup # Create database
npm run migrate:up # Migrate up all database migrations
```

### Service

Starting up the `user-service`

```sh
cd user-service
npm start # Start the service
```
