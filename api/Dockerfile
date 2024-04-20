FROM oven/bun

WORKDIR /api

COPY package*.json ./

RUN bun install --force

COPY . .

RUN bunx prisma generate

EXPOSE 3000

RUN bun run build

CMD [ "bun", "run", "start" ]
