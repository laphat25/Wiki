FROM node:20-alpine

RUN apk add --no-cache python3 make g++ wget

WORKDIR /app

COPY backend-node/package.json backend-node/package-lock.json ./
RUN npm ci --omit=dev

COPY backend-node/src ./src
COPY frontend ./frontend

RUN mkdir -p data uploads

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/app/data/database.sqlite
ENV SESSION_DB_PATH=/app/data/sessions.sqlite
ENV FRONTEND_PATH=/app/frontend

EXPOSE 3000

CMD ["sh", "-c", "node src/db/init.js && node src/server.js"]
