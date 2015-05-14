FROM google/nodejs-runtime

MAINTAINER Razvan Laurus <razvan.laurus@gmail.com>

RUN npm install -g bower
RUN bower install --allow-root
