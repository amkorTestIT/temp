module.exports = () => {
    var privateCounter = 0
    function changeBy(val) {
        if (val === -1) {
            privateCounter = 0
        } else {
            privateCounter += val
        }
    }
    return {
        increment: function () {
            changeBy(1)
        },
        zero: function () {
            changeBy(-1)
        },
        value: function () {
            return privateCounter
        },
    }
}
