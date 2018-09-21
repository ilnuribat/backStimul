FROM node:10

WORKDIR /app

COPY package-lock.json package-lock.json
COPY package.json package.json

RUN npm i --production


COPY . .

CMD ["node", "src"]
