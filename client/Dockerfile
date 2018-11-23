FROM node:10-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm i

COPY . .

RUN npm run build

CMD [ "bash", "-c", "mkdir -p static && rm -rf static/* && cp -r build/* static/" ]
