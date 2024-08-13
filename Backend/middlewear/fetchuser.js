require('dotenv').config()
const jwt = require('jsonwebtoken');

const fetchuser = (req,res,next) => {
  
const token = req.header("auth-token");

if (!token) {

    return res.status(401).send("Please enter correct token");
    
}

try {

 const data = jwt.verify(token,process.env.JWT_SECRET)

req.user = data.user;

next();

} catch (error) {

    return res.status(401).send("Please enter correct token");
    
}






}

module.exports = fetchuser;
