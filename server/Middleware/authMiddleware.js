const jwt = require('jsonwebtoken')
const user = require('../Models/userModel')
const Protect = async (req, res, next) => {
   let token;
   const jwtKey = process.env.JWT_SECRET;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
         
         token = req.headers.authorization.split(' ')[1];
         
         const decode = jwt.verify(token,jwtKey);
        
         req.user = await user.findById(decode.id).select('-password');
         next();
      } catch (error) {
         console.error(error); // Add detailed logging for errors
         if (error.name === 'JsonWebTokenError') {
            res.status(401).send('Invalid token');
         } else {
            res.status(500).send('Internal server error');
         }
      }
   } else {
      res.status(401).send('Authorization header not found');
   }
};

module.exports = {Protect};
