
// const imageUploader = async (req, res) => {
  
//   if(req.files.images){
// console.log("many image here")
//   }
//   try {

//     if(req.files.image){
//       const imageUrl = `http://trans23server-env.eba-q3as37ty.ap-south-1.elasticbeanstalk.com/images/${req.files.image[0].filename}`;
//       res.status(200).json({ success: true, url: imageUrl });
//     }
    
//     if(req.files.images){


//       const imageUrls = req.files.images.map(file => `http://trans23server-env.eba-q3as37ty.ap-south-1.elasticbeanstalk.com/images/${file.filename}`);
//       res.status(200).json({ success: true, urls: imageUrls });


//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// module.exports = {
//   imageUploader,
// };

