const redis = require("redis");

const redisClient = redis.createClient({
	url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.on("error", (err) => console.log("Redis client error", err));
redisClient.on("connect", () => console.log("Redis client connecting..."));
redisClient.on("ready", () => console.log("Redis client is ready!"));

module.exports = redisClient;
