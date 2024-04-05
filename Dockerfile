FROM node:21

RUN mkdir -p /home/app

WORKDIR /home/app

COPY /package*.json ./

RUN npm install && npm rebuild bcrypt

COPY . /home/app/

EXPOSE 3000

CMD ["npm", "start"]

