let {model,Schema} = require("mongoose")
let bcrypt = require("bcrypt")
let userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    discussions:{
        type:[Schema.Types.ObjectId],
    },
    avatars:{
        type:[Schema.Types.ObjectId],
    }
},{
    timestamps:true
})
userSchema.pre("save",async function(){
    if(this.isNew || this.isModified("password")){
        let hash = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(this.password,hash);
        this.password = hashedPassword;
    }
})
module.exports = model("User",userSchema)