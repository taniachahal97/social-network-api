const { connect, connection } = require('mongoose');

connect('mongodb://127.0.0.1/userThoughts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
