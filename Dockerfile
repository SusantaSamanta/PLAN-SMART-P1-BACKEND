FROM node:22-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install dependencies using the lockfile
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code, Prisma schema, migrations, and config
COPY . .

EXPOSE 8000

CMD ["node", "index.js"]


