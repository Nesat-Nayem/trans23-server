function errorHandler(err, req, res, next) {
  if (err.headerSent) {
    return next();
  }
  res.status(500).send({
    //  error: err

    success: false,
    message: err,
    data: {}
    
    });
}

// Define handleErrors function
const handleErrors = (err) => {
  // Create an empty errors object
  let errors = {};

  // Check if the error is a custom error from login method
  if (err.message === 'incorrect email' || err.message === 'incorrect password') {
    // Set the email or password field to the error message
    errors[err.message.split(' ')[0]] = err.message;
  }

  // Check if the error is a validation error from mongoose
  if (err.name === 'ValidationError') {
    // Loop through the error properties and set the corresponding fields to the error messages
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  // Return the errors object
  return errors;
};


module.exports = { errorHandler, handleErrors };



