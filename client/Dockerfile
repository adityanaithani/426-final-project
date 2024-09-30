FROM node:alpine

RUN npm install -g pm2

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install --legacy-peer-deps

# # delete node_modules on host before building image
COPY ./ ./

RUN npm run build

CMD ["npm", "run", "docker-start"]