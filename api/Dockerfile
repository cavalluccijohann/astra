FROM node:22.14.0

WORKDIR /api

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npx prisma generate

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start" ]
