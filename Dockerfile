FROM node:22-alpine AS builder

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:22-alpine AS production

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/dist ./dist

COPY prisma ./prisma/

EXPOSE 3000

CMD ["node", "dist/index.js"]
