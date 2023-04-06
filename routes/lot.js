const express = require('express')
const { auth } = require('../middlewares/auth')
const router = express.Router()
const {
    getCustomerlist,
    getStagelist,
    getDevicelist,
    getTesterlist,
    getProgramlist,
    getLotstable,
    getLotInfo,
    getWaferslist,
} = require('../controllers/lot.js')

router.get('/Customerlist', auth, getCustomerlist)
router.get('/Stagelist', auth, getStagelist)
router.get('/Devicelist', auth, getDevicelist)
router.get('/Testerlist', auth, getTesterlist)
router.get('/Programlist', auth, getProgramlist)
router.get('/Lotstable', auth, getLotstable)
router.get('/LotInfo', auth, getLotInfo)
router.get('/Waferslist', auth, getWaferslist)

module.exports = router
