FROM node:14
WORKDIR /usr/src/app
COPY dist/ .
COPY package*.json ./
RUN npm ci --production
CMD [ "node", "./main" ]
