const { Lots } = require('../utils/dbTool/schema/lots.js')

const getCustomerList = async () => {
    return await Lots.aggregate([
        { $group: { _id: '$customer' } },
        { $sort: { _id: 1 } },
    ])
}

const getStageList = async (customer) => {
    return await Lots.aggregate([
        { $match: { customer: customer } },
        { $group: { _id: '$stage' } },
    ])
}

const getDeviceList = async (customer, stage) => {
    const query = {}
    if (stage) query.stage = stage
    query.customer = customer
    return await Lots.aggregate([
        { $match: query },
        {
            $group: {
                _id: '$customer',
                device: { $addToSet: '$device' },
            },
        },
        // { $sort: { _id: 1 } },
    ])
}
const getTesterList = async (customer, stage, device) => {
    const query = {}
    if (stage) query.stage = stage
    if (device) query.device = device
    query.customer = customer
    return await Lots.aggregate([
        { $match: query },
        {
            $group: {
                _id: '$customer',
                testers: { $addToSet: '$testers' },
            },
        },
        {
            $unwind: '$testers',
        },
        {
            $unwind: '$testers',
        },
        {
            $group: {
                _id: '$_id',
                testers: {
                    $addToSet: '$testers',
                },
            },
        },
    ])
}
const getProgramList = async (customer, stage, device) => {
    const query = {}
    if (stage) query.stage = stage
    if (device) query.device = device
    query.customer = customer
    return await Lots.aggregate([
        { $match: query },
        {
            $group: {
                _id: '$customer',
                PGMs: { $addToSet: '$PGMs' },
            },
        },
        {
            $unwind: '$PGMs',
        },
        {
            $unwind: '$PGMs',
        },
        {
            $group: {
                _id: '$_id',
                programs: {
                    $addToSet: '$PGMs',
                },
            },
        },
    ])
}

const getLotsTable = async (query) => await Lots.find(query)

const getLotInfoById = async (_id) => await Lots.findById(_id)

module.exports = {
    getCustomerList,
    getStageList,
    getDeviceList,
    getTesterList,
    getProgramList,
    getLotsTable,
    getLotInfoById,
}
