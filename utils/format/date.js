const dayjs = require('dayjs')
const dateFormat = () =>
    dayjs(Date.now()).locale('zh-tw').format('YYYY-MM-DD HH:mm:ss')
const codeFormat = () => dayjs(Date.now()).locale('zh-tw').format('YYMMDD')

module.exports = {
    dateFormat,
    codeFormat,
}
