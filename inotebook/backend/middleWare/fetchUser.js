const jwt = require("jsonwebtoken");
const JWT_SECRET = "shaluisagood$girl";
const fetchUser = (req,res,next) => {
  //get the user from jwt token and ad id to req object
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)//acess denied
      .send({ error: "please authenticate using avalid token" });
  }
  try {
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
  }

};
module.exports = fetchUser;
