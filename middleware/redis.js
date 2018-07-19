import redis from 'redis';

const redisClient = () => {
  const client = redis.createClient();
  client.on('error', function (err) {
    console.log('err', err);
  });
  client.on('ready', function () {
    console.log('redis connectd');
  });

  const store = function (req, res, next) {
    req.store = client;
    next();
  };
  return store;
};

export default redisClient;