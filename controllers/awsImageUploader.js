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


const S3ImageUploader = async (req, res) => {

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

module.exports = S3ImageUploader