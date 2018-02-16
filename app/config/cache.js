var redis = require('redis');

// create a new redis client and connect to our local redis instance
var client = redis.createClient({
  host: 'redis'
});

// if an error occurs, print it to the console
client.on('error', function (err) {
  console.log("Error " + err);
});

client.flushdb( function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
});

function cacheFilter(key) {
  return function(key, req, res, next) {
    client.get(key, function(error, result) {
        if (result) {
          console.log('>> source - cache');
          res.json(JSON.parse(result));
        } else {
          next();
        }
      });
  }.bind(null, key);
}

function cache(key, value) {
  // Cache last 10 hours
  client.set(key, JSON.stringify(value), 'EX', 36000);
}

module.exports = {
  cacheFilter, cache
};
