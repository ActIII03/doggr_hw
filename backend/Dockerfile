FROM node:16

# sets the working directory to /app
WORKDIR /app
RUN apt-get update
# we can remove these once we're done tinkering
RUN apt-get install -y apt-utils nano

# Install EXACTLY the dependency versions, not latest
COPY package.json package-lock.json ./

# If building for prod, we don't need dev deps, so can run
# > npm ci --only=prod
RUN npm ci 

COPY --chown=node:node . .
EXPOSE 9000

# Note you should be more extensive here if worried about deploying to Prod!
RUN npm run build
CMD ["npm", "run", "dev"]

