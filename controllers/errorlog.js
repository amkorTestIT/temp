const { dateFormat } = require('../utils/format/date')
const { get, post, del } = require('../models/errorlog')

const getErrorLog = async (req, res) => {
    const errorlog = await get()
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.json({
        code: 20000,
        msg: 'Success',
        data: JSON.stringify({
            date: dateFormat(),
            errorlog: errorlog,
        }),
    })
}
const postErrorLog = async (req, res) => {
    try {
        // const result = await post(req.body)
        await post(req.body)
        res.json({
            code: 20000,
            msg: 'Success',
            data: JSON.stringify({
                date: dateFormat(),
            }),
        })
    } catch (err) {
        console.log(err)
        res.render('errorLogin', {
            msg: err,
            data: JSON.stringify({
                date: dateFormat(),
            }),
        })
    }
}

const delErrorLog = async (req, res) => {
    const { id } = req.params
    try {
        // const result = await del(id)
        await del(id)
        res.json({
            code: 20000,
            msg: 'Success',
            data: JSON.stringify({
                date: dateFormat(),
            }),
        })
    } catch (err) {
        res.render('errorLogin', {
            msg: err,
            data: JSON.stringify({
                date: dateFormat(),
            }),
        })
    }
}

module.exports = {
    getErrorLog,
    postErrorLog,
    delErrorLog,
}
