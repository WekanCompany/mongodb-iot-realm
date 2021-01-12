FROM arm32v7/node:12-buster-slim

RUN apt-get update \
 && apt-get install -y \
      apt-transport-https \
      build-essential \
      make \
      software-properties-common \
      python3 \
      python3-pip

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 1883
EXPOSE 3000
CMD [ "node", "src/index.js" ]