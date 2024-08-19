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

    
 
    body("name" , "Enter a valid name").isLength({min:3}),
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

router.get("/getuser", fetchuser, async(req,res) => {
  try {
    // Check if the logged-in user is an admin
    // if (req.user.roles !== 'admin') {
    //   return res.status(403).json({ error: 'Access denied: Admins only' });
    // }

    // Fetch all users from the database, excluding passwords
    let users = await UserModel.find().select('-password');  

    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error");
  }
});



// User update //


router.put('/updateUser/:id', [
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Enter a valid password").isLength({ min: 5 })
], async (req, res) => {

  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, email, password, roles } = req.body;

    // Find the user by ID
    let user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Authorization check
    // if (user.id !== req.user.id && req.user.roles !== 'admin') {
    //   return res.status(403).json("Not allowed to update this account");
    // }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (roles) user.roles = roles;

    // Save the updated user
    await user.save();

    success = true;
    res.json({ success, user });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Delete user //


router.delete("/deleteUser/:id", async(req,res)=>{

  

  try {

    

    const userId = req.params.id;

     
    // if (req.user.id !== userId && req.user.roles !== roles.admin) {
    //   return res.status(403).json("Access denied: You can only delete your own account");
    // }

    

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


// Get user activity log
router.get('/userActivity/:id', fetchuser, async (req, res) => {
  try {
    // Check if the logged-in user is an admin
    if (req.user.roles !== roles.admin) {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the activity log of the user
    res.status(200).json(user.activityLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router; 
