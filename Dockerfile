FROM node:20.18.1

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9.15.9

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

CMD ["sh", "-c", "pnpm run db:setup && pnpm run migrate:up && node dist/application.js"]

EXPOSE 31072
