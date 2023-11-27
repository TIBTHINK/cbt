FROM ubuntu:20.04

run apt-get update && apt-get install -y \
    nodejs \
    npm \
    mysql-server \
    git \
    && apt-get clean

RUN npm install -g n
RUN mysql 