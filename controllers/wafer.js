const { dateFormat } = require('../utils/format/date')
const {
    getWaferInfoById,
    getWafersPageByIndex,
    getWaferCoordsById,
    getWafersMapByIndex,
} = require('../models/wafer')

const getWaferspage = async (req, res) => {
    const { lotid, stage, osatid, mode } = req.query
    const Waferpage = await getWafersPageByIndex(lotid, stage, osatid, mode)
    res.render('success', {
        msg: 'Get wafers success!',
        data: JSON.stringify({
            Waferpage: Waferpage,
            date: dateFormat(),
        }),
    })
}
const getWaferInfo = async (req, res) => {
    const { lotid, waferid, stage, rtnum } = req.query
    const WaferInfo = await getWaferInfoById(lotid, waferid, stage, rtnum)
    res.render('success', {
        msg: 'Get wafers success!',
        data: JSON.stringify({
            WaferInfo: WaferInfo,
            date: dateFormat(),
        }),
    })
}
const getWaferCoords = async (req, res) => {
    const { lotid, waferid, stage, rtnum } = req.query
    const WaferCoords = await getWaferCoordsById(lotid, waferid, stage, rtnum)
    res.render('success', {
        msg: 'Get wafers success!',
        data: JSON.stringify({
            WaferCoords: WaferCoords,
            date: dateFormat(),
        }),
    })
}

const getWafersMap = async (req, res) => {
    const { lotid, stage, osatid, mode } = req.query
    const WafersMap = await getWafersMapByIndex(lotid, stage, osatid, mode)
    res.render('success', {
        msg: 'Get wafers map success!',
        data: JSON.stringify({
            WafersMap: WafersMap,
            date: dateFormat(),
        }),
    })
}

module.exports = {
    getWaferspage,
    getWaferInfo,
    getWaferCoords,
    getWafersMap,
}
