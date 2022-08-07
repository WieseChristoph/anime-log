# Anime Log

Website to log watched anime.
![Screenshot](https://user-images.githubusercontent.com/32820890/182124207-211c84aa-98ad-45fc-97bc-ccbea44cc1df.png)

# Configuration

## Auth0 Data

Set Environment Variables:

```bash
AUTH0_SECRET=<use [openssl rand -hex 32] to generate a 32 bytes value>
AUTH0_BASE_URL=<http://YOUR_DOMAIN>
AUTH0_ISSUER_BASE_URL=<https://AUTH0_DOMAIN>
AUTH0_CLIENT_ID=<YOUR_CLIENT_ID>
AUTH0_CLIENT_SECRET=<YOUR_CLIENT_SECRET>
```

## Database Connection

Set Environment Variable `MONGODB_URI` with an Mongo DB URL string.

## Discord

Set Environment Variable `DISCORD_BOT_TOKEN` with an discord bot token.

## Redis

Set Environment Variables `REDIS_URL` (redis://username:password@host:port).

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

# API Routes

| Action and Path                   | Description                                     |
| --------------------------------- | ----------------------------------------------- |
| GET /api/log                      | Get Log by user.                                |
| GET /api/log/anime                | Get Anime by user.                              |
| PUT /api/log/anime                | Add Anime with Anime-Data in body.              |
| PATCH /api/log/anime              | Update Anime with Anime-Data in body.           |
| DELETE /api/log/anime             | Delete Anime with Anime-Data in body.           |
| GET /api/log/shared               | Get Shared-Log-Id by user.                      |
| PUT /api/log/shared               | Create Shared-Log-Id by user.                   |
| DELETE /api/log/shared            | Delete Shared-Log-Id by user.                   |
| GET /api/log/shared/anime         | Get Shared-Log Anime by share-id.               |
| GET /api/log/shared/saved         | Get saved Shared-Logs by user.                  |
| PUT /api/log/shared/saved         | Add saved Shared-Logs with share-id in body.    |
| DELETE /api/log/shared/saved      | Delete saved Shared-Logs with share-id in body. |
| GET /api/discord/getUsernameBySub | Get discord-username by sub.                    |
| GET /api/kitsu/getIdByTitle       | Get Kitsu Id by Title.                          |

# TODO

-   When updating an Anime, the lastUpdated date won't update in the Card (LogEntry) but in the array in Log. So it requires a refresh to show.
