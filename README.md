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

Set Environment Variable `DATABASE_URL` with an postgres Database URL string.

## Discord

Set Environment Variable `DISCORD_BOT_TOKEN` with an discord bot token.

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

| Action and Path              | Description                           |
| ---------------------------- | ------------------------------------- |
| GET /api/log                 | Get Log by user.                      |
| PUT /api/log/anime           | Add Anime with Anime-Data in body.    |
| PATCH /api/log/anime         | Update Anime with Anime-Data in body. |
| DELETE /api/log/anime        | Delete Anime with Anime-Data in body. |
| GET /api/sharedLog/getId     | Get Shared-Log-Id by user.            |
| GET /api/sharedLog/getLog    | Get Shared-Log by id.                 |
| GET /api/sharedLog/getUserId | Get User-Id by Share-Id.              |
| PUT /api/sharedLog           | Add Shared-Log by user.               |
| DELETE /api/sharedLog        | Delete Shared-Log by user.            |
| GET /api/getUsernameBySub    | Get discord-username by sub.          |
| GET /api/savedSharedLogs     | Get all saved logs by user.           |
| PUT /api/savedSharedLogs     | Add user to shared log by id.         |
| DELETE /api/savedSharedLogs  | Delete user from shared log by id.    |

# TODO

-   When updating an Anime, the lastUpdated date won't update in the Card (LogEntry) but in the array in Log. So it requires a refresh to show.
