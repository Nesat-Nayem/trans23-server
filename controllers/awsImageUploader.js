const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")

const crypto = require("node:crypto")

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
})


const singleImageUploadS3 = async (req, res) => {

    console.log("body data", req.body)
    console.log("file data", req.file)
    const imagename = randomImageName();
    const params = {
        Bucket: bucketName,
        Key: imagename,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }

    const command = new PutObjectCommand(params)

    await s3.send(command)

    res.json({
        success: true,
        data: {
            imageurl: `https://trans-all-files.s3.ap-south-1.amazonaws.com/${imagename}`

        }

    })
}

// const singleImageUploadS3 = async (req, res) => {
//     console.log("body data", req.body);
//     console.log("files data", req.files);
  
//     let response = {
//       success: true,
//       data: {},
//     };
  
//     try {
//       for (let uploadField in req.files) {
//         let file = req.files[uploadField][0]; // Assuming each field has only one file
//         let imageName = randomImageName(); // Generate a unique name for the image
//         const params = {
//           Bucket: bucketName,
//           Key: imageName,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//         };
  
//         // Upload the file to S3
//         await s3.send(new PutObjectCommand(params));
  
//         // Generate the URL for the uploaded file
//         const url = `https://your-bucket-name.s3.amazonaws.com/${imageName}`;
//         response.data[uploadField] = url;
//       }
  
//       res.json(response);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         success: false,
//         message: "Something went wrong while uploading images",
//       });
//     }
//   };

// const miltipleImageUploadS3 = async (req, res) => {
//     console.log("body data", req.body)
//     console.log("files data", req.files)

//     let response = {
//         success: true,
//         data: {}
//     }

//     for (let uploadField in req.files) {
//         let files = req.files[uploadField];
//         let urls = [];

//         for (let i = 0; i < files.length; i++) {
//             let file = files[i];
//             const imagename = randomImageName();
//             const params = {
//                 Bucket: bucketName,
//                 Key: imagename,
//                 Body: file.buffer,
//                 ContentType: file.mimetype
//             }

//             const command = new PutObjectCommand(params)

//             await s3.send(command)

//             urls.push(`https://trans-all-files.s3.ap-south-1.amazonaws.com/${imagename}`);
//         }

//         // If there's only one file, we don't need to return an array
//         if (urls.length === 1) {
//             response.data[uploadField] = urls[0];
//         } else {
//             response.data[uploadField] = urls;
//         }
//     }

//     res.json(response)
// }

// const miltipleImageUploadS3 = async (req, res) => {
//     console.log("body data", req.body)
//     console.log("files data", req.files)

//     let response = {
//         success: true,
//         data: {}
//     }

//     for (let uploadField in req.files) {
//         let files = req.files[uploadField];
//         let urls = [];

//         for (let i = 0; i < files.length; i++) {
//             let file = files[i];
//             const imagename = randomImageName();
//             const params = {
//                 Bucket: bucketName,
//                 Key: imagename,
//                 Body: file.buffer,
//                 ContentType: file.mimetype
//             }

//             const command = new PutObjectCommand(params)

//             await s3.send(command)

//             urls.push(`https://trans-all-files.s3.ap-south-1.amazonaws.com/${imagename}`);
//         }

//         // If there's only one file, we don't need to return an array
//         if (urls.length === 1) {
//             response.data[uploadField] = urls[0];
//         } else if (urls.length > 1) {
//             response.data[uploadField] = urls;
//         }
//     }

//     res.json(response)
// }
// module.exports = miltipleImageUploadS3

const miltipleImageUploadS3 = async (req, res) => {
    console.log("body data", req.body);
    console.log("files data", req.files);
  
    let response = {
      success: true,
      data: {},
    };
  
    let url; // Declare the url variable here
  
    try {
      for (let uploadField in req.files) {
        let files = req.files[uploadField]; // This is an array of files for each field
        let urls = [];
  
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          let imageName = randomImageName(); // Generate a unique name for the image
          const params = {
            Bucket: bucketName,
            Key: imageName,
            Body: file.buffer,
            ContentType: file.mimetype,
          };
  
          // Upload the file to S3
          await s3.send(new PutObjectCommand(params));
  
          // Generate the URL for the uploaded file
          url = `https://trans-all-files.s3.ap-south-1.amazonaws.com/${imageName}`; // Assign the value to the url variable
          urls.push(url);
        }
  
        // If there's only one file, we don't need to return an array
        if (urls.length === 1) {
          response.data[uploadField] = urls[0];
        } else if (urls.length > 1) {
          response.data[uploadField] = urls;
        }
      }
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong while uploading images",
      });
    }
  };
  
  


module.exports = {singleImageUploadS3, miltipleImageUploadS3}