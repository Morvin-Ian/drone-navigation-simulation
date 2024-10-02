FROM node:20
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV PATH /app/node_modules/.bin:$PATH
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]