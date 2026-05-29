import IORedis from "ioredis";

// export const redisConnection = new IORedis({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,

//   maxRetriesPerRequest: null, // required for BullMQ

//   retryStrategy: (times) => {
//     console.log("Retrying Redis...", times);
//     return Math.min(times * 100, 2000);
//   },
// });