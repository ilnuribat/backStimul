FROM node:10

WORKDIR /app

COPY package*.json /app/


RUN npm i --production


COPY . .

CMD ["npm", "start"]
