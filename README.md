[![GitHub license](https://img.shields.io/github/license/WieseChristoph/anime-log)](https://github.com/WieseChristoph/anime-log/blob/main/LICENSE)
![GitHub deployments](https://img.shields.io/github/deployments/WieseChristoph/anime-log/Production)
![GitHub branch checks state](https://img.shields.io/github/checks-status/WieseChristoph/anime-log/main)

# Anime Log

Website to log watched anime.
![Screenshot](https://user-images.githubusercontent.com/32820890/182124207-211c84aa-98ad-45fc-97bc-ccbea44cc1df.png)

# Configuration

## Next-Auth Data

Set Environment Variables:

```
NEXTAUTH_SECRET=<use [openssl rand -hex 32] to generate a 32 bytes value>
NEXTAUTH_URL=<http://YOUR_DOMAIN> (must not be set when deploying to vercel)
```

## Discord Authentication

Set Environment Variables:

```
DISCORD_CLIENT_ID=<YOUR_CLIENT_ID>
DISCORD_CLIENT_SECRET=<YOUR_CLIENT_SECRET>
```

## Database Connection

Set Environment Variable `DATABASE_URL` with an postgres Database URL string.

# Developement Run

```
yarn dev
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
