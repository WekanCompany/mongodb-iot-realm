FROM arm32v7/node:12-buster-slim

RUN apt-get update \
 && apt-get install -y \
      apt-transport-https \
      build-essential \
      make \
      software-properties-common \
      python3 \
      python3-pip \
      libi2c-dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "node", "src/index.js" ]