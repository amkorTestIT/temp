const { insertNewBom } = require('../models/bom.js')
const { logger } = require('../utils/logger.js')
const fs = require('fs')
const path = require('path')

class BomfileService {
    constructor(Bompath) {
        this._path = Bompath
        this._createNewBom()
    }
    _sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    _createNewBom = async () => {
        try {
            await this._sleep(5000)
            const content = fs
                .readFileSync(this._path, 'utf8')
                .toString()
                .trim()
                .split('\r\n')
            let bomDoc = this._createBomDoc(content)
            insertNewBom(bomDoc)
            this._moveToBackup()
        } catch (e) {
            logger.log('error', `Watcher error: ${e}`)
        }
    }
    _moveToBackup = async () => {
        const afterpath = this._path.replace('newBom', 'backup\\newBom')
        await fs.promises.rename(this._path, afterpath)
        logger.log('info', `Move ${this._path} to ${afterpath}`)
    }
    _createBomDoc = (content) => {
        let result = []
        try {
            const Production_Line = content[1].split(':')[1].replace(/\s/g, '')
            const Plant = content[2].split(':')[1].replace(/\s/g, '')
            const Lot_Type = content[3].split(':')[1].replace(/\s/g, '')
            const Customer = content[4]
                .split(':')[1]
                .split(' ')[0]
                .replace(/\s/g, '')
            const Target_Device = content[5].split(':')[1].replace(/\s/g, '')
            const Bom_Number = path.basename(this._path, '.txt').split('_')[0]
            const Stage =
                Production_Line.indexOf('Probe') + 1
                    ? 'CP'
                    : Production_Line.indexOf('FT') + 1
                    ? 'FT'
                    : ''
            let stepIndex = []

            if (Lot_Type !== 'ProductionLot')
                throw `{${this._path}} Lot_Type is not ProductionLot`
            content.forEach((ele, idx) => {
                if (!(ele.indexOf(':') + 1)) {
                    stepIndex.push(idx)
                }
            })
            stepIndex.push(content.length)
            stepIndex.forEach((ele, idx) => {
                let Test_Program, Program_Version, SiteMap, Platfrorm
                const Step = content[ele]
                if (idx !== stepIndex.length - 1) {
                    let stepContent = content.slice(ele, stepIndex[idx + 1])
                    stepContent.forEach((ele) => {
                        if (ele.indexOf('Test Program') + 1) {
                            Test_Program = ele.split(':')[1].replace(/\s/g, '')
                        }
                        if (ele.indexOf('Version') + 1) {
                            Program_Version = ele
                                .split(':')[1]
                                .replace(/\s/g, '')
                        }
                        if (ele.indexOf('Test Site') + 1) {
                            SiteMap = ele.split(':')[1].replace(/\s/g, '')
                        }
                        if (ele.indexOf('Tester modeler') + 1) {
                            Platfrorm = ele
                                .split(':')[1]
                                .split('-')[0]
                                .replace(/\s/g, '')
                        }
                    })
                    if (Platfrorm !== 'UFLEX') {
                        logger.log(
                            'warn',
                            `Watcher warn: ${this._path} Step ${
                                idx + 1
                            } Platfrorm is not UFLEX`
                        )
                    } else {
                        let bomDoc = {
                            Bom_Number: Bom_Number,
                            Platfrorm: Platfrorm,
                            Customer: Customer,
                            Test_Program: Test_Program,
                            Program_Version: Program_Version,
                            Target_Device: Target_Device,
                            Plant: Plant,
                            Stage: Stage,
                            Step: Step,
                            SiteMap: SiteMap,
                            
                        }
                        result.push(bomDoc)
                    }
                }
            })
            return result
        } catch (e) {
            logger.log('warn', `Watcher warn: ${e}`)
            return
        }
    }
}

module.exports = BomfileService
