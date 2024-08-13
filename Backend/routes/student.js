const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const router = express.Router();
const fetchuser = require ('../middlewear/fetchuser')
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const UserModel = require("../model/UserModel")
const { roles } = require("../utils/constant");


// Student Register //

router.post("/register",[

    
 
    body("name" , "Enter a valid name").isLength({min:5}),
    body("email" , "Enter a valid email").isEmail(),
    body("password" , "Enter a valid password").isLength({min:5})

], async(req,res)=>{

  let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

      let user = await UserModel.findOne({email:req.body.email})

      if (user) {

        return res.status(409).json("This email is already exist");
        
      }

      const salt = await bcrypt.genSalt(10);
      const hashpass = await bcrypt.hash(req.body.password, salt);

      const userRole = (req.body.email === process.env.ADMIN_EMAIL) ? roles.admin : roles.student;


    user = await UserModel.create({

        name : req.body.name,
        email : req.body.email,
        password :hashpass,
        roles : userRole
      });


      const data = {

         user: {

        id : user.id,
        roles : user.roles
        
      }
    }


    const authtoken = jwt.sign( data, process.env.JWT_SECRET);
    success = true;

    res.json({success,authtoken,user: data.user})

        
    } catch (error) {

      console.error(error.message)

      return res.status(500).send("Internel server error")

        
    }
      
  

}); 


// login //


router.post("/login",[
 
  body("email" , "Enter a valid email").isEmail(),
  body("password" , "Enter a valid password").isLength({min:5})

], async(req,res)=>{

  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password} = req.body;


  try {

    let user = await UserModel.findOne({email})

    if (!user) {

      return res.status(401).json("Enter with correct credentials");
      
    }


    const ComparePassword = await bcrypt.compare(password , user.password)


    if (!ComparePassword) {

      return res.status(401).json("Enter with correct credentials");
      
    }

    
    const userRole = (req.body.email === process.env.ADMIN_EMAIL) ? roles.admin : roles.student;
  

    const data = {

       user: {

      id : user.id,
      roles : userRole
      
    }
  }


  const authtoken = jwt.sign( data, process.env.JWT_SECRET);
 success = true;
  res.json({success,authtoken, user: data.user})

      
  } catch (error) {

    console.error(error.message)

    return res.status(500).send("Internel server error")

      
  }
  


});

// get user //

router.get("/getuser", fetchuser, async(req,res)=>{



  try {

    userId = req.user.id

    let user = await UserModel.findById(userId).select('-password')  

    res.send (user)
      
  } catch (error) {

    console.error(error.message)

    return res.status(500).send("Internel server error")

      
  }

  

});


// User update //


router.put("/updateUser/:id", [

  body("name" , "Enter a valid name").isLength({min:5}),
  body("email" , "Enter a valid email").isEmail(),
  body("password", "Enter a valid password").isLength({min:5})


], async(req,res)=>{

  const error = validationResult(req);
  if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
  }

  try {

    const { name, email, password } = req.body;

    if ( !name || !email || !password) {
        return res.status(400).json("Send all required fields: title, author, publishYear, imagePath, price");
    }

    const userId = req.params.id;

    const updatedUser = {}

    let existingUser = await UserModel.findById(userId);

    if (!existingUser) {
        return res.status(404).json("User not found");
    }


  if  (name)  {updatedUser.name = name}
  if  (email)  {updatedUser.email = email}
  if  (password)  {updatedUser.password = password}
  
    existingUser = await UserModel.findByIdAndUpdate(userId,{$set: updatedUser , new:true})

    res.json({existingUser}); 
      
  } catch (error) {

    console.error(error.message)

    return res.status(500).send("Internel server error")

      
  }

  

});


// Delete user //


router.delete("/deleteUser/:id", async(req,res)=>{

  

  try {

    

    const userId = req.params.id;

    

    let existingUser = await UserModel.findById(userId);

    if (!existingUser) {
        return res.status(404).json("User not found");
    }


    existingUser = await UserModel.findByIdAndDelete(userId)

    res.json({existingUser}); 
      
  } catch (error) {

    console.error(error.message)

    return res.status(500).send("Internel server error")

      
  }

  

});



module.exports = router; 
