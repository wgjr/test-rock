FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development

RUN npm install --include=dev --no-audit --no-fund

COPY . .

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]

CMD ["npm", "run", "start:dev"]
