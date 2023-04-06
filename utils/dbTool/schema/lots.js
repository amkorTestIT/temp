const mongoose = require('mongoose')
const lotsSchema = mongoose.Schema(
    {
        _id: String,
        Lot_id: String,
        customer: String,
        OSAT_id: String,
        family: String,
        device: String,
        gross_die: Number,
        qty: Number,
        yield: Object,
        bins: Object,
        testers: Array,
        PGMs: Array,
        start_time: Number,
        end_time: Number,
        lead_time: String,
        merged: Number,
        stage: String,
        houses: Object,
        'P/C': Object,
    },
    { versionKey: false }
)
lotsSchema.set('collection', 'Lots')
exports.Lots = mongoose.model('Lots', lotsSchema)
