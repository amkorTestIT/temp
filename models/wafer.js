const { Wafers } = require('../utils/dbTool/schema/wafers.js')

const getWafersListByIndex = async (lotid, stage, osatid, mode) => {
    const waferQuery = {}
    if (mode === 'Lot') {
        waferQuery['MIR.LOT_ID'] = lotid
        waferQuery['MIR.TEST_COD'] = stage
    } else {
        waferQuery['MIR.LOT_ID'] = lotid
        waferQuery['MIR.TEST_COD'] = stage
        waferQuery['MIR.FLOOR_ID'] = osatid
    }
    return await Wafers.aggregate([
        {
            $match: waferQuery,
        },
        {
            $project: {
                length: { $size: '$yield' },
                _id: 1,
                _osatid: 1,
                yield: { $arrayElemAt: ['$yield', -1] },
                bins: { $arrayElemAt: ['$bins', -1] },
                //   site_sum: { $arrayElemAt: [ "$site_sum", -1 ] },
                MIR: { $arrayElemAt: ['$MIR', -1] },
                SDR: { $arrayElemAt: ['$SDR', -1] },
                WIR: { $arrayElemAt: ['$WIR', -1] },
                //   WRR: { $arrayElemAt: [ "$WRR", -1 ] },
                MRR: { $arrayElemAt: ['$MRR', -1] },
                MapImg: { $arrayElemAt: ['$MapImg', -1] },
                site_swap: { $arrayElemAt: ['$site_swap', -1] },
            },
        },
        {
            $sort: {
                'WIR.WAFER_ID': 1,
            },
        },
    ])
}
const getWafersPageByIndex = async (lotid, stage, osatid, mode) => {
    const waferQuery = {}
    if (mode === 'Lot') {
        waferQuery['MIR.LOT_ID'] = lotid
        waferQuery['MIR.TEST_COD'] = stage
    } else {
        waferQuery['MIR.LOT_ID'] = lotid
        waferQuery['MIR.FLOOR_ID'] = osatid
        waferQuery['MIR.TEST_COD'] = stage
    }

    return await Wafers.aggregate([
        { $match: waferQuery },
        {
            $project: {
                _id: 0,
                wafer_id: { $arrayElemAt: ['$WIR.WAFER_ID', 0] },
                last: { $toInt: { $subtract: [{ $size: '$yield' }, 1] } },
            },
        },
        { $sort: { wafer_id: 1 } },
    ])
}

const getWaferInfoById = async (lotid, waferid, stage, rtnum) => {
    const id = `${lotid}_${waferid}_${stage}`
    rtnum = parseInt(rtnum)
    return await Wafers.aggregate([
        {
            $match: {
                _id: id,
            },
        },
        {
            $project: {
                _id: 1,
                _osatid: 1,
                yield: { $arrayElemAt: ['$yield', rtnum] },
                MIR: { $arrayElemAt: ['$MIR', rtnum] },
                SDR: { $arrayElemAt: ['$SDR', rtnum] },
                WIR: { $arrayElemAt: ['$WIR', rtnum] },
                WRR: { $arrayElemAt: ['$WRR', rtnum] },
                bins: { $arrayElemAt: ['$bins', rtnum] },
                site_sum: { $arrayElemAt: ['$site_sum', rtnum] },
                site_swap: { $arrayElemAt: ['$site_swap', rtnum] },
                MRR: { $arrayElemAt: ['$MRR', rtnum] },
                stdf_name: { $arrayElemAt: ['$stdf_name', rtnum] },
                MapImg: { $arrayElemAt: ['$MapImg', rtnum] },
            },
        },
    ])
}

const getWaferCoordsById = async (lotid, waferid, stage, rtnum) => {
    const id = `${lotid}_${waferid}_${stage}`
    rtnum = parseInt(rtnum)
    return await Wafers.aggregate([
        {
            $match: {
                _id: id,
            },
        },
        {
            $project: {
                _id: 1,
                _osatid: 1,
                coords: { $arrayElemAt: ['$coords', rtnum] },
            },
        },
    ])
}
const getWafersMapByIndex = async (lotid, stage, osatid, mode) => {
    const waferQuery = {}
    if (mode === 'Lot') {
        waferQuery['MIR.LOT_ID'] = lotid
        waferQuery['MIR.TEST_COD'] = stage
    } else {
        waferQuery['MIR.LOT_ID'] = lotid
        waferQuery['MIR.FLOOR_ID'] = osatid
        waferQuery['MIR.TEST_COD'] = stage
    }

    return await Wafers.aggregate([
        { $match: waferQuery },
        {
            $project: {
                _id: 1,
                yield: { $arrayElemAt: ['$yield.final', -1] },
                lot_id: { $arrayElemAt: ['$MIR.LOT_ID', 0] },
                osat_id: { $arrayElemAt: ['$MIR.FLOOR_ID', 0] },
                stage: { $arrayElemAt: ['$MIR.TEST_COD', 0] },
                wafer_id: { $arrayElemAt: ['$WIR.WAFER_ID', 0] },
                MapImg: { $arrayElemAt: ['$MapImg', -1] },
                last: { $toInt: { $subtract: [{ $size: '$yield' }, 1] } },
            },
        },
        { $sort: { wafer_id: 1 } },
    ])
}
module.exports = {
    getWafersListByIndex,
    getWafersPageByIndex,
    getWaferInfoById,
    getWaferCoordsById,
    getWafersMapByIndex,
}
