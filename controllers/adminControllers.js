const AdminUser = require("../models/adminModel");
const jwt = require('jsonwebtoken');
// const { FieldValueInstance } = require("twilio/lib/rest/autopilot/v1/assistant/fieldType/fieldValue");

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
// const maxAge = 5;
const createToken = (id) => {
  return jwt.sign({ id }, 'trans secrect', {
    expiresIn: maxAge
  });
};

// controller actions
// module.exports.signup_get = (req, res) => {
//   res.render('signup');
// }

// module.exports.login_get = (req, res) => {
//   res.render('login');
// }

module.exports.signup_post = async (req, res) => {
  const { email, password, name, img } = req.body;

  try {
    const user = await AdminUser.create({ email, password, name, img });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, sameSite: "None",  secure: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id,token: token });
  }
  
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

// module.exports.login_post = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // console.log("hit it")
//     const user = await AdminUser.login(email, password);
//     console.log("role",user.role)
//     // const token = createToken(user._id);
//     const token = jwt.sign({ email: user.email, role:user.role }, process.env.JWT_SECRET, {expiresIn:"7d"});

//     // res.cookie('jwt', token  );
//     // res.cookie('image', user.img);
//     // res.cookie('name', user.name);
//     // res.cookie('email', user.email);
//     res.status(200).json({ user: user,token});
//   } 
//   catch (err) {
//     const errors = handleErrors(err);
//     res.status(400).json({ errors });
//   }

// }


module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await AdminUser.login(email, password);
    // console.log("role",user.role)

    const token = jwt.sign({ email: user.email, role:user.role }, process.env.JWT_SECRET);


    res.status(200).json({ token: token});

        // Set the token in the browser's local storage
        // res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}