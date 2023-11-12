const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,

    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic:{type:String,required:true,default:'http://res.cloudinary.com/dfcrrl0b1/image/upload/v1699465817/hb9htdxc6mweoe2gbl4t.webp'}
  },
  { timestamps: true }
);

const userModel = mongoose.model('User',userSchema)

module.exports = userModel