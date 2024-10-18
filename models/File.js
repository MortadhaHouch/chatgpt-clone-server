let {model,Schema} = require("mongoose");
let fileSchema = new Schema({
    path:{
        type:String,
        required:true
    },
},{
    timestamps:true
})
module.exports = model("File",fileSchema)