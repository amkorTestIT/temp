const { Bom } = require('../utils/dbTool/schema/Bom')

const newABomDoc = (BomDoc) => {
    return new Promise((resolve, reject) => {
        const doc = new Bom(BomDoc)
        doc.save()
            .then((bom) => {
                resolve(bom._id)
            })
            .catch((err) => {
                console.log('err' + err)
                reject(false)
            })
    })
}

const insertNewBom = async (bomDoc) => {
    if (bomDoc) {
        const doc = await Bom.insertMany(bomDoc)
    }
}

const findBomList = async (Status, project) =>
    await Bom.find({ Status: Status }, project ? project : {}).lean()

const findBomListById = async (id, project) =>
    await Bom.findById(id, project ? project : {})

const updateBomPgmZip = async (id, update) =>
    await Bom.findOneAndUpdate({ _id: id }, [{ $set: update }])

const updateBomStatus = async(id,nfsReturn) => {
    let DBset
    if(nfsReturn==='true'){
        DBset = {
            $set:{
                'Status': 'pass',
                'NFS_result_response': true
            }
        }
    }else{
        DBset = {
            $set:{
                'Status': 'new',
                'NFS_result_response': false
            },
            $unset:{
                "Pgm_Zip" : "",
                "MP_folder" : "",
                "code" : "",
                "MD5" : ""
            }
        }
    }
    await Bom.findOneAndUpdate({ _id: id }, DBset)
}
    

module.exports = {
    newABomDoc,
    insertNewBom,
    findBomList,
    findBomListById,
    updateBomPgmZip,
    updateBomStatus
}
