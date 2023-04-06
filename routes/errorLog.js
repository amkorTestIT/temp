var express = require('express')
var router = express.Router()
const { auth } = require('../middlewares/auth')
const {
    getErrorLog,
    postErrorLog,
    delErrorLog,
} = require('../controllers/errorlog.js')

router.get('/', auth, getErrorLog)
router.post('/', postErrorLog)
router.delete('/:id', auth, delErrorLog)
module.exports = router
