const mongoose = require("mongoose");

const STSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    is_admin:{
        type:Number,
        required:false
    },
    is_varified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    },
    role:{
        type:String,
        enum:['admin','donor','employee','medic','support'],
        default: 'support'
    }
});

const UserTroubleSchema = new mongoose.Schema({
    user: {
        type: String, 
        required: true
    }, 
    trouble: {
        type: String, 
        required: true
    }
});

const ST = mongoose.model("supportTeam", STSchema);
const UserTrouble = mongoose.model("userfeedback", UserTroubleSchema);

module.exports = { ST, UserTrouble };