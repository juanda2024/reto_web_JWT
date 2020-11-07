const { mongoUtils, dataBase } = require('../lib/utils/mongo.js');
const COLLECTION_NAME = 'products';

/**
 * Método que regresa todos los productos encontrados en la BD
 */
async function getProducts() {
  const client = await mongoUtils.conn();
  const products = await client
    .db(dataBase)
    .collection(COLLECTION_NAME)
    .find({})
    .toArray()
    .finally(() => client.close());
  return products;
}

/**
 * Método que inserta el producto por parametro en la BD
 * @param {*} product producto deseado a insertar
 */
function insertProduct(product) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .insertOne(product)
      .finally(() => client.close());
  });
}

module.exports = [getProducts, insertProduct];
