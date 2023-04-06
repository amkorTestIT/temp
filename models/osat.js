const { Osat } = require('../utils/dbTool/schema/osat.js')

const getOsatTable = async (query) => await Osat.find(query)
const getOSATInfoById = async(_id) =>  await Osat.findById(_id)


module.exports = {
    getOsatTable,
    getOSATInfoById
}
