const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const sign = (payload) => {
    const privateKey = fs.readFileSync(
        path.join(__dirname, 'keys', 'rsa_private_key.pem')
    )
    let token = jwt.sign({ account: payload }, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1d',
    })
    return token
}
const verify = (token) => {
    const publicKey = fs.readFileSync(
        path.join(__dirname, 'keys', 'rsa_public_key.pem')
    )
    const res = jwt.verify(token, publicKey)
    const { account } = res
    return {
        result: account,
        isValid: account,
    }
}

module.exports = {
    sign,
    verify,
}
