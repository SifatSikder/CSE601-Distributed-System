const express = require("express");
const router = express.Router();
const Minio = require('minio')
const fs = require('fs');

var minioClient = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

var bucketName = process.env.BUCKETNAME
var region = process.env.REGION


function storeImage(fileMetaData, fileData) {
    const objectName = fileMetaData.filename;
    const metadata = { 'Content-type': 'image', };
    minioClient.putObject(bucketName, objectName, fileData, metadata);
    return `http://minio:9000/${bucketName}/${objectName}`
}


router.post('/:userID/', async (req, res) => {
    let fileData = Buffer.from(req.body.fileData);
    let fileMetaData = req.body.fileMetaData
    let postImageUrl = storeImage(fileMetaData, fileData)
    return res.json({ postImageUrl: postImageUrl })
});



module.exports = router; 