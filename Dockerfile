RUN apt-get update
RUN apt apt install redis-tools
FROM node:22.9.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
