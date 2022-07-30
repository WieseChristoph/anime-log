import Redis from "ioredis";

const TIMEOUT = 60 * 60 * 24 * 7; // 1 week

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var redis: Redis | undefined;
}

const redis =
	global.redis ||
	new Redis(parseInt(process.env.REDIS_PORT), process.env.REDIS_HOST, {
		password: process.env.REDIS_PASSWORD,
	});

if (process.env.NODE_ENV !== "production") global.redis = redis;

const connect = async () => {
	const pingResult = await redis.ping();
	if (pingResult === "PONG") return;
	await redis.connect();
};

export const getCache = async (key: string) => {
	await connect();
	return redis.get(key);
};

export const setCache = async (key: string, value: string) => {
	await connect();
	await redis.set(key, value, "EX", TIMEOUT);
};

// Search for key in redis db and return value if found
// if not found, get data via callback and store in redis db
export const getOrSetCache = async (key: string, callback: () => any) => {
	await connect();
	return new Promise((resolve, reject) => {
		redis.get(key, async (err, result) => {
			if (err) reject(err);
			else if (result) {
				console.log("Cache hit");
				resolve(JSON.parse(result));
			} else {
				console.log("Cache miss");
				const freshData = await callback();
				redis.set(key, JSON.stringify(freshData), "EX", TIMEOUT);
				resolve(freshData);
			}
		});
	});
};
