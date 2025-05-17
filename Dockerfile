FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy everything except node_modules (defined in .dockerignore)
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"] 