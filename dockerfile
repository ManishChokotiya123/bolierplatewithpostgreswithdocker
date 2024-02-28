FROM node:21.5.0

WORKDIR /my-ts-postgres-project

COPY . /my-ts-postgres-project/
COPY .env /my-ts-postgres-project/.env
COPY package*.json ./

RUN npm install
RUN npx tsc

CMD ["npx", "ts-node", "src/index.ts"]
