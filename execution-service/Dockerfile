FROM node:18-alpine

# Install necessary dependencies for multiple languages
RUN apk update && apk add openjdk11 gcc g++ python3

WORKDIR /execution-service
COPY . .
RUN npm install
CMD [ "npm", "run", "dev"]