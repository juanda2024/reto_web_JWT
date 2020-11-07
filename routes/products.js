var express = require('express');
var router = express.Router();
var [getProducts, insertProduct] = require('../controllers/product');
const auth = require('../lib/utils/auth.js')

/**
 * GET productos: Todos los usuarios pueden ver los productos
 */
router.get('/', auth.checkToken, async function (req, res, next) {
  const products = await getProducts();
  console.warn('productos: ', products);
  res.send(products);
});
/**
 * POST producto: Solo usuarios con el rol ADMIN pueden crear productos
 */
router.post('/', auth.checkToken, async function (req, res, next) {
  const newProduct = await insertProduct(req.body);
  console.warn('producto insertado: ', newProduct.ops);
  res.send(newProduct.ops);
});

module.exports = router;
