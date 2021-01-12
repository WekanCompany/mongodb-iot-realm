FROM arm32v7/node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 9000
CMD [ "node", "src/index.js" ]