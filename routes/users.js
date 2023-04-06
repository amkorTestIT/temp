var express = require('express')
var router = express.Router()
const {
    userList,
    userSignout,
    getUserInfo,
    setEmail,
} = require('../controllers/user.js')
const { sign } = require('../utils/token.js')
const { auth } = require('../middlewares/auth')
const { dateFormat } = require('../utils/format/date')
const passport = require('passport')

router.post('/setEmail', auth, setEmail)

router.post('/login', passport.authenticate('login'), (req, res) => {
    const token = sign(req.user.account)
    res.setHeader('X-Token', token)
    res.setHeader('content-type', "application/json;charset='utf8'")
    res.render('success', {
        msg: 'userLogin成功！',
        data: JSON.stringify({
            token: token,
            date: dateFormat(),
        }),
    })
})

router.post('/register', passport.authenticate('register'), (req, res) => {
    req.login(req.user, (err) => {
        if (err)
            res.render('errorLogin', {
                msg: err,
                data: JSON.stringify({
                    date: dateFormat(),
                }),
            })
        res.render('success', {
            msg: 'register success!',
            data: JSON.stringify({
                date: dateFormat(),
            }),
        })
    })
})

router.get('/list', userList)

router.post('/signout', userSignout)

router.get('/getUserInfo', auth, getUserInfo)

module.exports = router
