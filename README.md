# Introduction:
The micro-service for user related functions

# Setup
## Local
### Infrastructure
Starting up system infrastructure
```sh
cd infra-specs # Clone if not already
docker-compose -f k8s/local/docker-compose.yml up --force-recreate # Create up all system infrastructures
```
### Service
Starting up the `user-service`
```sh
cd user-service
npm install # Install libraries
npm run migrate:up # Migrate up all database migrations
npm start # Start the service
```
