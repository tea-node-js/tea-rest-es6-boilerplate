# ---- Base Node ----
FROM node:8.9-alpine AS base
# Create app directory
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# install app dependencies including 'devDependencies'
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies AS build
WORKDIR /app
COPY . /app

# --- Release with Alpine ----
FROM node:8.9-alpine AS release
# Create app directory
WORKDIR /app
# Copy dependencies
COPY --from=dependencies /app/package.json ./
# Copy source codes
COPY --from=build /app ./
# Start server
CMD ["node", "index.js"]
