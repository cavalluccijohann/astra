FROM node:latest

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

WORKDIR /app
COPY ./ ./
RUN npm install

RUN npm install --global expo-cli

CMD [ "npm", "run", "start" ]
