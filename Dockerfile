FROM node:latest

MAINTAINER Razvan Laurus <razvan.laurus@gmail.com>

ENV app_dir /src

COPY . ${app_dir}

WORKDIR ${app_dir}

RUN npm install -g bower
RUN npm install
RUN bower install --allow-root

EXPOSE 3000

CMD ["npm", "start"]
