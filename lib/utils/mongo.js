const MongoClient = require("mongodb").MongoClient;
const uri = process.env.DB_HOST;
const dataBase = process.env.DB_NAME;

function mongoUtils() {
  const mu = {};

  mu.conn = () => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return client.connect();
  };
  return mu;
}

exports.mongoUtils = mongoUtils();
exports.dataBase = dataBase;