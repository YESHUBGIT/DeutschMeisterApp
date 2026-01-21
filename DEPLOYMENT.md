# Deployment (AWS + Docker)

## Overview

This app runs with three containers: Next.js, Postgres, and Nginx. Cognito
handles authentication.

## DNS and Cognito

- Point `thecloudtitan.de` and `www.thecloudtitan.de` to the server IP
  `18.156.6.68` in GoDaddy.
- In Cognito, set callback URL:
  - `https://thecloudtitan.de/api/auth/callback/cognito`
- Set sign-out URL (optional):
  - `https://thecloudtitan.de/auth/signin`

## Environment

Copy `.env.example` to `.env` on the server and fill in values.

Required:
- `NEXTAUTH_URL=https://thecloudtitan.de`
- `NEXTAUTH_SECRET=...`
- `COGNITO_CLIENT_ID=...`
- `COGNITO_CLIENT_SECRET=...`
- `COGNITO_ISSUER=https://cognito-idp.eu-central-1.amazonaws.com/hfvyy5`
- `POSTGRES_PASSWORD=...`

## Start

```bash
docker compose up -d --build
```

## GitHub Actions (Docker Hub)

1) Create Docker Hub access token.
2) Add repo secrets:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
3) Push to `main` and the workflow will build and push:
   - `${DOCKERHUB_USERNAME}/deutschmeister:latest`

## HTTPS (Let's Encrypt)

1) Ensure ports 80/443 are open in AWS security group.
2) Issue the first certificate:

```bash
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d thecloudtitan.de -d www.thecloudtitan.de \
  --email you@thecloudtitan.de --agree-tos --no-eff-email
```

3) Reload Nginx:

```bash
docker compose exec nginx nginx -s reload
```

Certbot will auto-renew every 12 hours via the `certbot` service.

## Migrations

The app container runs `pnpm prisma migrate deploy` on start.

## TLS

TLS is handled by Nginx + Certbot in Docker.
