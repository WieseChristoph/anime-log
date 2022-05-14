# Configuration

## Auth0 Data

Set Environment Variables:

```bash
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://YOUR_DOMAIN'
AUTH0_ISSUER_BASE_URL='https://AUTH0_DOMAIN'
AUTH0_CLIENT_ID='YOUR_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_CLIENT_SECRET'
```

## Database Connection

Set Environment Variable `DATABASE_URL` with an postgres Database URL string.

# Developement Run

```
npm run dev
```

The Server will listen on `localhost:3000`.

# Production Build

```
docker build -t chwiese/anime-log-client
```

```
docker run chwiese/anime-log-client -p "3000:3000"
```

The Server will listen on `localhost:3000`.
