FROM node:20.18.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npm run migrate:up

CMD ["node", "dist/index.js"]

EXPOSE 31072
