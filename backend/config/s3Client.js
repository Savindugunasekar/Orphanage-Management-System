const { S3Client } = require('@aws-sdk/client-s3');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-north-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});

const s3 = new AWS.S3();

const client = new S3Client({
    region: 'eu-north-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});



module.exports = { client, s3 };