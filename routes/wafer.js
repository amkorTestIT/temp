const express = require('express')
const { auth } = require('../middlewares/auth')
const router = express.Router()
const {
    getWaferspage,
    getWaferInfo,
    getWaferCoords,
    getWafersMap,
} = require('../controllers/wafer.js')

router.get('/Waferspage', auth, getWaferspage)
router.get('/WaferInfo', auth, getWaferInfo)
/**
 * @descriptions
 * Wafermap 畫map 會用到
 */
router.get('/WafersCoords', auth, getWaferCoords)
/**
 * @descriptions
 * Monitor dialog 會用到
 */
router.get('/WafersMap', auth, getWafersMap)

module.exports = router
