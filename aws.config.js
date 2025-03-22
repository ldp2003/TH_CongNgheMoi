require('dotenv').config();

const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

module.exports = {dynamoDB, s3};