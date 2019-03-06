FROM node:10

WORKDIR /app

COPY package*.json /app/

RUN npm i

COPY . .

CMD ["npm", "start"]
