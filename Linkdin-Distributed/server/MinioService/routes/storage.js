const express = require("express");
const router = express.Router();
const Minio = require('minio')


var minioClient = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

var bucketName = process.env.BUCKETNAME
var region = process.env.REGION
var minioBaseUrl = process.env.MINIO_BASE_URL



async function isBucketExistInMinio(bucketName) {
    return await minioClient.bucketExists(bucketName)
}

async function storeImage(fileMetaData, fileData) {
    const objectName = fileMetaData.filename;
    const metadata = { 'Content-type': 'image', };
    let bucketExists = await isBucketExistInMinio(bucketName)
    if (!bucketExists) {
        const policy = `
        {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Action": [
                "s3:GetBucketLocation",
                "s3:ListBucket"
              ],
              "Effect": "Allow",
              "Principal": {
                "AWS": [
                  "*"
                ]
              },
              "Resource": [
                "arn:aws:s3:::${bucketName}"
              ],
              "Sid": ""
            },
            {
              "Action": [
                "s3:GetObject"
              ],
              "Effect": "Allow",
              "Principal": {
                "AWS": [
                  "*"
                ]
              },
              "Resource": [
                "arn:aws:s3:::${bucketName}/*"
              ],
              "Sid": ""
            }
          ]
        }
        `
        await minioClient.makeBucket(bucketName, region);
        await minioClient.setBucketPolicy(bucketName, policy)
    }
    minioClient.putObject(bucketName, objectName, fileData, metadata);
    let imageLink = (`${minioBaseUrl}/${bucketName}/${objectName}`)
    return imageLink
}


router.post('/:userID/', async (req, res) => {
    let fileData = Buffer.from(req.body.fileData);
    let fileMetaData = req.body.fileMetaData
    let postImageUrl = await storeImage(fileMetaData, fileData)
    return res.json({ postImageUrl: postImageUrl })
});



module.exports = router; 