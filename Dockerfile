# take default image of node latest
FROM node:latest

MAINTAINER kelvin <kelvinmunene22@gmail.com>

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

#set env variables
ENV NODE_ENV development
ENV PORT 4041
# only copy package.json initially so that `RUN yarn` layer is recreated only
# if there are changes in package.json
ADD package.json yarn.lock /app/

# --pure-lockfile: Don’t generate a yarn.lock lockfile
RUN yarn --pure-lockfile

# copy all file from current dir to /app in container
COPY . /app/

# expose port
EXPOSE 4041 443 80

# cmd to start service
CMD [ "yarn", "start" ]