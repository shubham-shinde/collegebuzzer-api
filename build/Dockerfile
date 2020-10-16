# base image
FROM node:8.11.2
ENV NODE_VERSION 8.11.2

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

# ENTRYPOINT ["build/docker-entrypoint.sh"]

# start app
CMD ["npm", "run", "prod"]
EXPOSE 3000

