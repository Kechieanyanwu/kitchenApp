const passport = require("passport");
const fs = require('fs');

const jwtStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;

const publicKey = fs.readFileSync(__dirname + '../pemfiles' + "/id_rsa_pub.pem")
const options = {
    secretOrKey: publicKey,
    jwtFromRequest: {},
    issuer: {},
    audience: {},
    algorithms: ["HS256"],

}


const verifyCallback = async (jwt_payload, done) => {

} 