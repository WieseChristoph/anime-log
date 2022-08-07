import Redis from "ioredis";

const TIMEOUT = 60 * 60 * 24 * 7; // 1 week

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var redis: Redis | undefined;
}

export const redis = global.redis || new Redis(process.env.REDIS_URL);

if (process.env.NODE_ENV !== "production") global.redis = redis;

// Search for key in redis db and return value if found
// if not found, get data via callback and store in redis db
export async function getOrSetCache(
	key: string,
	callback: () => any
): Promise<any> {
	return new Promise((resolve, reject) => {
		redis.get(key, async (err, result) => {
			if (err) reject(err);
			else if (result) {
				resolve(JSON.parse(result));
			} else {
				const freshData = await callback();
				redis.set(key, JSON.stringify(freshData), "EX", TIMEOUT);
				resolve(freshData);
			}
		});
	});
}
