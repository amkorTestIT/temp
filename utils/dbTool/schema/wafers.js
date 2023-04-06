const mongoose = require('mongoose')
const stdfSchema = new mongoose.Schema(
    {
        _id:String,
        yield:Object,
        MIR:Object,
        SDR:Object,
        WIR:Object,
        WRR:Object,
        MRR:Object, 
        bins:Object, 
        site_sum:Object,
        site_swap:Object,
        coords:Object,
        MapImg:Object,
        stdf_name:Object,
        _osatid:String
    },
    {versionKey:false}
)

stdfSchema.set('collection','STDF')
exports.Wafers = mongoose.model('STDF', stdfSchema)