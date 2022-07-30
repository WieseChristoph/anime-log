import { RedisClientType, createClient } from "redis";

const TIMEOUT = 60 * 60 * 24 * 7; // 1 week

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var redis: RedisClientType | undefined;
}

const redis =
	global.redis ||
	createClient({
		socket: {
			host: process.env.REDIS_HOST,
			port: parseInt(process.env.REDIS_PORT),
		},
		password: process.env.REDIS_PASSWORD,
	});

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
	await redis.set(key, value, { EX: TIMEOUT });
};

// Search for key in redis db and return value if found
// if not found, get data via callback and store in redis db
export const getOrSetCache = async (key: string, callback: () => any) => {
	await connect();
	return new Promise((resolve, reject) => {
		redis
			.get(key)
			.then(async (result) => {
				if (result) {
					console.log("Cache hit");
					resolve(JSON.parse(result));
				} else {
					console.log("Cache miss");
					const freshData = await callback();
					redis.set(key, JSON.stringify(freshData), { EX: TIMEOUT });
					resolve(freshData);
				}
			})
			.catch(reject);
	});
};

if (process.env.NODE_ENV !== "production") global.redis = redis;
