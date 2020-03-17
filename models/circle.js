const mongoose = require('mongoose');


const intrestsSchema = new mongoose.Schema({

    name: {type: String},
    users:[{ type: mongoose.Schema.Types.ObjectId , ref:'User' }],
    created_by:{ type: mongoose.Schema.Types.ObjectId , ref:'User' },
    invite_code:{type:String}
    
}
,
{timestamps: true}
);



module.exports = mongoose.model('Circle', intrestsSchema);