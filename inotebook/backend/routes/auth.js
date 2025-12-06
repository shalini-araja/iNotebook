const express = require("express");
const User = require("../models/User");
const fetchUser=require('../middleWare/fetchUser');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "shaluisagood$girl";

const { body, validationResult } = require("express-validator");

//route 1 for creating user
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success , errors: errors.array() });
    }

   // console.log("Incoming Data:", req.body);
    
    try {
       let user=await User.findOne({email:req.body.email});
       if(user){
        return res.status(400).json({success,error:"Sorry a user is already exists"})
       }

      const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password.toString(), salt);

    //create a new user 
       user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      success=true;
      res.json({success,authToken});
    } catch (error) {
      console.error("Error creating user:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//route 2 for logging in
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      console.log("User found:", user); // <-- check if user exists
      if (!user) {
        success=false;
        return res
          .status(400)
          .json({ success, error: "please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      console.log("Password match:", passwordCompare); // <-- check password match
      if (!passwordCompare) {
        success=false;
        return res
          .status(400)
          .json({ success,error: "please try to login with correct credentials" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(payload, JWT_SECRET);
      success=true;
      res.json({success, token });
    } catch (error) {
      console.error("Error logging user:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//route 3 get logged in user details;
router.post("/getUser", fetchUser,async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); //select all except password
    res.send(user);
  } catch (err) {
    res.status(500).send("internal servererror");
  }
});

module.exports = router;
