# -- Alias Build --
FROM node:24.7.0 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# -- Alias Production --
FROM node:24.8-alpine AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production

# Copia build e arquivos essenciais
COPY --from=build /usr/src/app/build ./build
COPY prisma ./prisma
CMD ["npm", "run", "start:prod"]