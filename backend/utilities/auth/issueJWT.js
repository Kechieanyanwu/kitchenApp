const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync(__dirname + '/../../pemfiles' + "/id_rsa_priv.pem")

const issueToken = (user) => {
    const id = user.id;
    
    const expiresIn = "1d";
    const options = {
        algorithm: 'RS256',
        expiresIn: expiresIn
    }

    const payload = {
        sub: id,
        iat: Date.now()
    }

    const signedToken = jwt.sign(payload, privateKey, options);

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}

module.exports = issueToken;