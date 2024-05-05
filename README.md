# Database setup
Setup for development individually:
```sh
cd tools
docker-compose up
```
Note: Should setup follow the `infra-specs` steps.  

# Migration
Execute the tables migration:
```sh
npm run migrate:up
```
Note: Learn more related commands in the `package.json` file.
