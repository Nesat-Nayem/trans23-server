const jwt = require("jsonwebtoken");
const AdminUser = require("../models/adminModel");



const checkUser = (req, res, next) => {
  const { authorization, userid, secret } = req.headers;
  // const {userId} = req.headers;
  console.log("header id",userid)
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const decoded = jwt.verify(token, secret);
    console.log("decoded id",decoded.userId)

    if (decoded.userId !== userid) {
      return res.status(403).json({ message: "You are not authorized to access this resource" });
    }

    next();
  } catch (error) {
    next("Please Log In");
  }
};

const checkAdmin = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    const token = authorization.split(" ")[1];
    if (!token) return res.sendStatus(401); // no token provided

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    if (!decoded.role || decoded.role !== "admin") {
      return res.sendStatus(401); // not authorized to access admin APIs
    }

    // Add decoded user object to request object, so that it can be accessed by the next middleware
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    next("unauthorized");
  }
};

module.exports = { checkUser, checkAdmin };
