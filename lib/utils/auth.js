const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const secret = process.env.JWT_SECRET_KEY;

/**
 * Crea el token para el usuario correspondiente
 */
function createToken(data){
    return jwt.sign(data, secret, { algorithm: 'HS256', expiresIn: '24h'});
}

/**
 *  Función que valida el token enviado por el usuario
 */
function checkToken(req, res, next){
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if(token && token.startsWith("Bearer"))
    {
        token = token.split(" ")[1];
        return validateToken(token, req, res, next);
    }
    else{
        res.status(401);
        return res.json({
            success: false,
            message: "No se ha logrado autenticar correctamente el token"
        });
    }
}
/**
 * Funcion que mira si el token enviado es valido, y revisa para cada acción deseada si el usuario cumple con el rol requerido.
 */
function validateToken(token, req, res, next)
{
    jwt.verify(token, secret, (err, decoded) => {
        if(err)
        {
            return res.send(401).json({
                success: false,
                message: "El token no es valido"
            });
        }
        else{

            if(req.route.methods.get === true)
            {
                req.decoded = decoded;
                next();
            }
            else if(req.route.methods.post === true && decoded.roles[0] === "admin")
            {
                req.decoded = decoded;
                next();
            }
            else
            {
                res.status(401);
                return res.json({
                    success: false,
                    message: "Su rol no le permite realizar esta acción"
                });
            }
        }
    });
}

module.exports = {
    checkToken: checkToken,
    createToken: createToken
  }
