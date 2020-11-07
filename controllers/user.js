const { mongoUtils, dataBase } = require('../lib/utils/mongo.js');
const COLLECTION_NAME = 'users';
const bcrypt = require('bcrypt');
const auth = require('../lib/utils/auth.js');
const saltRounds = 10;

/**
 * Función que loguea el usuario, regresandole su JWT correspondiente
 * @param {*} user usuario que se desea loguear
 */
async function login(user) {
    return mongoUtils.conn().then(async (client) => {
      const requestedUser = await client
        .db(dataBase)
        .collection(COLLECTION_NAME)
        .findOne({email: user.email})
        .finally(() => client.close());

      let usuario_actual = {...requestedUser};

      if(Object.getOwnPropertyNames(usuario_actual).length !== 0){
      const validacion_hash = await bcrypt.compare(user.password, requestedUser.password);
      if(validacion_hash == true)
      {
        let token_actual = auth.createToken(usuario_actual);
        usuario_actual.token = token_actual;
        delete usuario_actual.password
        return usuario_actual;
      }
      else
      {
        throw new Error("Usuario y/o contraseña incorrectos");
      }
    }
    else{
      throw new Error("El usuario no se ha encontrado en la BD");
    } 
  });
  }

  /**
   * Función que crea el usuario por parámetro en la BD
   * @param {*} user usuario que se quiere crear
   */
async function createUser(user) {
  return mongoUtils.conn().then(async (client) => {
    const requestedUser = await client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .findOne({email: user.email})
      .finally(() => client.close());

      let usuario_actual = {...requestedUser};

      if(Object.getOwnPropertyNames(usuario_actual).length === 0)
      {
        if(user.password != null || user.password != ""){
          user.password = await bcrypt.hash(user.password, saltRounds);
      }
      return mongoUtils.conn().then(async (client) => {
        const newUser = await client
          .db(dataBase)
          .collection(COLLECTION_NAME)
          .insertOne(user)
          .finally(() => client.close());
        newUser && newUser.ops ? delete newUser.ops[0].password: newUser;
        return newUser.ops[0];
    });
      }
      else
      {
        throw new Error("El usuario dado ya se encuentra registrado.");
      }

    });
}

module.exports = [createUser, login];
