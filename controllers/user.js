const {
    getAccount,
    findList,
    updateEmailByAccount,
} = require('../models/users.js')
const { dateFormat } = require('../utils/format/date')
const UserService = require('../services/UserService')

/**
 * To handle user login logic
 * 1. 用户名/邮件是否存在
 * 2. 看密码是否正确
 * 3. 返回不同的结果
 */

const userLogin = async (req, res) => {
    const { account, password } = req.body
    const userServiceInstance = new UserService(account, password)
    const { result, msg, token } = await userServiceInstance.signIn(
        account,
        password
    )
    if (result === true) {
        res.setHeader('X-Token', token)
        res.setHeader('content-type', "application/json;charset='utf8'")
        res.render('success', {
            msg: 'userLogin成功！',
            data: JSON.stringify({
                token: token,
                date: dateFormat(),
            }),
        })
    } else {
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.render('errorLogin', {
            msg: msg,
            data: JSON.stringify({
                date: dateFormat(),
            }),
        })
    }
}

const setEmail = async (req, res) => {
    let { email, account } = req.body
    updateEmailByAccount(account, email)
        .then(() => {
            res.setHeader('content-type', 'application/json; charset=utf-8')
            res.json({
                code: 20000,
                msg: 'Success',
                data: {
                    email: email,
                },
            })
        })
        .catch((error) => {
            res.setHeader('content-type', 'application/json; charset=utf-8')
            res.json({
                code: 40100,
                msg: `Error : ${error}`,
            })
        })
}

/**
 *  To handle user singout logic
 *  1. 判断是否存在用户？
 *  2.1 存在？   2.2 不存在？ 直接返回
 *  2.1.1 已经登录？ 去除一登录标志 2.1.2 未登录  直接返回
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const userSignout = async (req, res) => {
    req.session = null
    res.setHeader('content-type', "application/json;charset='utf8'")
    res.render('success', {
        msg: '已退出登录！',
        data: JSON.stringify({
            date: dateFormat(),
        }),
    })
}

/**
 * 用来获取用户列表
 */
const userList = async (req, res) => {
    const list = await findList()
    res.setHeader('content-type', "application/json;charset='utf8'")
    res.render('success', {
        msg: 'success',
        data: JSON.stringify({
            list,
            date: dateFormat(),
            msg: JSON.stringify('get list successfully'),
            total: list.length,
        }),
    })
}
const getUserInfo = async (req, res) => {
    try {
        const { account } = req.body
        console.log('getUserInfo', account)
        const userData = await getAccount(account)
        let data = {}
        if (userData.roles.includes('admin')) {
            data = {
                roles: userData.roles,
                avatar: userData.avatar,
                account: account,
                email: userData.email,
                date: dateFormat(),
                emailIsExist: !!userData.email,
            }
        } else {
            data = {
                roles: userData.roles,
                avatar: userData.avatar,
                account: account,
                email: userData.email,
                date: dateFormat(),
                emailIsExist: !!userData.email,
            }
        }
        res.render('success', {
            msg: 'getUserAuth成功！',
            data: JSON.stringify(data),
        })
    } catch (err) {
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.json({
            code: 40100,
            msg: `Error : ${err}`,
        })
    }
}

module.exports = {
    userLogin,
    userSignout,
    userList,
    getUserInfo,
    setEmail,
}
