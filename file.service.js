require('dotenv').config();
const {s3} = require('./aws.config');

const randomString = (numberCharacters) => {
    return `${Math.random().toString(36).substring(2, numberCharacters)}`;
}

const FILE_TYPE_MATCH = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/zip",
    "application/x-rar-compressed" ,
    "application/x-7z-compressed",
    "video/mp4",
    "video/mp3",
]

const uploadFile = async (file) => {
    const filePatch = `${randomString(4)}-${new Date().getTime()}-${file?.originalname}`;

    if(FILE_TYPE_MATCH.indexOf(file.mimetype) === -1){
        throw new Error('File type not supported');
    }

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filePatch,
        Body: file.buffer,
        ContentType: file.mimetype,
    }

    try{
        const data = await s3.upload(params).promise();
        const fileName = `${data.Location}`;
        return fileName;
    }catch(err){
        console.error('Error: ', err);
        throw err;
    }
}

module.exports = {uploadFile};