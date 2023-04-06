const soapRequest = require('easy-soap-request')
const parseStringPromise = require('xml2js').parseStringPromise

const loginByAmkorAPI = async (account, password) => {
    const url = 'http://10.185.32.237/AMSWebService/AMSWebService.asmx'
    const sampleHeaders = {
        'user-agent': 'sampleTest',
        'Content-Type': 'text/xml; charset=utf-8',
        soapAction: 'http://tempuri.org/VerifyDomainAccount2',
    }
    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <VerifyDomainAccount2 xmlns="http://tempuri.org/">
                <sUserID>${account}</sUserID>
                <sUserPassword>${password}</sUserPassword>
                <iExpireIn15Days>1</iExpireIn15Days>
            </VerifyDomainAccount2>
        </soap:Body>
    </soap:Envelope>`
    try {
        const soapreqData = await new Promise((resolve) => {
            soapRequest({
                url: url,
                headers: sampleHeaders,
                xml: xml,
                timeout: 10000,
            }).then(function (data) {
                resolve(data)
            })
        })
        const parseStrData = await new Promise((resolve, reject) => {
            parseStringPromise(soapreqData['response']['body'])
                .then(function (result) {
                    resolve(
                        result['soap:Envelope']['soap:Body'][0][
                            'VerifyDomainAccount2Response'
                        ][0]['VerifyDomainAccount2Result'][0]
                    )
                })
                .catch(function (err) {
                    reject(err)
                })
        })
        return {
            isError: false,
            isValid: (parseStrData === 'true')?true:false,
        }
    } catch (err) {
        return {
            isError: err,
            isValid: false,
        }
    }
}

module.exports = {
    loginByAmkorAPI,
}
