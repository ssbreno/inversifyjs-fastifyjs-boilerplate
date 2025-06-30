FROM node:18-alpine AS builder

# Install OpenSSL for Prisma and yarn
RUN apk add --no-cache openssl libc6-compat yarn

WORKDIR /app

COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

COPY prisma ./prisma/

RUN yarn prisma generate

COPY . .

# Generate Swagger documentation
RUN yarn swagger:generate

RUN yarn build

FROM node:18-alpine AS production

# Install OpenSSL for Prisma and yarn
RUN apk add --no-cache openssl libc6-compat yarn

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock* ./

# Install production dependencies only
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/dist ./dist

# Copy the generated Swagger documentation
COPY --from=builder /app/src/generated ./src/generated

COPY prisma ./prisma/

EXPOSE 3000

CMD ["node", "dist/index.js"]
