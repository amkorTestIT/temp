const {
    newABomDoc,
    findBomList,
    findBomListById,
    updateBomPgmZip,
    updateBomStatus
} = require('../models/bom.js')
const { codeFormat } = require('../utils/format/date')
const fs = require('fs')
const ftp = require('basic-ftp')
const crypto = require('crypto')
const path = require('path')

class BomService {
    constructor(id) {
        this._id = id
        this._Bom_Number = null
        this._Platfrorm = null
        this._Customer = null
        this._Test_Program = null
        this._Program_Version = null
        this._Target_Device = null
        this._Plant = null
        this._Status = null
        this._Stage = null
        this._Step = null
        this._SiteMap = null
        this._UserEmail = null
    }
    get UserEmail(){
        return this._UserEmail
    }

    set UserEmail(value){
        this._UserEmail = value.match(/^(.*?)@/)[1]
    }
    _createMD5(string) {
        return crypto
            .createHash('md5')
            .update(string)
            .digest('hex')
            .toUpperCase()
    }
    _counter() {
        IssueCounter.increment()
        // console.log(IssueCounter.value())
        return IssueCounter.value().toString()
    }
    async _init() {
        const {
            Bom_Number,
            Platfrorm,
            Customer,
            Test_Program,
            Program_Version,
            Target_Device,
            Plant,
            Status,
            Stage,
            Step,
            SiteMap,
        } = await this.getBom()
        this._Bom_Number = Bom_Number
        this._Platfrorm = Platfrorm
        this._Customer = Customer
        this._Test_Program = Test_Program
        this._Program_Version = Program_Version
        this._Target_Device = Target_Device
        this._Plant = Plant
        this._Status = Status
        this._Stage = Stage
        this._Step = Step
        this._SiteMap = SiteMap
    }
    async createBom(bom) {
        return await newABomDoc(bom)
    }
    async getBom() {
        return await findBomListById(this._id, { _id: 0 })
    }
    _getFtpIp = () => {
        if (this._Plant === 'T1') {
            return '10.185.30.183'
        } else if (this._Plant === 'T3') {
            return '10.185.56.28'
        } else if (this._Plant === 'T6') {
            return '10.185.137.28'
        } else {
            return
        }
    }

    updateBom = (isCorrelation, zipFilename) => 
        new Promise(async (resolve, reject) => {
            if (isCorrelation === 'true' && this._Status === 'new') {
                const counter = this._counter()
                const code = `${codeFormat()}${(`000` + counter).substr(-3)}`
                const MP_folder = `/${this._Stage}/${this._Platfrorm}/${this._Customer}/${code}/${zipFilename}`
                const updatedoc = await updateBomPgmZip(this._id, {
                    Status: 'waiting',
                    Pgm_Zip: zipFilename,
                    MP_folder: MP_folder,
                    code: code,
                    MD5: this._createMD5(
                        `${this._Platfrorm}\t${this._Customer}
                        \t${this._Test_Program}\t${this._Program_Version}
                        \t${this._Target_Device}\t${this._Stage}
                        \t${this._Step}\t${this._SiteMap}`
                    ),
                })
                const corrTest_Progrm = `${this._Test_Program}_corr`
                const corrCounter = this._counter()
                const corrcode = `${codeFormat()}${(`000` + corrCounter).substr(-3)}`
                const corrMP_folder = `/${this._Stage}/${this._Platfrorm}/${this._Customer}/${corrcode}/${zipFilename}`
                const newDocId = await this.createBom({
                    Bom_Number: this._Bom_Number,
                    Platfrorm: this._Platfrorm,
                    Customer: this._Customer,
                    Test_Program: corrTest_Progrm,
                    Program_Version: this._Program_Version,
                    Target_Device: this._Target_Device,
                    Plant: this._Plant,
                    Stage: this._Stage,
                    Step: this._Step,
                    SiteMap: this._SiteMap,
                    Status: 'waiting',
                    Pgm_Zip: zipFilename,
                    MP_folder: corrMP_folder,
                    code: corrcode,
                    MD5: this._createMD5(
                        `${this._Platfrorm}\t${this._Customer}
                        \t${corrTest_Progrm}\t${this._Program_Version}
                        \t${this._Target_Device}\t${this._Stage}
                        \t${this._Step}\t${this._SiteMap}`
                    ),
                })
                const progress1 = this._createAplTempIni()
                const progress2 = this._createTestProgramCodeTxt(
                    corrTest_Progrm,
                    corrcode,
                    zipFilename,
                    newDocId
                )
                const progress3 = this._createTestProgramCodeTxt(
                    this._Test_Program,
                    code,
                    zipFilename
                )
                Promise.all([
                    // newdoc,
                    updatedoc,
                    progress1,
                    progress2,
                    progress3,
                ])
                    .then(() => {
                        resolve('YAYAYA')
                    })
                    .catch((error) => {
                        reject(error)
                    })
            } else if (isCorrelation === 'false' && this._Status === 'new') {
                const counter = this._counter()
                const code = `${codeFormat()}${(`000` + counter).substr(-3)}`
                const MP_folder = `/${this._Stage}/${this._Platfrorm}/${this._Customer}/${code}/${zipFilename}`
                const updatedoc = updateBomPgmZip(this._id, {
                    Status: 'waiting',
                    Pgm_Zip: zipFilename,
                    MP_folder: MP_folder,
                    code: code,
                    MD5: this._createMD5(
                        `${this._Platfrorm}\t${this._Customer}
                        \t${this._Test_Program}\t${this._Program_Version}
                        \t${this._Target_Device}\t${this._Stage}
                        \t${this._Step}\t${this._SiteMap}`
                    ),
                })
                const progress1 = this._createAplTempIni()
                const progress2 = this._createTestProgramCodeTxt(
                    this._Test_Program,
                    code,
                    zipFilename
                )

                Promise.all([updatedoc, progress1, progress2])
                    .then(() => {
                        resolve('YAYAYA')
                    })
                    .catch((error) => {
                        reject(error)
                    })
            } else {
                reject(
                    `isCorrelation is ${isCorrelation}, Status is ${this._Status}`
                )
            }
        })
    
    _createAplServiceIni() {
        return new Promise(async (resolve, reject) => {
            const ftpIP = this._getFtpIp()
            let client
            try {
                const bomlist = await findBomList('pass', {
                    Status: 0,
                    _id: 0,
                })
                let data = ''
                bomlist.forEach((bom) => {
                    data += `${Object.values(bom).join()}\n`
                })
                const iniPath = path.join(
                    __dirname,
                    '..',
                    'files',
                    'apl',
                    'Aplservice.ini'
                )
                fs.writeFileSync(iniPath, data)

                client = new ftp.Client()
                client.ftp.verbose = false

                await client.access({
                    host: ftpIP,
                    user: 'tprel',
                    password: 'tprel',
                    secure: false,
                })
                await client.cd('.config')
                await client.uploadFrom(iniPath, 'Aplservice.ini')
                resolve()
            } catch (e) {
                console.log(e)
                reject()
            }
            client.close()
        })
    }
    _createTestProgramCodeTxt(Test_Program, code, zipFilename,newDocId) {
        return new Promise(async (resolve, reject) => {
            const ftpIP = this._getFtpIp()
            const filename = `${Test_Program}_${code}_${(newDocId)?newDocId:this._id}_${this._UserEmail}.txt`
            const scriptPath = path.join(
                __dirname,
                '..',
                'files',
                'nfs',
                filename
            )
            fs.writeFileSync(scriptPath, zipFilename)
            const client = new ftp.Client()
            client.ftp.verbose = false
            try {
                await client.access({
                    host: ftpIP,
                    user: 'tprel',
                    password: 'tprel',
                    secure: false,
                })
                await client.cd('.script')
                await client.uploadFrom(scriptPath, filename)
                fs.unlinkSync(scriptPath)
                resolve()
            } catch (e) {
                reject(e)
            }
            client.close()
        })
    }

    updateBomStatusFromNFS = async(nfsCode, nfsReturn) =>{
        try{
            const { code, Plant, Status } = await this.getBom()
            this._Plant = Plant
            const nfsReturn_lowercase = nfsReturn.toLowerCase().trim()
            if(!(nfsReturn_lowercase === 'true' || nfsReturn_lowercase === 'false')){
                throw {msg: 'NFSReturn 參數錯誤，請重新輸入', status: 402, doc: null}
            }
            if(Status === 'pass'){
                throw {msg: '此record已被更新', status: 403, doc: null}
            }
            if(nfsCode === code){
                await updateBomStatus(this._id,nfsReturn_lowercase)
                const doc = await this.getBom()
                await this._createAplServiceIni()
                return {
                    status: 200,
                    msg: 'Success!',
                    doc: doc
                }
            }else{
                throw {msg: 'Code 無法配對！', status: 404, doc: null}
            }
        }catch(error){
            return error
        }
    }
    _createAplTempIni() {
        return new Promise(async (resolve, reject) => {
            const ftpIP = this._getFtpIp()
            let client
            try {
                const bomlist = await findBomList('waiting', {
                    Status: 0,
                    _id: 0,
                })
                let data = ''
                bomlist.forEach((bom) => {
                    data += `${Object.values(bom).join()}\n`
                })
                const iniPath = path.join(
                    __dirname,
                    '..',
                    'files',
                    'apl',
                    'aplTemp.ini'
                )
                fs.writeFileSync(iniPath, data)

                client = new ftp.Client()
                client.ftp.verbose = false

                await client.access({
                    host: ftpIP,
                    user: 'tprel',
                    password: 'tprel',
                    secure: false,
                })
                await client.cd('.msg')
                await client.uploadFrom(iniPath, 'aplTemp.ini')
                resolve()
            } catch (e) {
                console.log(e)
                reject()
            }
            client.close()
        })
    }
}

module.exports = BomService
