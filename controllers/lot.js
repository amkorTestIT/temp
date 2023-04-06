const {
    getCustomerList,
    getStageList,
    getDeviceList,
    getTesterList,
    getProgramList,
    getLotsTable,
    getLotInfoById,
} = require('../models/lot')
const { getOSATInfoById } = require('../models/osat')
const { getWafersListByIndex } = require('../models/wafer')
const { getOsatTable } = require('../models/osat')
const { dateFormat } = require('../utils/format/date')

const getCustomerlist = async (req, res) => {
    const customerlist = await getCustomerList()
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.render('success', {
        msg: 'Get customerlist success!',
        data: JSON.stringify({
            customerlist: customerlist,
            date: dateFormat(),
        }),
    })
}

const getStagelist = async (req, res) => {
    // console.log(req.query, req.params, req.body)
    const customer = req.query.customer
    const stagelist = await getStageList(customer)
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.render('success', {
        msg: 'Get stagelist success!',
        data: JSON.stringify({
            stagelist: stagelist,
            date: dateFormat(),
        }),
    })
}
const getDevicelist = async (req, res) => {
    // console.log(req.query, req.params, req.body)
    const { customer, stage } = req.query
    const devicelist = await getDeviceList(customer, stage)
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.render('success', {
        msg: 'Get devicelist success!',
        data: JSON.stringify({
            devicelist: devicelist,
            date: dateFormat(),
        }),
    })
}
const getTesterlist = async (req, res) => {
    // console.log(req.query, req.params, req.body)
    const { customer, stage, device } = req.query
    const testerlist = await getTesterList(customer, stage, device)
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.render('success', {
        msg: 'Get testerlist success!',
        data: JSON.stringify({
            testerlist: testerlist,
            date: dateFormat(),
        }),
    })
}
const getProgramlist = async (req, res) => {
    // console.log(req.query, req.params, req.body)
    const { customer, stage, device } = req.query
    const programlist = await getProgramList(customer, stage, device)
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.render('success', {
        msg: 'Get programlist success!',
        data: JSON.stringify({
            programlist: programlist,
            date: dateFormat(),
        }),
    })
}
const getLotstable = async (req, res) => {
    const {
        customer,
        stage,
        device,
        site,
        tester,
        program,
        duration,
        daterange,
        timeMode,
        type,
    } = req.query
    const timestamp = Math.floor(new Date().getTime() / 1000)
    const query = {}
    if (customer) {
        query.customer = customer
    }
    if (stage) {
        query.stage = stage
    }
    if (device) {
        query.device = device
    }
    if (site) {
        query.houses = { $in: [site] }
    }
    if (tester) {
        query.testers = { $in: [tester] }
    }
    if (program) {
        query.PGMs = { $in: [program] }
    }
    if (timeMode === 'duration') {
        query.end_time = { $gte: timestamp - duration ?? 86400 }
    } else {
        query.end_time = {
            $gte: daterange[0] / 1000,
            $lte: daterange[1] / 1000,
        }
    }
    console.log(query)
    try {
        let Lots = null
        if (type === 'Lot') {
            Lots = await getLotsTable(query)
        } else if (type === 'OSAT') {
            Lots = await getOsatTable(query)
        }
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.render('success', {
            msg: 'Get Lots success!',
            data: JSON.stringify({
                Lots: Lots,
                date: dateFormat(),
            }),
        })
    } catch (e) {
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.render('error', {
            msg: 'Database occured error!',
            data: JSON.stringify({
                date: dateFormat(),
            }),
        })
    }
}

const getLotInfo = async (req, res) => {
    const { lotid, stage, osatid, mode } = req.query
    if (mode === 'Lot') {
        res.render('success', {
            msg: 'Get Lots success!',
            data: JSON.stringify({
                LotInfo: await getLotInfoById(`${lotid}_${stage}`),
                date: dateFormat(),
            }),
        })
    } else {
        res.render('success', {
            msg: 'Get OSATlots success!',
            data: JSON.stringify({
                LotInfo: await getOSATInfoById(`${osatid}_${stage}`),
                date: dateFormat(),
            }),
        })
    }
}

const getWaferslist = async (req, res) => {
    const { lotid, stage, osatid, mode } = req.query
    const WaferList = await getWafersListByIndex(lotid, stage, osatid, mode)
    // console.log(WaferList)
    res.render('success', {
        msg: 'Get wafers success!',
        data: JSON.stringify({
            WaferList,
            date: dateFormat(),
        }),
    })
}

module.exports = {
    getCustomerlist,
    getStagelist,
    getDevicelist,
    getTesterlist,
    getProgramlist,
    getLotstable,
    getLotInfo,
    getWaferslist,
}
