FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development

RUN npm install --include=dev --no-audit --no-fund

COPY . .

EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0"]