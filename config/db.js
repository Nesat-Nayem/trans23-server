require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Encode your username and password using percent encoding
    const username = encodeURIComponent(process.env.DBUSER);
    const password = encodeURIComponent(process.env.DBPASS);

    // Use the mongodb+srv format with the encoded username and password
    const uri = `mongodb+srv://${username}:${password}@cluster0.hty68.mongodb.net/trans23?retryWrites=true&w=majority&ssl=true`;

    // Use the connect method of mongoose to connect to the database
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("database connected");
  } catch(error) {
    console.error(error.message);
  }
};

module.exports = connectDB;
