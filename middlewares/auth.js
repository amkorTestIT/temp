const { verify } = require('../utils/token.js')
// const { checkUserAuth } = require("../models/users.js")
const auth = async (req, res, next) => {
    const { 'x-token': token } = req.headers
    try {
        if (!token) resignin()
        const { result, isValid } = verify(token)
        // console.log('auth', result, isValid, token)
        if (!isValid) {
            resignin()
        } else {
            req.body.account = result
            next()
        }
        // const { isExit, isAdmin } = await checkUserAuth(result);
        // if (isExit && isAdmin) {
        //   next()
        // } else {
        //   resignin()
        // }
    } catch (err) {
        console.log(err)
        resignin()
    }
    function resignin() {
        res.render('resignin', {
            data: JSON.stringify({
                needReSignin: true,
                message: '需要重新登入',
            }),
        })
    }
}

exports.auth = auth
