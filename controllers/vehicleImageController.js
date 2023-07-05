// const vehicleImageUploader = async (req, res) => {
//   console.log("many image here");

//   try {
//     const imageUrl = `http://trans23server-env.eba-q3as37ty.ap-south-1.elasticbeanstalk.com/images/${req.files.image[0].filename}`;
//     res.status(200).json({ success: true, data: imageUrl });


//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// module.exports = {
//   vehicleImageUploader,
// };


const vehicleImageUploader = async (req, res) => {
    try {
      const data = {};
      if (req.files.nid) {
        data.nid = `http://trans23server-env.eba-q3as37ty.ap-south-1.elasticbeanstalk.com/images/${req.files.nid[0].filename}`;
      }
      if (req.files.insurance) {
        data.insurance = `http://trans23server-env.eba-q3as37ty.ap-south-1.elasticbeanstalk.com/images/${req.files.insurance[0].filename}`;
      }
      if (req.files.RC) {
        data.RC = `http://trans23server-env.eba-q3as37ty.ap-south-1.elasticbeanstalk.com/images/${req.files.RC[0].filename}`;
      }
      if (req.files.front) {
        data.front = `http://trans23server-env.eba-q3as37ty.ap-south-1.elasticbeanstalk.com/images/${req.files.front[0].filename}`;
      }
      if (req.files.rear) {
        data.rear = `http://trans23server-env.eba-q3as37ty.ap-south-1.elasticbeanstalk.com/images/${req.files.rear[0].filename}`;
      }
      if (req.files.left) {
        data.left = `http://trans23server-env.eba-q3as37ty.ap-south-1.elasticbeanstalk.com/images/${req.files.left[0].filename}`;
      }
      if (req.files.right) {
        data.right = `http://trans23server-env.eba-q3as37ty.ap-south-1.elasticbeanstalk.com/images/${req.files.right[0].filename}`;
      }
      if (req.files.extra) {
        data.extra = req.files.extra.map(file => `http://trans23server-env.eba-q3as37ty.ap-south-1.elasticbeanstalk.com/images/${file.filename}`);
      }
      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  module.exports = {
  vehicleImageUploader,
};