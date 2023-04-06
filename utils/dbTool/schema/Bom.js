const mongoose = require('mongoose')
const BOMSchema = mongoose.Schema(
    {
        Bom_Number: String,
        Platfrorm: String,
        Customer: String,
        Status: { type: String, default: 'new' },
        Test_Program: String,
        Program_Version: String,
        Target_Device: String,
        Stage: String,
        Step: String,
        SiteMap: String,
        Plant: String,
        NFS_server_account: String,
        Pgm_Zip: String,
        Correlation: String,
        MD5: String,
        code: String,
        MP_folder: String,
        NFS_result_response: { type: Boolean, default: false },
    },
    { versionKey: false }
)
BOMSchema.set('collection', 'Bom')
exports.Bom = mongoose.model('Bom', BOMSchema)
