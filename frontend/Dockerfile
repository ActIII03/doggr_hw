FROM node:16
### NOTE This is a DEVELOPMENT container, not prod!

# sets the working directory to /app
WORKDIR /app
RUN apt-get update
# we can remove these once we're done tinkering
RUN apt-get install -y apt-utils nano

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci 

# Copy app over
COPY . .

# Docker annoyingly tries to persist perms on node_modules as being "root"
# if we happen to have a local copy of node_modules
RUN chown -R node:node /app/node_modules
#RUN mv .env.docker .env

# Not technically needed, but shows intent
EXPOSE 3000

# Note you should be more extensive here if worried about deploying to Prod!
CMD ["npm", "run", "start"]

