var express = require('express');
var router = express.Router();
var [createUser, login] = require('../controllers/user');

/* Crea el usuario en la BD */
router.post('/register', async function(req, res, next) {
  try {
    const newUser = await createUser(req.body);
    res.send(newUser);
  } catch (error) {
    res.status(403).send(error.message);
  }
});
/** Realiza el login del usuario dado */
router.post('/login', async function(req, res, next) {
  try {
    const authUser = await login(req.body);
    res.status(200).send(authUser);
  } catch (error) {
    res.status(403).send(error.message);
  }
});

module.exports = router;
