FROM node:20.18.1

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

CMD ["sh", "-c", "npm run migrate:up && node dist/application.js"]

EXPOSE 31072
