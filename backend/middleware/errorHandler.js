const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
  console.error(err.stack);

  if (res.headersSent) {
    return next(err); 
  }

  res
    .status(err.status || 500)
    .json({ error: err.message });
};

module.exports = errorHandler;
