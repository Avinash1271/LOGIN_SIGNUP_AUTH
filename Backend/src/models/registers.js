const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");

const myschema = new mongoose.Schema({
    firstName : {
        type:String,
        required:true
    },
    lastName : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    gender : {
        type:String,
        required:true
    },
    password : {
        type:String,
        required:true
    },
    confirmPassword : {
        type:String,
        required:true
    },

});


myschema.pre("save",async function(next){
    if(this.isModified("password")){
        console.log(`current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password,10);
        console.log(`current password is ${this.password}`);

        this.confirmPassword = undefined;
    }
    next();
})


// creating collections
const Register = new mongoose.model("Register",myschema);

module.exports = Register;
