import  mongoose from "mongoose";
import { hash, compareHashes } from "../lib/crypto.js"


const {Schema, model} = mongoose;

const unique = true;
const required=true;

const LoginSchema = new Schema({
    email:{type:String, unique, required},
    password:{type:String}
})

const addressSchema = new Schema({
    street:{type:String, required},
    houseNumber:{type:Number},
    zip:{type:Number},
    city:{type:String, required},
    country:{type:String, required},
})

const userSchema = new Schema({
    loginInfo:{type:LoginSchema},
    role:{type:String, enum:["host", "user"]},
    firstName:{type:String},
    lastName:{type:String},
    gender:{type:String, enum:["Male","Female","Other"]},
    dateOfBirth:{type:Date},
    phoneNumbers:{type:String},
    govermentId:{type:String},
    address:{type:addressSchema},
    interests:{type:[String]},
    reasonForHosting:{type:String},
    houses:{type:[Schema.Types.ObjectId],ref:"house"},
    reviews:{type:[Schema.Types.ObjectId],ref:"review"},
    chats:{type:[Schema.Types.ObjectId],ref:"chat"}
})

// userSchema.statics.register = async function(data) {
//     console.log("this is from Model" + data)
//     console.log(data.password)
//     const hashed = await hash(data.password)
//     data.password = hashed

//     return User.create(data)
// }
const User = model("user",userSchema);

export default User;