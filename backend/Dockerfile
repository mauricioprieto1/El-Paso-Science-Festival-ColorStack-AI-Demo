FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src/ ./src/

# Create data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 3001

CMD ["node", "src/server.js"]
