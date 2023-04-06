const { clientErrorLogSchema } = require('../utils/dbTool/schema/errorlog')

//find all errorlog
const get = async () => await clientErrorLogSchema.find().lean()

//new a errorlog
const post = (errorlog) => {
    return new Promise((resolve, reject) => {
        const doc = new clientErrorLogSchema(errorlog)
        doc.save()
            .then(() => {
                resolve(true)
            })
            .catch((err) => {
                console.log('err' + err)
                reject(false)
            })
    })
}

const del = (_id) =>
    new Promise((resolve) => {
        console.log(_id)
        clientErrorLogSchema.findByIdAndRemove(_id, (err, doc) => {
            if (!err) resolve(true)
            else {
                console.log(doc)
                resolve(false)
            }
        })
    })

module.exports = {
    get,
    post,
    del,
}
